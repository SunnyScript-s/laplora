import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import shared from './App.module.css';
import styles from './Feedback.module.css';
import { FEEDBACK_COOLDOWN_MS, FEEDBACK_ENDPOINT, feedbackSchema } from './feedbackValidation';

export function Feedback() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [category, setCategory] = useState('issue');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState('');
  const [device, setDevice] = useState('');
  const [website, setWebsite] = useState('');
  const lastSent = useRef<number | null>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'sending') return;
    if (website) {
      setError('Unable to submit this form. Please refresh the page and try again.');
      setStatus('error');
      return;
    }
    if (lastSent.current !== null && Date.now() - lastSent.current < FEEDBACK_COOLDOWN_MS) {
      setError('Please wait 30 seconds between messages.');
      setStatus('error');
      return;
    }
    const parsed = feedbackSchema.safeParse({ category, message, ...(rating ? { rating: Number(rating) } : {}), ...(device.trim() ? { device } : {}) });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Please check your feedback.');
      setStatus('error');
      return;
    }
    setStatus('sending');
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15_000);
    try {
      const response = await fetch(FEEDBACK_ENDPOINT, {
        method: 'POST',
        credentials: 'omit',
        referrerPolicy: 'no-referrer',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(parsed.data),
        signal: controller.signal,
      });
      const result: unknown = await response.json();
      if (!response.ok || typeof result !== 'object' || result === null || !('ok' in result) || result.ok !== true) {
        throw new Error('Feedback was not acknowledged');
      }
      setStatus('sent');
      lastSent.current = Date.now();
      setMessage('');
      setRating('');
      setDevice('');
    } catch {
      setStatus('error');
      setError('We couldn’t confirm delivery. Your message is still here—please try again in a moment.');
    } finally {
      window.clearTimeout(timeout);
    }
  }

  function close() { dialog.current?.close(); }

  return <>
    <button className={`${shared.textButton} ${styles.trigger}`} onClick={() => dialog.current?.showModal()}>Send Feedback</button>
    <dialog ref={dialog} className={styles.dialog} aria-labelledby="feedback-title" aria-describedby="feedback-intro" onClose={() => { if (status === 'sent') setStatus('idle'); }}>
      <div className={styles.heading}>
        <h2 id="feedback-title">Send feedback</h2>
        <button className={shared.textButton} onClick={close} aria-label="Close feedback">Close</button>
      </div>
      <p id="feedback-intro">Found a problem or have an idea? No account, name, or email needed.</p>
      {status === 'sent' ? <div role="status">
        <p>Thanks! Your feedback was sent.</p>
        <p className={shared.hint}>We don’t collect contact details, so we can’t reply personally.</p>
        <button className={shared.primary} onClick={() => { close(); setStatus('idle'); }}>Done</button>
      </div> : <form onSubmit={submit} aria-busy={status === 'sending'}>
        <div className={styles.trap} aria-hidden="true">
          <label htmlFor="feedback-website">Leave this field empty</label>
          <input id="feedback-website" name="_gotcha" value={website} onChange={event => setWebsite(event.target.value)} tabIndex={-1} autoComplete="off" />
        </div>
        <label htmlFor="feedback-category">Feedback type</label>
        <select id="feedback-category" value={category} onChange={event => setCategory(event.target.value)} disabled={status === 'sending'}>
          <option value="issue">Bug Report</option>
          <option value="idea">Feature Suggestion</option>
          <option value="confusing">Confusing Experience</option>
          <option value="general">General Feedback</option>
        </select>
        <label htmlFor="feedback-message">Your message</label>
        <textarea id="feedback-message" value={message} onChange={event => setMessage(event.target.value)} required minLength={10} maxLength={2000} rows={5} disabled={status === 'sending'} aria-describedby="feedback-help feedback-count" />
        <p id="feedback-help" className={shared.hint}>Tell us what happened and what you expected. Please leave out names, emails, school details, and actual SAT scores. Your study plan and results are never attached.</p>
        <p id="feedback-count" className={shared.hint}>{message.length} / 2,000 characters</p>
        <label htmlFor="feedback-rating">Usefulness rating (optional)</label>
        <select id="feedback-rating" value={rating} onChange={event => setRating(event.target.value)} disabled={status === 'sending'}>
          <option value="">Prefer not to rate</option>
          <option value="1">1 — Not useful</option><option value="2">2 — Slightly useful</option><option value="3">3 — Somewhat useful</option><option value="4">4 — Useful</option><option value="5">5 — Very useful</option>
        </select>
        <label htmlFor="feedback-device">Browser/device (optional)</label>
        <input id="feedback-device" value={device} onChange={event => setDevice(event.target.value)} maxLength={120} disabled={status === 'sending'} placeholder="For example, Safari on iPhone" autoComplete="off" aria-describedby="feedback-device-help" />
        <p id="feedback-device-help" className={shared.hint}>Enter only a browser/device description. We don’t detect it automatically; please omit names and device identifiers.</p>
        <p className={shared.hint}>Your type, message, and any optional details you enter are sent to Laplora’s private Formspree inbox. Formspree and our hosting provider may process connection details such as your IP address. <a href="https://formspree.io/legal/privacy-policy/" target="_blank" rel="noopener noreferrer">Formspree privacy policy</a>.</p>
        {status === 'error' && <p role="alert" className={styles.error}>{error}</p>}
        <div className={styles.actions}>
          <button type="button" className={shared.secondary} onClick={close}>Cancel</button>
          <button type="submit" className={shared.primary} disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send feedback'}</button>
        </div>
      </form>}
    </dialog>
  </>;
}
