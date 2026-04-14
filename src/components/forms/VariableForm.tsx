import { useEffect, useMemo, useRef } from 'react';
import { useForm, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { VariableDefinition } from '../../types';
import { useDocument } from '../../context/DocumentContext';
import { useLanguage } from '../../context/LanguageContext';
import { buildVariableSchema } from '../../utils/validation';
import styles from './VariableForm.module.css';

interface Props {
  variables: VariableDefinition[];
}

// Renders a form for a slice of variables (typically: variables of a single block).
// Values are written through to the shared document state on every change so that the
// preview updates live and other blocks sharing the same variable stay in sync.
export function VariableForm({ variables }: Props) {
  const { state, setValue } = useDocument();
  const { lang } = useLanguage();
  const schema = useMemo(() => buildVariableSchema(variables, lang), [variables, lang]);

  // Default values come from the shared store so this form reflects edits made elsewhere.
  const defaultValues = useMemo(() => {
    const out: Record<string, string | number> = {};
    for (const v of variables) {
      const current = state.doc.values[v.key];
      out[v.key] = current ?? '';
    }
    return out;
  }, [variables, state.doc.values]);

  type FormValues = Record<string, string | number>;
  const {
    register,
    formState: { errors },
    reset,
    getValues,
    watch,
  } = useForm<FormValues>({
    // The dynamically built Zod schema infers as Record<string, unknown>; the form values
    // are guaranteed by buildVariableSchema to be string|number, so we relax the resolver type.
    resolver: zodResolver(schema) as unknown as import('react-hook-form').Resolver<FormValues>,
    mode: 'onChange',
    defaultValues,
  });

  // If global state changes (e.g. via Undo/Redo or another block edited a shared variable),
  // sync RHF values without triggering an infinite loop.
  const lastSyncRef = useRef<Record<string, string | number>>({});
  useEffect(() => {
    const current = getValues();
    let changed = false;
    for (const v of variables) {
      const stored = state.doc.values[v.key] ?? '';
      if (current[v.key] !== stored && lastSyncRef.current[v.key] !== stored) {
        changed = true;
        break;
      }
    }
    if (changed) {
      const next: Record<string, string | number> = {};
      for (const v of variables) next[v.key] = state.doc.values[v.key] ?? '';
      lastSyncRef.current = { ...next };
      reset(next, { keepDirty: false, keepErrors: false });
    }
  }, [state.doc.values, variables, reset, getValues]);

  // Mirror RHF changes into the document store so the preview stays in sync.
  // Subscribe once; dependencies that change on every keystroke (store values, variables array
  // identity) are read through refs to avoid unsubscribing/resubscribing per-keystroke.
  const variablesRef = useRef(variables);
  const storeValuesRef = useRef(state.doc.values);
  useEffect(() => {
    variablesRef.current = variables;
  }, [variables]);
  useEffect(() => {
    storeValuesRef.current = state.doc.values;
  }, [state.doc.values]);

  useEffect(() => {
    const sub = watch((vals, info) => {
      if (!info?.name) return;
      const key = info.name;
      const raw = vals[key];
      // Persist normalized value: empty string becomes "" in the store; numbers stored as numbers.
      const def = variablesRef.current.find((v) => v.key === key);
      let next: string | number = '';
      if (raw === undefined || raw === null || raw === '') {
        next = '';
      } else if (def?.type === 'number' || def?.type === 'currency') {
        const num = typeof raw === 'number' ? raw : Number(String(raw).replace(/[, ]/g, ''));
        next = Number.isFinite(num) ? num : '';
      } else {
        next = String(raw);
      }
      lastSyncRef.current[key] = next;
      if (storeValuesRef.current[key] !== next) setValue(key, next);
    });
    return () => sub.unsubscribe();
  }, [watch, setValue]);

  return (
    <form className={styles.form} onSubmit={(e) => e.preventDefault()} noValidate>
      {variables.map((v) => (
        <FieldRow key={v.key} variable={v} register={register} errors={errors} />
      ))}
    </form>
  );
}

interface FieldRowProps {
  variable: VariableDefinition;
  register: ReturnType<typeof useForm>['register'];
  errors: FieldErrors;
}

function FieldRow({ variable, register, errors }: FieldRowProps) {
  const error = errors[variable.key];
  const errMsg = typeof error?.message === 'string' ? error.message : undefined;
  const fieldId = `field-${variable.key}`;
  const descId = variable.description ? `${fieldId}-desc` : undefined;
  const errId = errMsg ? `${fieldId}-err` : undefined;
  const describedBy = [descId, errId].filter(Boolean).join(' ') || undefined;

  const commonProps = {
    id: fieldId,
    placeholder: variable.placeholder,
    'aria-invalid': errMsg ? true : undefined,
    'aria-describedby': describedBy,
    className: errMsg ? styles.inputError : styles.input,
  } as const;

  return (
    <div className={styles.row}>
      <label htmlFor={fieldId} className={styles.label}>
        {variable.label}
        {variable.required ? <span className={styles.required} aria-hidden="true"> *</span> : null}
      </label>
      {variable.type === 'longtext' ? (
        <textarea rows={3} {...commonProps} {...register(variable.key)} />
      ) : variable.type === 'number' || variable.type === 'currency' ? (
        <input
          type="number"
          inputMode="decimal"
          step={variable.type === 'currency' ? '0.01' : '1'}
          {...commonProps}
          {...register(variable.key, { valueAsNumber: false })}
        />
      ) : variable.type === 'date' ? (
        <input type="date" {...commonProps} {...register(variable.key)} />
      ) : variable.type === 'email' ? (
        <input type="email" autoComplete="email" {...commonProps} {...register(variable.key)} />
      ) : (
        <input type="text" {...commonProps} {...register(variable.key)} />
      )}
      {variable.description ? (
        <p id={descId} className={styles.description}>{variable.description}</p>
      ) : null}
      {errMsg ? (
        <p id={errId} className={styles.error} role="alert">{errMsg}</p>
      ) : null}
    </div>
  );
}
