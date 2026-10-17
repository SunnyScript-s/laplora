import { useEffect, useRef, useState } from 'react';
import { addCalendarDays, daysBetween, parseCalendarDate } from '../domain/dates';
import type { CalendarDate } from '../domain/dates';
import { validateInput } from '../domain/inputs';
import type { InputError } from '../domain/inputs';
import { simulate } from '../model/simulate';
import type { SimulatedResult } from '../model/simulate';
import { coveredWeeks, formatStudyDuration, requestStudyPlan, plannerDays } from './studyPlanner';
import type { PlannerDay, StudyPlan } from './studyPlanner';
import { Field, NumberField, controlProps } from './Fields';
import { assessmentLabels, candidate, formatDate, frequencyLabels, friendlyErrors, historyLabels, methodLabels, stepErrors } from './form';
import type { Draft } from './form';
import styles from './App.module.css';

const titles = ['Your starting point', 'A goal to explore', 'Make a realistic plan', 'Check your assumptions'];
const intros = ['Start from an official test or scored full-length practice result.', 'Your target is a reference point. It does not increase modeled growth.', 'A sustainable routine matters more than an ambitious number.', 'Take a moment to check the plan behind your simulation.'];
export function Setup({ draft, update, today, onResult }: { draft: Draft; update: (draft: Draft) => void; today: CalendarDate; onResult: (result: SimulatedResult) => void }) {
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<InputError[]>([]);
  const [baselineMessage, setBaselineMessage] = useState('');
  const [availableDays, setAvailableDays] = useState<PlannerDay[]>(['Monday', 'Wednesday', 'Saturday']);
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [plannerError, setPlannerError] = useState('');
  const [planning, setPlanning] = useState(false);
  const plannerRequestId = useRef(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => { heading.current?.focus(); }, [step]);
  useEffect(() => {
    // An older response must not redraw a schedule after its inputs change.
    plannerRequestId.current += 1;
    setStudyPlan(null);
    setPlannerError('');
    setPlanning(false);
  }, [draft.weeklyStudyHours, draft.studyMethods, draft.practiceTestFrequency, draft.mathSharePercent, availableDays]);
  function move(next: number) { setErrors([]); setBaselineMessage(''); setStep(next); }
  async function buildStudyPlan() {
    if (!availableDays.length) { setPlannerError('Choose at least one day that works for you.'); return; }
    const requestId = ++plannerRequestId.current;
    setPlanning(true); setPlannerError(''); setStudyPlan(null);
    try {
      // Only these schedule preferences are sent. Score and target fields are intentionally excluded.
      const result = await requestStudyPlan({
        weeklyHours: Number(draft.weeklyStudyHours),
        availableDays,
        studyMethods: draft.studyMethods,
        practiceTestFrequency: draft.practiceTestFrequency,
        mathSharePercent: Number(draft.mathSharePercent),
      });
      if (requestId === plannerRequestId.current) setStudyPlan(result);
    } catch (error) {
      if (requestId === plannerRequestId.current) setPlannerError(error instanceof Error ? error.message : 'We could not build your plan. Please try again.');
    } finally { if (requestId === plannerRequestId.current) setPlanning(false); }
  }
  function fail(nextErrors: InputError[]) {
    setErrors(nextErrors);
    requestAnimationFrame(() => {
      const field = nextErrors[0]?.field;
      const control = field ? form.current?.querySelector<HTMLElement>(`[name="${field}"]`) : undefined;
      let ancestor = control?.parentElement;
      while (ancestor) {
        if (ancestor instanceof HTMLDetailsElement) ancestor.open = true;
        ancestor = ancestor.parentElement;
      }
      control?.focus();
    });
  }
  function submit() {
    if (step < 3) {
      const nextErrors = stepErrors(draft, step, today);
      if (nextErrors.length) return fail(nextErrors);
      setErrors([]);
      if (step === 0 && (Number(draft.mathScore) < 200 || Number(draft.readingWritingScore) < 200)) {
        setBaselineMessage('Your PSAT score is valid, but a section is below the SAT floor of 200. Use a scored official full-length SAT practice result to model an SAT trajectory. Your observation has not been changed or rescaled.');
        return;
      }
      move(step + 1);
      return;
    }
    const result = simulate(candidate(draft), today);
    if (result.status === 'invalid-input') {
      const nextErrors = friendlyErrors(result.errors, draft);
      setErrors(nextErrors); return;
    }
    if (result.status === 'needs-sat-baseline') { setBaselineMessage(result.message); return; }
    onResult(result);
  }
  const min = draft.baselineAssessment === 'sat' ? 200 : 160;
  const max = draft.baselineAssessment === 'sat' ? 800 : 760;
  const targetDate = parseCalendarDate(draft.targetDate);
  const days = targetDate ? daysBetween(today, targetDate) : undefined;
  const baselineDate = parseCalendarDate(draft.baselineDate);
  const oldBaseline = baselineDate ? daysBetween(baselineDate, today) > 90 : false;
  const validated = step === 3 ? validateInput(candidate(draft), today) : undefined;
  return <section className={styles.setup}>
    <ol className={styles.steps} aria-label="Setup progress">
      {['Baseline', 'Goal', 'Study plan', 'Review'].map((name, index) => <li key={name} aria-current={step === index ? 'step' : undefined} className={step === index ? styles.activeStep : ''}><span>{index < step ? '✓' : index + 1}</span>{name}</li>)}
    </ol>
    <div key={step} className={styles.enter}>
      <p className={styles.eyebrow}>Step {step + 1} of 4</p>
      <h1 className={styles.pageTitle} ref={heading} tabIndex={-1}>{titles[step]}</h1>
      <p className={styles.description}>{intros[step]}</p>
      <form ref={form} noValidate onSubmit={event => { event.preventDefault(); submit(); }} className={styles.panel}>
        {errors.length > 0 && <div role="alert" className={styles.errorSummary}><strong>Let’s check a few details.</strong><ul>{errors.map((error, index) => <li key={index}>{error.message}{step === 3 && <button type="button" className={styles.textButton} onClick={() => move(error.field === 'targetScore' || error.field === 'targetDate' ? 1 : ['mathScore', 'readingWritingScore', 'baselineDate'].includes(error.field) ? 0 : 2)}>Edit</button>}</li>)}</ul></div>}
        {baselineMessage && <div role="alert" className={styles.callout}>{baselineMessage}</div>}
        {step === 0 && <>
          <div className={styles.fields}>
            <Field field="baselineSource" errors={errors}><select {...controlProps('baselineSource', errors)} value={draft.baselineSource} onChange={e => update({ ...draft, baselineSource: e.target.value as Draft['baselineSource'] })}><option value="official">Official administration</option><option value="official-practice">Official full-length practice</option></select></Field>
            <Field field="baselineAssessment" errors={errors} hint="For practice, choose the assessment the test was designed for."><select {...controlProps('baselineAssessment', errors, true)} value={draft.baselineAssessment} onChange={e => {
              const next = { ...draft, baselineAssessment: e.target.value as Draft['baselineAssessment'] };
              update(next); setBaselineMessage('');
              setErrors(stepErrors(next, 0, today).filter(error => ['mathScore', 'readingWritingScore'].includes(error.field) && next[error.field as 'mathScore' | 'readingWritingScore'] !== ''));
            }}>{Object.entries(assessmentLabels).map(([value, name]) => <option key={value} value={value}>{name}</option>)}</select></Field>
            <Field field="baselineDate" errors={errors}><input {...controlProps('baselineDate', errors)} type="date" max={today} value={draft.baselineDate} onChange={e => update({ ...draft, baselineDate: e.target.value })} /></Field>
            <div className={styles.field}><span className={styles.label}>Baseline total</span><output className={styles.total}>{draft.mathScore !== '' && draft.readingWritingScore !== '' ? Number(draft.mathScore) + Number(draft.readingWritingScore) : '—'}<small>Calculated from sections</small></output></div>
            <NumberField field="mathScore" draft={draft} update={update} errors={errors} min={min} max={max} step={10} hint={`${assessmentLabels[draft.baselineAssessment]}: ${min}–${max}, in increments of 10.`} />
            <NumberField field="readingWritingScore" draft={draft} update={update} errors={errors} min={min} max={max} step={10} hint={`${assessmentLabels[draft.baselineAssessment]}: ${min}–${max}, in increments of 10.`} />
          </div>
          <p className={styles.hint}>Find your section scores in your score report or scored Bluebook result. An unscored test preview is not a baseline.</p>
          <p className={styles.callout}>Your scores and goals stay in this tab’s memory. The optional study-week planner sends only selected scheduling preferences when you choose to use it. Refreshing clears your inputs. No account or identifying information is needed.</p>
        </>}
        {step === 1 && <>
          <div className={styles.fields}>
            <NumberField field="targetScore" draft={draft} update={update} errors={errors} min={400} max={1600} step={10} hint="SAT total: 400–1600, in increments of 10." />
            <Field field="targetDate" errors={errors} hint="Choose a future date within 104 weeks."><input {...controlProps('targetDate', errors, true)} type="date" min={addCalendarDays(today, 1)} max={addCalendarDays(today, 728)} value={draft.targetDate} onChange={e => update({ ...draft, targetDate: e.target.value })} /></Field>
          </div>
          {days !== undefined && days > 0 && <p className={styles.callout}>{Math.floor(days / 7)} weeks and {days % 7} days to explore{days > 182 ? '. This long horizon extrapolates a fixed experimental rate and can overstate progress.' : '.'}</p>}
          <p className={styles.hint}>Your observed score is used as a hypothetical starting point today. We do not estimate improvement since the baseline test.</p>
          {oldBaseline && <p className={styles.callout}>Your baseline is more than 90 days old and may not reflect your current performance. Consider a newer official full-length result.</p>}
          {Number(draft.targetScore) > 0 && Number(draft.targetScore) <= Number(draft.mathScore) + Number(draft.readingWritingScore) && <p className={styles.callout}>Your target is at or below your baseline. It remains a valid reference point and does not change modeled growth.</p>}
        </>}
        {step === 2 && <>
          <div className={styles.fields}>
            <NumberField field="weeklyStudyHours" draft={draft} update={update} errors={errors} min={0} max={40} step={0.25} hint="0–40 hours, in quarter-hour increments. Include tests and review." />
            <div className={styles.consistencyGroup}>
              <NumberField field="consistencyPercent" draft={draft} update={update} errors={errors} min={0} max={100} step={1} hint="How much of your planned study time you expect to complete." />
              <details className={styles.consistencyHelp}>
                <summary>How do I choose my consistency?</summary>
                <p>Think of this as the percentage of your planned study time you expect to actually complete most weeks. Enter planned hours in the Weekly study hours field, then use consistency for missed or shortened sessions.</p>
                <p>For example, if you plan 6 hours each week and usually complete about 4½ hours, enter <strong>75%</strong>. If you typically finish about half your plan, enter <strong>50%</strong>. Choose a realistic average through your test date, allowing for school, activities, and breaks. It is not a measure of motivation or your chance of reaching a score.</p>
              </details>
            </div>
            <Field field="prepHistory" errors={errors}><select {...controlProps('prepHistory', errors)} value={draft.prepHistory} onChange={e => update({ ...draft, prepHistory: e.target.value as Draft['prepHistory'] })}>{Object.entries(historyLabels).map(([value, name]) => <option key={value} value={value}>{name}</option>)}</select></Field>
            <Field field="practiceTestFrequency" errors={errors}><select {...controlProps('practiceTestFrequency', errors)} value={draft.practiceTestFrequency} onChange={e => update({ ...draft, practiceTestFrequency: e.target.value as Draft['practiceTestFrequency'] })}>{Object.entries(frequencyLabels).map(([value, name]) => <option key={value} value={value}>{name}</option>)}</select></Field>
          </div>
          <fieldset className={styles.methods}><legend>Study methods</legend><p id="studyMethods-hint" className={styles.hint}>Choose all that apply, or Not sure yet.</p>
            {Object.entries(methodLabels).map(([value, name]) => <label key={value}><input type="checkbox" name="studyMethods" value={value} checked={draft.studyMethods.includes(value as Draft['studyMethods'][number])} aria-invalid={errors.some(e => e.field === 'studyMethods')} aria-describedby={errors.some(e => e.field === 'studyMethods') ? 'studyMethods-hint studyMethods-error' : 'studyMethods-hint'} onChange={e => {
              const method = value as Draft['studyMethods'][number];
              update({ ...draft, studyMethods: e.target.checked ? method === 'unsure' ? ['unsure'] : [...draft.studyMethods.filter(item => item !== 'unsure'), method] : draft.studyMethods.filter(item => item !== method) });
            }} />{name}</label>)}
            {errors.find(e => e.field === 'studyMethods') && <p id="studyMethods-error" className={styles.error}>{errors.find(e => e.field === 'studyMethods')?.message}</p>}
          </fieldset>
          <p className={styles.callout}>History, methods, and test frequency provide context. This experimental model gives them no separate score bonuses.</p>
          <details><summary>Section allocation · {draft.mathSharePercent}% Math</summary><p className={styles.hint}>Default: half of your study time to each section.</p><NumberField field="mathSharePercent" draft={draft} update={update} errors={errors} min={0} max={100} step={1} hint="The remaining percentage goes to Reading & Writing." /></details>
          <section className={styles.planner} aria-labelledby="planner-title">
            <h2 id="planner-title">Build a study week</h2>
            <p className={styles.hint}>Set your section allocation above, then choose the days that usually work for you. Laplora will show each distinct weekly schedule once.</p>
            <fieldset className={styles.dayChoices}><legend>Available days</legend>
              {plannerDays.map(day => <label key={day}><input type="checkbox" checked={availableDays.includes(day)} onChange={event => setAvailableDays(current => event.target.checked ? [...current, day] : current.filter(value => value !== day))} />{day.slice(0, 3)}</label>)}
            </fieldset>
            <button type="button" className={styles.secondary} onClick={() => void buildStudyPlan()} disabled={planning || draft.studyMethods.length === 0}>{planning ? 'Building your plan…' : 'Build my study week'}</button>
            {plannerError && <p className={styles.plannerError} role="alert">{plannerError}</p>}
            {studyPlan && <div className={styles.schedule} aria-live="polite">
              <h3>Your study schedule</h3>
              <p className={styles.hint}>{formatStudyDuration(studyPlan.weeklyMinutes)} each week · adjust any session to fit your life. Reuse each schedule for the weeks listed below.</p>
              {studyPlan.plans.map((plan, index) => <details key={plan.appliesToWeeks.join('-')} open={index === 0}>
                <summary>{coveredWeeks(plan.appliesToWeeks)} · {formatStudyDuration(plan.totalMinutes)}</summary>
                <p className={styles.subjectBreakdown}><strong>Math study:</strong> {formatStudyDuration(plan.mathMinutes)} · <strong>Reading & Writing study:</strong> {formatStudyDuration(plan.readingWritingMinutes)}{plan.practiceTestMinutes > 0 && <> · <strong>Full-length test:</strong> {formatStudyDuration(plan.practiceTestMinutes)}</>}</p>
                {plan.sessions.length ? <ul>{plan.sessions.map(session => <li key={session.day}><strong>{session.day} · {formatStudyDuration(session.durationMinutes)}</strong><ul>{session.activities.map((activity, activityIndex) => <li key={`${activity.method}-${activityIndex}`}>{formatStudyDuration(activity.durationMinutes)} · {activity.method}{activity.kind === 'practice' && <> · Math {formatStudyDuration(activity.mathMinutes)} · Reading & Writing {formatStudyDuration(activity.readingWritingMinutes)}</>}</li>)}</ul></li>)}</ul> : <p>No study hours entered for this week.</p>}
              </details>)}
              {studyPlan.notes.map(note => <p className={styles.hint} key={note}>{note}</p>)}
            </div>}
            <p className={styles.plannerPrivacy}>Only weekly hours, available days, chosen methods, test frequency, and section allocation are sent to the scheduler. It never receives SAT scores, goals, dates, consistency, or preparation history. The request and schedule are not saved and clear when you refresh this tab. Vercel may process connection metadata; see its <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">privacy policy</a>.</p>
          </section>
        </>}
        {step === 3 && <>
          <div className={styles.reviewRow}><div><h2>Baseline</h2><p>{assessmentLabels[draft.baselineAssessment]} · {draft.baselineSource === 'official' ? 'Official administration' : 'Official full-length practice'} · {formatDate(draft.baselineDate)}</p><p>Math {draft.mathScore} · Reading & Writing {draft.readingWritingScore}</p></div><button type="button" className={styles.textButton} onClick={() => move(0)}>Edit baseline</button></div>
          <div className={styles.reviewRow}><div><h2>Goal</h2><p>{draft.targetScore} SAT total · {formatDate(draft.targetDate)}</p></div><button type="button" className={styles.textButton} onClick={() => move(1)}>Edit goal</button></div>
          <div className={styles.reviewRow}><div><h2>Study plan</h2><p>{draft.weeklyStudyHours} hrs/week · {draft.consistencyPercent}% consistency · {draft.mathSharePercent}% Math</p><p>{historyLabels[draft.prepHistory]} · Tests: {frequencyLabels[draft.practiceTestFrequency]}</p><p>{draft.studyMethods.map(method => methodLabels[method]).join(', ')}</p></div><button type="button" className={styles.textButton} onClick={() => move(2)}>Edit study plan</button></div>
          <div className={styles.callout}><strong>Experimental model · 0.1.0</strong><p>We model diminishing returns and section ceilings under chosen assumptions. Results are not validated predictions or guarantees. The illustrative range varies learning rates; actual results can fall outside it.</p></div>
          {validated?.status === 'valid-input' && <details><summary>Baseline and preparation notes ({validated.warnings.length})</summary><ul>{validated.warnings.map(w => <li key={w.code}>{w.message}</li>)}</ul></details>}
        </>}
        <div className={styles.formActions}>
          {step > 0 ? <button type="button" className={styles.secondary} onClick={() => move(step - 1)}>Back</button> : <span className={styles.hint}>Start with what you know.</span>}
          <button className={styles.primary} type="submit">{step === 3 ? 'Run simulation' : ['Next: your goal', 'Next: study plan', 'Review your plan'][step]} <span aria-hidden="true">→</span></button>
        </div>
      </form>
    </div>
  </section>;
}
