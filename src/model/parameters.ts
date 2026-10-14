/** Founder-approved experimental assumptions, not fitted prediction coefficients. */
export const MODEL_V01 = Object.freeze({
  version: '0.1.0-experimental',
  sectionCeiling: 800,
  saturationHours: Object.freeze({ math: 4, readingWriting: 4 }),
  learningRates: Object.freeze({
    slower: Object.freeze({ math: 0.006, readingWriting: 0.006 }),
    central: Object.freeze({ math: 0.012, readingWriting: 0.012 }),
    faster: Object.freeze({ math: 0.018, readingWriting: 0.018 }),
  }),
});

export type SensitivityCase = keyof typeof MODEL_V01.learningRates;
export const SENSITIVITY_CASES: readonly SensitivityCase[] = Object.freeze(['slower', 'central', 'faster']);
