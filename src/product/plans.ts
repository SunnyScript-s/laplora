// Product descriptions only. These definitions do not grant access or process payments.
// Future account/subscription services can reference stable tier, offer, and feature IDs.
export const freeFeatures = [
  { id: 'basic-simulations', label: 'Unlimited basic SAT score simulations, one at a time', comparison: 'Basic SAT simulations' },
  { id: 'trajectory-graphs', label: 'Basic score trajectory graphs', comparison: 'Score trajectory graphs' },
  { id: 'section-estimates', label: 'Math and Reading & Writing estimates', comparison: 'Math and Reading & Writing estimates' },
] as const;

export const proFeatures = [
  { id: 'saved-history', label: 'Saved simulation history' },
  { id: 'practice-score-tracking', label: 'Track actual SAT practice-test scores' },
  { id: 'multiple-strategies', label: 'Compare multiple study strategies' },
  { id: 'advanced-analytics', label: 'Advanced progress analytics' },
  { id: 'study-plan-adjustments', label: 'Personalized study-plan adjustments' },
  { id: 'progress-reports', label: 'Exportable progress reports' },
] as const;

export type FeatureId = typeof freeFeatures[number]['id'] | typeof proFeatures[number]['id'];
export type TierId = 'free' | 'pro';

type TierDefinition = Readonly<{
  name: string;
  availability: 'available' | 'planned';
  featureIds: readonly FeatureId[];
}>;

export const tiers = {
  free: { name: 'Laplora Free', availability: 'available', featureIds: freeFeatures.map(feature => feature.id) },
  pro: { name: 'Laplora Pro', availability: 'planned', featureIds: [...freeFeatures, ...proFeatures].map(feature => feature.id) },
} as const satisfies Record<TierId, TierDefinition>;

type PlannedOffer = Readonly<{
  tierId: 'pro';
  amountCents: number;
  currency: 'USD';
  availability: 'planned' | 'under-consideration';
}> & (Readonly<{ billing: 'monthly' }> | Readonly<{ billing: 'one-time'; durationDays: number }>);

export const offers = {
  proMonthly: { tierId: 'pro', amountCents: 499, currency: 'USD', availability: 'planned', billing: 'monthly' },
  prepPass: { tierId: 'pro', amountCents: 999, currency: 'USD', availability: 'under-consideration', billing: 'one-time', durationDays: 90 },
} as const satisfies Record<string, PlannedOffer>;

export function formatOfferPrice(offer: PlannedOffer): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: offer.currency }).format(offer.amountCents / 100);
}
