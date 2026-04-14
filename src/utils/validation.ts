import { z, type ZodTypeAny } from 'zod';
import type { VariableDefinition } from '../types';
import type { Language } from '../i18n/translations';
import { translate } from '../i18n/translations';

export function buildVariableSchema(
  vars: VariableDefinition[],
  lang: Language = 'en',
): z.ZodObject<Record<string, ZodTypeAny>> {
  const msg = (key: string) => translate(lang, key);
  const shape: Record<string, ZodTypeAny> = {};
  for (const v of vars) {
    let field: ZodTypeAny;
    switch (v.type) {
      case 'number': {
        const base = z
          .union([z.string(), z.number()])
          .transform((val) => (typeof val === 'number' ? val : val === '' ? '' : Number(val)))
          .refine((val) => val === '' || (typeof val === 'number' && Number.isFinite(val)), {
            message: msg('validation.number'),
          });
        field = v.required
          ? base.refine((val) => val !== '' && val !== undefined, { message: msg('validation.required') })
          : base.optional();
        break;
      }
      case 'currency': {
        const base = z
          .union([z.string(), z.number()])
          .transform((val) => (typeof val === 'number' ? val : val === '' ? '' : Number(String(val).replace(/[, ]/g, ''))))
          .refine((val) => val === '' || (typeof val === 'number' && Number.isFinite(val) && val >= 0), {
            message: msg('validation.currency'),
          });
        field = v.required
          ? base.refine((val) => val !== '' && val !== undefined, { message: msg('validation.required') })
          : base.optional();
        break;
      }
      case 'email': {
        const base = z.string().trim();
        field = v.required
          ? base.min(1, msg('validation.required')).email(msg('validation.email'))
          : base.email(msg('validation.email')).or(z.literal('')).optional();
        break;
      }
      case 'date': {
        const base = z.string().trim();
        const isIsoDate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s);
        field = v.required
          ? base.min(1, msg('validation.required')).refine(isIsoDate, { message: msg('validation.date') })
          : base.refine((s) => s === '' || isIsoDate(s), { message: msg('validation.date') }).optional();
        break;
      }
      case 'longtext':
      case 'text':
      default: {
        const base = z.string();
        field = v.required ? base.trim().min(1, msg('validation.required')) : base.optional();
        break;
      }
    }
    shape[v.key] = field;
  }
  return z.object(shape);
}
