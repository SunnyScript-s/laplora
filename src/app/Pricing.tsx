import { freeFeatures, proFeatures, tiers, offers, formatOfferPrice } from '../product/plans';
import shared from './App.module.css';
import styles from './Pricing.module.css';

type PricingProps = { onUseFree: () => void; hasActivePlan: boolean };

export function Pricing({ onUseFree, hasActivePlan }: PricingProps) {
  return <section className={`${styles.pricing} ${shared.enter}`}>
    <div className={styles.intro}>
      <p className={shared.eyebrow}><span className={shared.smallDot} /> More room for your preparation</p>
      <h1 className={shared.pageTitle}>Laplora Pro</h1>
      <p className={shared.description}>Explore your possibilities for free. A deeper view of your progress is planned for Laplora Pro.</p>
      <p className={shared.hint}>The free simulator is available now. Both paid options below are Coming Soon.</p>
    </div>

    <div className={styles.tiers}>
      <article className={`${shared.panel} ${styles.tier}`} aria-labelledby="free-title">
        <div className={shared.chartHeader}><h2 id="free-title">{tiers.free.name}</h2><span className={shared.badge}>Available now</span></div>
        <p className={styles.price}>$0 <span>Free</span></p>
        <p className={styles.summary}>A clearer view of the plan in front of you.</p>
        <ul className={styles.features}>
          {freeFeatures.map(feature => <li key={feature.id}>{feature.label}</li>)}
          <li>No account required</li>
        </ul>
        <p className={shared.hint}>Your current plan and one alternative can already be compared for free.</p>
        <div className={styles.cardFoot}>
          <button className={shared.primary} onClick={onUseFree}>{hasActivePlan ? 'Continue your simulation' : 'Start free simulation'} <span aria-hidden="true">→</span></button>
          <p className={shared.hint}>No signup. No payment details.</p>
        </div>
      </article>

      <article className={`${shared.panel} ${styles.tier} ${styles.pro}`} aria-labelledby="pro-title">
        <div className={shared.chartHeader}><h2 id="pro-title">{tiers.pro.name}</h2><span className={shared.badge}>Coming Soon</span></div>
        <p className={styles.price}>{formatOfferPrice(offers.proMonthly)} <span>/month · planned</span></p>
        <p className={styles.summary}>Connect your preparation across time.</p>
        <p className={shared.hint}>Everything in Free, plus these planned features:</p>
        <ul className={styles.features}>
          {proFeatures.map(feature => <li key={feature.id}>{feature.label}</li>)}
        </ul>
        <div className={styles.cardFoot}>
          <p className={styles.unavailable}>Coming Soon · Not available for purchase</p>
          <p className={shared.hint}>Pro features are in planning and are not available yet.</p>
        </div>
      </article>
    </div>

    <article className={`${shared.panel} ${styles.pass}`} aria-labelledby="pass-title">
      <div>
        <p className={shared.eyebrow}>A potential alternative</p>
        <div className={shared.chartHeader}><h2 id="pass-title">{offers.prepPass.durationDays}-day SAT Prep Pass</h2><span className={shared.badge}>Coming Soon</span></div>
        <p className={styles.summary}>One focused preparation window. We’re considering {offers.prepPass.durationDays} days of access to planned Pro features with a single payment.</p>
        <p className={shared.hint}>This option is still being evaluated and is not available for purchase.</p>
      </div>
      <p className={styles.price}>{formatOfferPrice(offers.prepPass)} <span>one-time · {offers.prepPass.durationDays} days</span></p>
    </article>

    <section className={`${shared.panel} ${styles.comparison}`} aria-labelledby="compare-title">
      <h2 id="compare-title">Find your fit</h2>
      <table className={styles.comparisonTable}>
        <caption>Free features work today. Pro features and prices are planned.</caption>
        <thead><tr><th scope="col">Feature</th><th scope="col">Free</th><th scope="col">Pro <span className={styles.planned}>Coming Soon</span></th></tr></thead>
        <tbody>
          {freeFeatures.map(feature => <tr key={feature.id}><th scope="row">{feature.comparison}</th><td>{feature.id === 'basic-simulations' ? 'Unlimited, one at a time' : 'Included'}</td><td>Included at launch</td></tr>)}
          <tr><th scope="row">Current plan vs. one alternative</th><td>Included</td><td>Included at launch</td></tr>
          {proFeatures.map(feature => <tr key={feature.id}><th scope="row">{feature.label}</th><td>Not included</td><td>Planned</td></tr>)}
        </tbody>
      </table>
    </section>

    <div className={styles.notes}>
      <p>Multiple-strategy comparison in Pro would bring several saved plans together. The current free comparison stays available.</p>
      <p>Free inputs stay in this tab and clear on refresh. Saved history, practice-score tracking, and reports are planned Pro features.</p>
      <p>Prices are shown in USD. Paid options are Coming Soon; there is no checkout or paid signup. All score trajectories remain experimental simulations, with no guaranteed results.</p>
    </div>
  </section>;
}
