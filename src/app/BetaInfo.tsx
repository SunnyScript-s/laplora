import { MODEL_V01 } from '../model/parameters';
import styles from './App.module.css';

export function BetaInfo() {
  return <section className={`${styles.how} ${styles.enter}`}>
    <p className={styles.eyebrow}>Help shape a clearer preparation tool</p>
    <h1 className={styles.pageTitle}>About the Laplora beta</h1>
    <p className={styles.description}>An experimental educational tool for exploring SAT preparation—not a promise of a future score.</p>
    <div className={styles.panel}>
      <h2>What you can explore</h2>
      <p>Start with an existing SAT, PSAT/NMSQT, PSAT 10, or official full-length practice result. Enter your section scores, goal, test date, and preparation plan. Compare how different hours, consistency, and Math/Reading & Writing allocations change the modeled trajectories.</p>
      <p>Use the graph and its score table to compare assumptions. Keep weekly hours realistic and include time for practice tests and review. Your goal is a reference point, not an input that boosts the curve.</p>
      <h2>What the results mean</h2>
      <p>Laplora’s projections are not scientifically validated predictions or guaranteed SAT scores. The current model ({MODEL_V01.version}) uses experimental assumptions, not coefficients fitted to individual students’ outcomes.</p>
      <p>The slower-to-faster range changes one learning-rate assumption. It is not a statistical confidence interval. Actual results can fall outside it or decrease from your starting score. Test-day conditions, measurement variability, individual learning differences, and changes in study habits are not fully represented.</p>
      <p>Use these comparisons to ask better preparation questions alongside official practice and guidance from a teacher or counselor. Laplora is independent of College Board.</p>
      <h2>Feedback that helps</h2>
      <p>Use <strong>Send Feedback</strong> at the bottom of any page to report a bug, suggest a feature, describe something confusing, or share general feedback. Tell us what you tried, what you expected, and what happened instead.</p>
      <p>You can optionally rate usefulness from 1 to 5 and type a short browser/device description, such as “Safari on iPhone.” Please leave out names, email addresses, school details, and actual scores. No screenshot or study-plan data is attached automatically.</p>
      <h2>How the model will improve</h2>
      <p>First, beta feedback will help improve usability and explanations. Assessing predictive accuracy will require a separate, consented evaluation using suitable anonymized data, comparisons against simple alternatives, and independent held-out results. That validation work has not been completed.</p>
      <p>Mathematical tests check whether the software follows its equations; they do not establish prediction accuracy. Any future model changes will need documented evidence and review. The production coefficients are unchanged in this beta update.</p>
      <h2>Your privacy</h2>
      <p>Simulations run in your browser. Scores, goals, and study plans remain in this tab’s memory and clear on refresh. They are not sent to Formspree, analytics, or a score database. There are no student accounts.</p>
      <p>Feedback is optional. Only the category, message, and any optional rating or device description you choose to enter are sent to Laplora’s private Formspree inbox when you submit. Feedback drafts stay in tab memory until sent or the page is refreshed. We do not request contact information, so we cannot reply personally.</p>
      <p>Formspree stores submitted feedback for the project owner to review and delete. It does not disappear when you close the tab. Formspree and Vercel may process connection details such as IP addresses in service and security logs. Anonymous form fields do not make network requests untraceable.</p>
      <p><a href="https://formspree.io/legal/privacy-policy/" target="_blank" rel="noopener noreferrer">Formspree privacy policy</a> · <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Vercel privacy policy</a></p>
    </div>
  </section>;
}
