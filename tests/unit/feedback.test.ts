import { describe, expect, it } from 'vitest';
import { feedbackSchema } from '../../src/app/feedbackValidation';

const valid = { category: 'issue', message: 'The chart labels overlap on my phone.' };
describe('feedback payload validation', () => {
  it('accepts minimal anonymous feedback without optional fields', () => {
    expect(feedbackSchema.parse(valid)).toEqual(valid);
  });
  it('trims input and preserves explicit optional values', () => {
    expect(feedbackSchema.parse({ ...valid, message: `  ${valid.message}  `, rating: 5, device: ' Safari ' })).toEqual({ ...valid, rating: 5, device: 'Safari' });
  });
  it.each([
    { category: 'unknown' }, { message: '' }, { message: '            ' },
    { message: 'x'.repeat(2001) }, { device: 'x'.repeat(121) },
    { rating: 0 }, { rating: 6 }, { rating: 1.5 }, { rating: NaN }, { rating: '5' },
    { mathScore: 600 }, { email: 'private@example.test' },
  ])('rejects invalid or unexpected fields: %j', change => {
    expect(feedbackSchema.safeParse({ ...valid, ...change }).success).toBe(false);
  });
  it('accepts every requested category and boundary values', () => {
    for (const category of ['issue', 'idea', 'confusing', 'general']) {
      expect(feedbackSchema.safeParse({ category, message: 'x'.repeat(2000), rating: 1, device: 'x'.repeat(120) }).success).toBe(true);
    }
  });
});
