import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import shared from './App.module.css';
import styles from './Feedback.module.css';

export function Feedback() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [category, setCategory] = useState('issue');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'sending') return;
    if (message.trim().length < 10) {
      setError('Please describe what happened in at least 10 characters.');
      setStatus('error');
      return;
    }
    setStatus('sending');
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15_000);
    try {
      const response = await fetch('https://formspree.io/f/mdeaydqy', {
        method: 'POST',
        credentials: 'omit',
        referrerPolicy: 'no-referrer',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ category, message: message.trim() }),
        signal: controller.signal,
      });
      const result: unknown = await response.json();
      if (!response.ok || typeof result !== 'object' || result === null || !('ok' in result) || result.ok !== true) {
        throw new Error('Feedback was not acknowledged');
      }
      setStatus('sent');
      setMessage('');
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
        <label htmlFor="feedback-category">Feedback type</label>
        <select id="feedback-category" value={category} onChange={event => setCategory(event.target.value)} disabled={status === 'sending'}>
          <option value="issue">Report a problem</option>
          <option value="idea">Suggest an improvement</option>
          <option value="other">Something else</option>
        </select>
        <label htmlFor="feedback-message">Your message</label>
        <textarea id="feedback-message" value={message} onChange={event => setMessage(event.target.value)} required minLength={10} maxLength={2000} rows={5} disabled={status === 'sending'} aria-describedby="feedback-help feedback-count" />
        <p id="feedback-help" className={shared.hint}>Tell us what happened and what you expected. Please leave out names, emails, school details, and actual SAT scores. Your study plan and results are never attached.</p>
        <p id="feedback-count" className={shared.hint}>{message.length} / 2,000 characters</p>
        <p className={shared.hint}>Only the type and message are sent to Laplora’s private Formspree inbox. Formspree and our hosting provider may process connection details such as your IP address. <a href="https://formspree.io/legal/privacy-policy/" target="_blank" rel="noopener noreferrer">Formspree privacy policy</a>.</p>
        {status === 'error' && <p role="alert" className={styles.error}>{error}</p>}
        <div className={styles.actions}>
          <button type="button" className={shared.secondary} onClick={close}>Cancel</button>
          <button type="submit" className={shared.primary} disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send feedback'}</button>
        </div>
      </form>}
    </dialog>
  </>;
}
