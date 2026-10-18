import { useEffect, useRef, useState } from 'react';
import { addCalendarDays, localCalendarDate } from '../domain/dates';
import { simulate } from '../model/simulate';
import type { SimulatedResult } from '../model/simulate';
import { emptyDraft } from './form';
import { Setup } from './Setup';
import { Results } from './Results';
import { ScoreChart } from './ScoreChart';
import { HowItWorks } from './HowItWorks';
import { ArrowIcon } from './ArrowIcon';
import { ReferenceAtmosphere } from './ReferenceAtmosphere';
import { Pricing } from './Pricing';
import { Feedback } from './Feedback';
import { BetaInfo } from './BetaInfo';
import laploraLogo from '../assets/laplora-header-logo.png?inline';
import styles from './App.module.css';

type WorkspaceView = 'home' | 'setup' | 'results';
type View = WorkspaceView | 'how' | 'pricing' | 'beta';
export function App() {
  const [view, setView] = useState<View>('home');
  const [returnView, setReturnView] = useState<WorkspaceView>('home');
  const [draft, setDraft] = useState(emptyDraft);
  const [result, setResult] = useState<SimulatedResult>();
  const [today] = useState(() => localCalendarDate(new Date()));
  const main = useRef<HTMLElement>(null);
  const previousView = useRef(view);
  useEffect(() => {
    document.title = view === 'home' ? "Laplora | See What's Possible" : `Laplora — ${view === 'results' ? 'Your modeled trajectories' : view === 'setup' ? 'Your preparation plan' : view === 'how' ? 'How it works' : view === 'pricing' ? 'Laplora Pro & pricing' : 'About the beta'}`;
    if (previousView.current !== view) {
      const heading = [...(main.current?.querySelectorAll('h1') ?? [])].find(element => !element.closest('[hidden]'));
      heading?.setAttribute('tabindex', '-1'); heading?.focus();
      window.scrollTo({ top: 0 });
    }
    previousView.current = view;
  }, [view]);
  const example = simulate({ baselineSource: 'official-practice', baselineAssessment: 'sat', baselineDate: today, mathScore: 600, readingWritingScore: 600, targetScore: 1400, targetDate: addCalendarDays(today, 84), weeklyStudyHours: 3, consistencyPercent: 70, prepHistory: 'just-starting', studyMethods: ['mistake-review'], practiceTestFrequency: 'every-four-weeks', mathSharePercent: 50 }, today);
  const isInformationView = view === 'how' || view === 'pricing' || view === 'beta';
  function openInformation(next: 'how' | 'pricing' | 'beta') {
    if (view === 'home' || view === 'setup' || view === 'results') setReturnView(view);
    setView(next);
  }
  function startOver() {
    if ((draft.mathScore || draft.readingWritingScore || draft.baselineDate || draft.targetScore || draft.targetDate || result) && !window.confirm('Clear your entered plan and results? This cannot be restored.')) return;
    setDraft(emptyDraft()); setResult(undefined); setView('home');
  }
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <div className={styles.shell}>
      <div className={styles.atmosphere} aria-hidden="true">
        <ReferenceAtmosphere />
        <div className={styles.orb} /><div className={styles.orbTwo} />
        <div className={styles.rotor}>
          <div className={styles.rotorRing}><span className={styles.satellite} /><span className={styles.satelliteTwo} /></div>
          <div className={styles.rotorCore} />
        </div>
        <div className={styles.horizon} />
      </div>
      <header className={styles.header}>
        <div className={styles.brand}>
        <button className={styles.wordmark} aria-label="Laplora home" onClick={() => setView('home')}>
          <span className={styles.logoFrame}><img className={styles.logo} src={laploraLogo} width="1366" height="768" alt="" /></span>
        </button>
        <button className={styles.betaBadge} aria-label="About the beta" aria-current={view === 'beta' ? 'page' : undefined} onClick={() => openInformation('beta')}>Beta</button>
        </div>
        <nav aria-label="Main navigation">
          <button className={styles.navButton} aria-current={view === 'how' ? 'page' : undefined} onClick={() => openInformation('how')}>How it works</button>
          <button className={styles.navButton} aria-current={view === 'pricing' ? 'page' : undefined} onClick={() => openInformation('pricing')}>Laplora Pro</button>
          {view === 'home' ? <button className={styles.secondary} onClick={() => setView('setup')}>Start simulation <span aria-hidden="true">→</span></button> : <button className={styles.navButton} onClick={startOver}>Start over</button>}
        </nav>
      </header>
      <main id="main" tabIndex={-1} ref={main} className={styles.main}>
        {view === 'home' && <section className={`${styles.hero} ${styles.enter}`}>
          <div className={styles.heroCopy}>
            <h1>A clearer view of your <span>SAT journey.</span></h1>
            <p className={styles.heroDescription}>Explore how different preparation plans could shape possible score growth—with transparent assumptions and room for uncertainty.</p>
            <button className={styles.primary} onClick={() => setView('setup')}>Explore your preparation <span aria-hidden="true">→</span></button>
            <p className={styles.hint}>Start from an existing score. No quiz. No account.</p>
            <button className={styles.textButton} onClick={() => openInformation('pricing')}>Explore Laplora Pro <span aria-hidden="true">→</span></button>
            <div className={styles.heroTrust}><span>Separate section models</span><span>Compare study plans</span><span>Clear assumptions</span></div>
          </div>
          {example.status === 'simulated' && <div className={`${styles.panel} ${styles.preview}`}>
            <div className={styles.chartHeader}><h2>A plan, made visible</h2><span className={styles.badge}>Synthetic example</span></div>
            <p className={styles.hint}>1200 baseline · 12 weeks · 3 hrs/week · 70% consistency</p>
            <div className={styles.previewScore}>1200 <span aria-hidden="true">→</span> {example.trajectories.central.displayedEndpoint.total}</div>
            <p className={styles.hint}>Central modeled total under experimental assumptions</p>
            <ScoreChart result={example} section="total" compact />
            <div className={styles.previewRange}><span>Illustrative assumption range</span><strong>{example.trajectories.slower.displayedEndpoint.total}–{example.trajectories.faster.displayedEndpoint.total}</strong></div>
            <p className={styles.hint}>Modeled possibilities, never a promised score. This range does not cover all test-day outcomes.</p>
          </div>}
          <div className={styles.landingNote}><span className={styles.noteIcon}><ArrowIcon size={24} /></span><div><h2>A better question than “What will I score?”</h2><p>What changes when you study more consistently, give a section more time, or try a different preparation plan? Explore the model, then bring what you learn back to your practice.</p></div><button className={styles.textButton} onClick={() => { setReturnView('home'); setView('how'); }}>Meet the model <span aria-hidden="true">→</span></button></div>
        </section>}
        {(view === 'setup' || (isInformationView && returnView === 'setup')) && <div hidden={view !== 'setup'}><Setup draft={draft} update={setDraft} today={today} onResult={next => { setResult(next); setView('results'); }} /></div>}
        {(view === 'results' || (isInformationView && returnView === 'results')) && result && <div hidden={view !== 'results'}><Results result={result} onEdit={() => setView('setup')} /></div>}
        {isInformationView && <><button className={styles.textButton} onClick={() => setView(returnView)}>← Back to {returnView === 'results' ? 'results' : returnView === 'setup' ? 'your plan' : 'home'}</button>{view === 'how' ? <HowItWorks /> : view === 'beta' ? <BetaInfo /> : <Pricing hasActivePlan={returnView !== 'home'} onUseFree={() => setView(returnView === 'home' ? 'setup' : returnView)} />}</>}
      </main>
      <footer className={styles.footer}><span>Laplora · Preparation, in perspective.</span><span>Made by Santiago Harbison</span><Feedback /><span>Experimental simulation. Independent of College Board.</span></footer>
    </div>
  </>;
}
