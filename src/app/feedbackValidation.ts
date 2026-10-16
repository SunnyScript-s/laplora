import { z } from 'zod';

// A public form endpoint, not an API secret. No provider script is loaded.
export const FEEDBACK_ENDPOINT = 'https://formspree.io/f/mdeaydqy';
export const FEEDBACK_COOLDOWN_MS = 30_000;

export const feedbackSchema = z.object({
  category: z.enum(['issue', 'idea', 'confusing', 'general'], { error: 'Choose a feedback category.' }),
  message: z.string().trim().min(10, 'Please describe what happened in at least 10 characters.').max(2000, 'Keep your message to 2,000 characters or fewer.'),
  rating: z.number().int().min(1).max(5).optional(),
  device: z.string().trim().max(120, 'Keep the browser/device description to 120 characters or fewer.').optional(),
}).strict();
