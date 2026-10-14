import { useEffect, useRef, useState } from 'react';
import { compareScenario, increasedPractice } from '../model/scenarios';
import type { ScenarioComparison } from '../model/scenarios';
import { displayScores } from '../model/math';
import type { SimulatedResult } from '../model/simulate';
import { parseNumericInput } from '../domain/inputs';
import type { InputError } from '../domain/inputs';
import { assessmentLabels, formatDate, frequencyLabels, friendlyErrors, historyLabels, labels, methodLabels } from './form';
import { ScoreChart } from './ScoreChart';
import { ArrowIcon } from './ArrowIcon';
import type { ChartSection } from './ScoreChart';
import styles from './App.module.css';

export function Results({ result, onEdit }: { result: SimulatedResult; onEdit: () => void }) {
  const [section, setSection] = useState<ChartSection>('total');
  const [comparison, setComparison] = useState<ScenarioComparison>();
  const [comparisonName, setComparisonName] = useState('');
  const [hours, setHours] = useState(String(result.input.weeklyStudyHours));
  const [consistency, setConsistency] = useState(String(result.input.consistencyPercent));
  const [allocation, setAllocation] = useState(String(result.input.mathSharePercent));
  const [history, setHistory] = useState(result.input.prepHistory);
  const [methods, setMethods] = useState(result.input.studyMethods);
  const [frequency, setFrequency] = useState(result.input.practiceTestFrequency);
  const [errors, setErrors] = useState<InputError[]>([]);
  const heading = useRef<HTMLHeadingElement>(null);
  const errorBox = useRef<HTMLDivElement>(null);
  useEffect(() => { heading.current?.focus(); }, []);
  const scores = result.trajectories.central.displayedEndpoint;
  const range = `${result.trajectories.slower.displayedEndpoint.total}–${result.trajectories.faster.displayedEndpoint.total}`;
  const preset = increasedPractice(result.input, result.simulationStartDate);
  function reset() {
    setComparison(undefined); setComparisonName(''); setErrors([]);
    setHours(String(result.input.weeklyStudyHours)); setConsistency(String(result.input.consistencyPercent)); setAllocation(String(result.input.mathSharePercent)); setHistory(result.input.prepHistory); setMethods(result.input.studyMethods); setFrequency(result.input.practiceTestFrequency);
  }
  function valueText(field: keyof typeof labels, value: unknown) {
    if (field === 'studyMethods' && Array.isArray(value)) return value.map(v => methodLabels[v as keyof typeof methodLabels]).join(', ');
    if (field === 'prepHistory') return historyLabels[value as keyof typeof historyLabels];
    if (field === 'practiceTestFrequency') return frequencyLabels[value as keyof typeof frequencyLabels];
    return `${value}${field === 'consistencyPercent' || field === 'mathSharePercent' ? '%' : field === 'weeklyStudyHours' ? ' hrs/week' : ''}`;
  }
  function errorProps(field: InputError['field']) {
    const invalid = errors.some(error => error.field === field);
    return { 'aria-invalid': invalid, 'aria-describedby': invalid ? 'custom-plan-errors' : undefined };
  }
  return <section className={styles.enter}>
    <div className={styles.resultHeading}><div><p className={styles.eyebrow}>Your preparation, in perspective</p><h1 className={styles.pageTitle} tabIndex={-1} ref={heading}>Explore the paths ahead.</h1></div><button className={styles.secondary} onClick={onEdit}>Edit preparation</button></div>
    <p className={styles.description}>{assessmentLabels[result.input.baselineAssessment]} {result.input.baselineSource === 'official' ? 'official' : 'official practice'} baseline from {formatDate(result.observedBaseline.date)} · Modeled from {formatDate(result.simulationStartDate)} to {formatDate(result.input.targetDate)}</p>
    <div className={styles.metrics}>
      <div className={styles.panel}><p className={styles.hint}>Observed baseline</p><div className={styles.score}>{result.observedBaseline.total}</div><p className={styles.hint}>Math {result.observedBaseline.math} · RW {result.observedBaseline.readingWriting}</p></div>
      <div className={styles.panel}><p className={styles.hint}>Central modeled total</p><div className={styles.score}>{scores.total}</div><p className={styles.hint}>Math {scores.math} · RW {scores.readingWriting}</p></div>
      <div className={styles.panel}><p className={styles.hint}>Illustrative assumption range</p><div className={`${styles.score} ${styles.rangeScore}`}>{range}</div><p className={styles.hint}>Not a confidence interval</p></div>
    </div>
    <div className={styles.resultsGrid}>
      <div className={styles.panel}>
        <div className={styles.chartHeader}><h2>Score over time</h2><div className={styles.segmented} role="group" aria-label="Chart section">{(['total', 'math', 'readingWriting'] as const).map(key => <button key={key} aria-pressed={section === key} onClick={() => setSection(key)}>{key === 'readingWriting' ? 'RW' : key === 'total' ? 'Total' : 'Math'}</button>)}</div></div>
        <ScoreChart result={result} {...(comparison ? { comparison: comparison.scenario } : {})} section={section} />
        <div className={styles.legend}><span><i />Current plan</span>{comparison && <span><i className={styles.comparisonDot} />{comparisonName} (dashed)</span>}<span>Shading: current-plan assumptions</span></div>
        <p className={styles.callout}>The range varies an experimental learning-rate assumption. Actual outcomes can fall outside it, including below your baseline. This is a simulation, never a promised score.</p>
        <p className={styles.hint}>Target SAT total: <strong>{result.input.targetScore}</strong>. {result.goal.centralGap > 0 ? `The central model is ${result.goal.centralGap} points below your target.` : result.goal.centralGap < 0 ? `The central model is ${-result.goal.centralGap} points above your target.` : 'The central model matches your target.'} This does not establish whether your target is attainable.</p>
        <details className={styles.dataDetails}><summary>View date and section data</summary><div className={styles.tableScroll} tabIndex={0} role="region" aria-label="Trajectory data"><table><caption>Rounded weekly scores and exact test-date endpoint. Range belongs to the current plan.</caption><thead><tr><th scope="col">Date</th><th scope="col">Math</th><th scope="col">RW</th><th scope="col">Total</th><th scope="col">Range</th>{comparison && <th scope="col">Comparison total</th>}</tr></thead><tbody>{result.trajectories.central.points.map((point, index) => {
          const displayed = displayScores(point);
          const slower = displayScores(result.trajectories.slower.points[index]!);
          const faster = displayScores(result.trajectories.faster.points[index]!);
          const other = comparison?.scenario.trajectories.central.points[index];
          return <tr key={point.date}><th scope="row">{formatDate(point.date)}</th><td>{displayed.math}</td><td>{displayed.readingWriting}</td><td>{displayed.total}</td><td>{slower.total}–{faster.total}</td>{comparison && <td>{other ? displayScores(other).total : '—'}</td>}</tr>;
        })}</tbody></table></div></details>
      </div>
      <aside className={styles.panel} aria-label="Scenario comparison">
        <h2>Compare preparation plans</h2><p className={styles.hint}>Same baseline, goal, dates, and model. Change only your study plan.</p>
        <div className={styles.planCard}><strong>Current Plan</strong><p>{result.input.weeklyStudyHours} hrs/week · {result.input.consistencyPercent}% consistency</p><span className={styles.hint}>{scores.total} central modeled total</span></div>
        <button className={`${styles.planCard} ${styles.preset}`} disabled={preset.status === 'preset-unavailable'} aria-pressed={comparisonName === 'Increased Practice'} onClick={() => { if (preset.status === 'compared') { setComparison(preset); setComparisonName('Increased Practice'); setErrors([]); } }}><strong>Increased Practice <ArrowIcon size={14} /></strong><span>{preset.status === 'compared' ? `${preset.scenario.input.weeklyStudyHours} hrs/week · ${preset.scenario.input.consistencyPercent}% consistency` : 'Already at the 40-hour limit'}</span><span className={styles.hint}>{preset.status === 'compared' ? `${preset.scenario.trajectories.central.displayedEndpoint.total} central modeled total` : 'Try a custom consistency or allocation change.'}</span></button>
        <form noValidate onSubmit={event => {
          event.preventDefault();
          const next = compareScenario(result.input, result.simulationStartDate, { weeklyStudyHours: parseNumericInput(hours), consistencyPercent: parseNumericInput(consistency), mathSharePercent: parseNumericInput(allocation), prepHistory: history, studyMethods: methods, practiceTestFrequency: frequency });
          if (next.status === 'invalid-input') {
            const displayErrors = friendlyErrors(next.errors, { ...result.input, mathScore: String(result.input.mathScore), readingWritingScore: String(result.input.readingWritingScore), targetScore: String(result.input.targetScore), weeklyStudyHours: hours, consistencyPercent: consistency, mathSharePercent: allocation, prepHistory: history, studyMethods: methods, practiceTestFrequency: frequency });
            setErrors(displayErrors); requestAnimationFrame(() => errorBox.current?.focus()); return;
          }
          if (next.status === 'compared') { setComparison(next); setComparisonName('Custom Scenario'); setErrors([]); }
        }}>
          <h3>Custom Scenario</h3>
          {errors.length > 0 && <div id="custom-plan-errors" ref={errorBox} tabIndex={-1} role="alert" className={styles.errorSummary}><ul>{errors.map((error, index) => <li key={index}>{labels[error.field as keyof typeof labels] ?? 'Plan'}: {error.message}</li>)}</ul></div>}
          <label className={styles.label} htmlFor="custom-hours">Weekly hours</label><input {...errorProps('weeklyStudyHours')} id="custom-hours" type="number" min={0} max={40} step={0.25} value={hours} onChange={e => setHours(e.target.value)} />
          <label className={styles.label} htmlFor="custom-consistency">Consistency (%)</label><input {...errorProps('consistencyPercent')} id="custom-consistency" type="number" min={0} max={100} step={1} value={consistency} onChange={e => setConsistency(e.target.value)} />
          <details><summary>Allocation and context</summary><label className={styles.label} htmlFor="custom-allocation">Math share (%)</label><input {...errorProps('mathSharePercent')} id="custom-allocation" type="number" min={0} max={100} step={1} value={allocation} onChange={e => setAllocation(e.target.value)} />
            <label className={styles.label} htmlFor="custom-history">Preparation experience</label><select id="custom-history" value={history} onChange={e => setHistory(e.target.value as typeof history)}>{Object.entries(historyLabels).map(([value, text]) => <option value={value} key={value}>{text}</option>)}</select>
            <label className={styles.label} htmlFor="custom-frequency">Practice-test frequency</label><select id="custom-frequency" value={frequency} onChange={e => setFrequency(e.target.value as typeof frequency)}>{Object.entries(frequencyLabels).map(([value, text]) => <option value={value} key={value}>{text}</option>)}</select>
            <fieldset className={styles.methods}><legend>Study methods</legend>{Object.entries(methodLabels).map(([value, text]) => <label key={value}><input {...errorProps('studyMethods')} type="checkbox" checked={methods.includes(value as typeof methods[number])} onChange={e => { const method = value as typeof methods[number]; setMethods(e.target.checked ? method === 'unsure' ? ['unsure'] : [...methods.filter(m => m !== 'unsure'), method] : methods.filter(m => m !== method)); }} />{text}</label>)}</fieldset>
          </details>
          <button type="submit" className={styles.primary}>Apply custom plan</button>
        </form>
        <button className={styles.textButton} onClick={reset}>Reset comparison</button>
        <div role="status" className={styles.comparisonSummary}>{comparison && <><h3>{comparisonName}</h3><p><strong>{comparison.scenario.trajectories.central.displayedEndpoint.total}</strong> central modeled total</p><ul>{comparison.changes.map(change => <li key={change.field}>{labels[change.field]}: {valueText(change.field, change.before)} → {valueText(change.field, change.after)}</li>)}</ul><p>{comparison.explanation}</p></>}</div>
        <p className={styles.hint}>Methods and preparation history provide context; V0.1 assigns no separate score bonuses.</p>
      </aside>
    </div>
    <details className={`${styles.panel} ${styles.assumptions}`}><summary>Assumptions and preparation notes · {result.model.version}</summary><ul>{result.assumptions.map(text => <li key={text}>{text}</li>)}</ul><h3>Your plan’s notes</h3><ul>{result.warnings.map(w => <li key={w.code}>{w.message}</li>)}</ul>{comparison && <><h3>Comparison plan’s notes</h3><ul>{comparison.scenario.warnings.map(w => <li key={w.code}>{w.message}</li>)}</ul></>}</details>
  </section>;
}
