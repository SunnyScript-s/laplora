import type { InputHTMLAttributes, ReactNode } from 'react';
import type { InputError } from '../domain/inputs';
import type { Draft } from './form';
import { labels } from './form';
import styles from './App.module.css';

export function Field({ field, hint, errors, children }: { field: keyof Draft; hint?: string; errors: InputError[]; children: ReactNode }) {
  const error = errors.find(item => item.field === field);
  return <div className={styles.field}>
    <label htmlFor={field}>{labels[field]}</label>
    {children}
    {hint && <p id={`${field}-hint`} className={styles.hint}>{hint}</p>}
    {error && <p id={`${field}-error`} className={styles.error}>{error.message}</p>}
  </div>;
}
export function controlProps(field: keyof Draft, errors: InputError[], hint = false) {
  const invalid = errors.some(error => error.field === field);
  return { id: field, name: field, 'aria-invalid': invalid, 'aria-describedby': [hint ? `${field}-hint` : '', invalid ? `${field}-error` : ''].filter(Boolean).join(' ') || undefined };
}
export function NumberField({ field, draft, update, errors, hint, ...props }: { field: 'mathScore' | 'readingWritingScore' | 'targetScore' | 'weeklyStudyHours' | 'consistencyPercent' | 'mathSharePercent'; draft: Draft; update: (draft: Draft) => void; errors: InputError[]; hint?: string } & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'>) {
  return <Field field={field} errors={errors} {...(hint ? { hint } : {})}>
    <input {...props} {...controlProps(field, errors, Boolean(hint))} type="number" value={draft[field]} onChange={event => update({ ...draft, [field]: event.target.value })} />
  </Field>;
}
