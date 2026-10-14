import styles from './App.module.css';

export function App() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className={styles.shell}>
        <header className={styles.header}>
          <span className={styles.wordmark}>Laplora<span aria-hidden="true">.</span></span>
          <span className={styles.status}>In development</span>
        </header>
        <main id="main" tabIndex={-1} className={styles.intro}>
          <p className={styles.eyebrow}>A little clarity for the journey ahead</p>
          <h1>A clearer view of your SAT journey.</h1>
          <p className={styles.description}>
            We’re building a way to explore how different preparation plans could
            shape possible score growth—with transparent assumptions and room for uncertainty.
          </p>
          <div className={styles.notice}>
            <h2>Thoughtfully modeled. Never guaranteed.</h2>
            <p>
              Laplora is an experimental educational project. The simulator is in
              development; score simulations are not available yet.
            </p>
          </div>
          <a className={styles.link} href="https://satsuite.collegeboard.org/practice/practice-tests/bluebook">
            Explore official full-length practice tests{' '}
            <svg aria-hidden="true" focusable="false" width="14" height="14" viewBox="0 0 16 16">
              <path d="M4 12 12 4M4 4h8v8" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </a>
        </main>
        <footer className={styles.footer}>
          Independent project. Not affiliated with College Board.
        </footer>
      </div>
    </>
  );
}
