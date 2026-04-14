import type { LocalizedTemplate, LocalizedVariableDefinition, Template } from '../types';
import {
  ndaBlocks,
  leaseBlocks,
  offerBlocks,
  serviceBlocks,
  freelanceBlocks,
  invoiceBlocks,
} from './blocks';
import { resolveTemplate } from './resolve';
import type { Language } from '../i18n/translations';
import { translate } from '../i18n/translations';

const L = (ru: string, en: string) => ({ ru, en });

const ndaGlobals: LocalizedVariableDefinition[] = [
  {
    key: 'nda_type',
    label: L('Тип NDA', 'NDA Type'),
    type: 'text',
    required: true,
    placeholder: L('односторонний | взаимное', 'one-way | mutual'),
    description: L('Введите «взаимное» или «mutual», чтобы включить пункт о взаимной конфиденциальности.', 'Use "mutual" to enable the mutual confidentiality clause.'),
  },
];

const leaseGlobals: LocalizedVariableDefinition[] = [
  {
    key: 'pets_allowed',
    label: L('Разрешены ли животные?', 'Pets Allowed?'),
    type: 'text',
    required: false,
    placeholder: L('да | нет', 'yes | no'),
    description: L('Введите «да» или «yes», чтобы добавить пункт о домашних животных.', 'Set to "yes" to enable the pets clause.'),
  },
];

const offerGlobals: LocalizedVariableDefinition[] = [
  {
    key: 'include_bonus',
    label: L('Включить приветственный бонус?', 'Include Signing Bonus?'),
    type: 'text',
    required: false,
    placeholder: L('да | нет', 'yes | no'),
  },
  {
    key: 'include_equity',
    label: L('Включить опционы/акции?', 'Include Equity Grant?'),
    type: 'text',
    required: false,
    placeholder: L('да | нет', 'yes | no'),
  },
];

const serviceGlobals: LocalizedVariableDefinition[] = [
  {
    key: 'include_advance',
    label: L('Предусмотреть предоплату?', 'Include Advance Payment?'),
    type: 'text',
    required: false,
    placeholder: L('да | нет', 'yes | no'),
  },
];

const invoiceGlobals: LocalizedVariableDefinition[] = [
  {
    key: 'include_tax',
    label: L('Добавить строку налога?', 'Include Tax Line?'),
    type: 'text',
    required: false,
    placeholder: L('да | нет', 'yes | no'),
  },
];

export const localizedTemplates: LocalizedTemplate[] = [
  {
    id: 'tpl.nda',
    name: L('Соглашение о неразглашении', 'Non-Disclosure Agreement'),
    description: L(
      'Стандартное одностороннее или взаимное NDA между двумя сторонами для защиты конфиденциальной информации.',
      'A standard one-way or mutual NDA between two parties for protecting confidential information.',
    ),
    category: 'nda',
    estimatedMinutes: 8,
    blocks: ndaBlocks,
    globalVariables: ndaGlobals,
    blockIds: [
      'nda.header',
      'nda.purpose',
      'nda.confidential_info',
      'nda.obligations',
      'nda.term',
      'nda.mutual_clause',
      'nda.return',
      'nda.governing_law',
      'nda.signatures',
    ],
  },
  {
    id: 'tpl.lease',
    name: L('Договор аренды жилья', 'Residential Lease Agreement'),
    description: L(
      'Договор аренды с разделами об объекте, сроке, плате, депозите, коммуналке и опциональным пунктом о животных.',
      'A residential lease covering premises, term, rent, deposit, utilities, and optional pets clause.',
    ),
    category: 'lease',
    estimatedMinutes: 12,
    blocks: leaseBlocks,
    globalVariables: leaseGlobals,
    blockIds: [
      'lease.header',
      'lease.premises',
      'lease.term',
      'lease.rent',
      'lease.deposit',
      'lease.utilities',
      'lease.pets',
      'lease.signatures',
    ],
  },
  {
    id: 'tpl.offer',
    name: L('Оффер о приёме на работу', 'Employment Offer Letter'),
    description: L(
      'Официальный оффер с указанием должности, компенсации, опциональным бонусом, опционами и льготами.',
      'A formal offer letter including position, compensation, optional bonus and equity, and benefits.',
    ),
    category: 'offer',
    estimatedMinutes: 10,
    blocks: offerBlocks,
    globalVariables: offerGlobals,
    blockIds: [
      'offer.header',
      'offer.intro',
      'offer.compensation',
      'offer.bonus',
      'offer.equity',
      'offer.benefits',
      'offer.at_will',
      'offer.closing',
    ],
  },
  {
    id: 'tpl.service',
    name: L('Договор оказания услуг', 'Service Agreement'),
    description: L(
      'Договор на оказание услуг между заказчиком и исполнителем со стоимостью, сроками, опциональной предоплатой и переходом прав.',
      'A service agreement between client and provider with fees, timeline, optional advance, and IP assignment.',
    ),
    category: 'service',
    estimatedMinutes: 10,
    blocks: serviceBlocks,
    globalVariables: serviceGlobals,
    blockIds: [
      'service.header',
      'service.scope',
      'service.term',
      'service.fees',
      'service.advance',
      'service.ip',
      'service.confidentiality',
      'service.signatures',
    ],
  },
  {
    id: 'tpl.freelance',
    name: L('Договор с фрилансером', 'Freelance Contract'),
    description: L(
      'Компактный договор с фрилансером: описание проекта, ставка, правки, права на результат и расторжение.',
      'A compact freelance contract: project description, rate, revisions, IP ownership, and termination.',
    ),
    category: 'freelance',
    estimatedMinutes: 7,
    blocks: freelanceBlocks,
    globalVariables: [],
    blockIds: [
      'freelance.header',
      'freelance.project',
      'freelance.rate',
      'freelance.revisions',
      'freelance.ip',
      'freelance.termination',
      'freelance.signatures',
    ],
  },
  {
    id: 'tpl.invoice',
    name: L('Счёт на оплату', 'Invoice'),
    description: L(
      'Счёт с реквизитами сторон, перечнем услуг, опциональным налогом и платёжными реквизитами.',
      'An invoice with party details, line items, optional tax, and payment instructions.',
    ),
    category: 'invoice',
    estimatedMinutes: 5,
    blocks: invoiceBlocks,
    globalVariables: invoiceGlobals,
    blockIds: [
      'invoice.header',
      'invoice.from',
      'invoice.to',
      'invoice.items',
      'invoice.tax',
      'invoice.total',
      'invoice.payment',
      'invoice.notes',
    ],
  },
];

export function listLocalizedTemplates(): LocalizedTemplate[] {
  return localizedTemplates;
}

export function findLocalizedTemplate(id: string): LocalizedTemplate | undefined {
  return localizedTemplates.find((t) => t.id === id);
}

export function resolveTemplateById(id: string, lang: Language): Template | null {
  const loc = findLocalizedTemplate(id);
  if (!loc) return null;
  const categoryLabel = translate(lang, `category.${loc.category}`);
  return resolveTemplate(loc, lang, categoryLabel);
}

export function resolveAllTemplates(lang: Language): Template[] {
  return localizedTemplates.map((loc) =>
    resolveTemplate(loc, lang, translate(lang, `category.${loc.category}`)),
  );
}
