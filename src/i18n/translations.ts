export type Language = 'ru' | 'en';

export const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN' },
];

type Dict = Record<string, string>;

const ru: Dict = {
  'brand.home': 'Patchwork — на главную',
  'nav.primary': 'Основная навигация',
  'nav.templates': 'Шаблоны',
  'nav.documents': 'Мои документы',
  'lang.switch': 'Язык интерфейса',

  'gallery.eyebrow': 'Конструктор документов',
  'gallery.heroTitle': 'Выберите шаблон, чтобы начать',
  'gallery.heroSubtitle':
    'Собирайте договоры, офферы и соглашения из повторно используемых блоков. Заполните переменные один раз, смотрите предпросмотр в реальном времени и экспортируйте готовый к печати HTML.',
  'gallery.filterAria': 'Фильтр шаблонов',
  'gallery.categoriesAria': 'Категории',
  'gallery.allFilter': 'Все',
  'gallery.searchLabel': 'Поиск шаблонов',
  'gallery.searchPlaceholder': 'Искать шаблоны…',
  'gallery.empty': 'Нет шаблонов, подходящих под фильтры.',
  'gallery.minutes': '≈ {n} мин',
  'gallery.useTemplate': 'Использовать шаблон',

  'docs.title': 'Мои документы',
  'docs.subtitle': 'Здесь собраны документы, которые вы сохранили.',
  'docs.newDocument': 'Новый документ',
  'docs.emptyTitle': 'Документов пока нет',
  'docs.emptyDesc': 'Создайте первый документ, выбрав шаблон в галерее.',
  'docs.browse': 'Перейти к шаблонам',
  'docs.meta': 'блоков: {n} · обновлён {time}',
  'docs.edit': 'Открыть',
  'docs.delete': 'Удалить',
  'docs.deleteConfirm': 'Удалить документ? Отменить действие будет нельзя.',

  'builder.errorTemplate': 'Шаблон не найден.',
  'builder.errorDocument': 'Документ не найден.',
  'builder.errorTemplateGone': 'Шаблон для этого документа больше недоступен.',
  'builder.errorNoTarget': 'Не указан ни шаблон, ни документ.',
  'builder.errorTitle': 'Не удалось открыть редактор',
  'builder.backToTemplates': 'К шаблонам',
  'builder.loading': 'Загрузка…',
  'builder.docTitleAria': 'Название документа',
  'builder.untitled': 'Документ без названия',
  'builder.undo': 'Отменить (Ctrl+Z)',
  'builder.redo': 'Повторить (Ctrl+Shift+Z)',
  'builder.exportHtml': 'Экспорт HTML',
  'builder.printPdf': 'Печать / PDF',
  'builder.exportChooseTitle': 'Как экспортировать документ?',
  'builder.exportChooseSubtitle': 'Выберите формат вывода',
  'builder.exportPrint': 'Печать',
  'builder.exportPrintHint': 'Откроется окно печати браузера',
  'builder.exportPdf': 'PDF',
  'builder.exportPdfHint': 'В окне печати выберите «Сохранить как PDF»',
  'builder.exportCancel': 'Отмена',
  'builder.save': 'Сохранить',
  'builder.saving': 'Сохранение…',
  'builder.saved': 'Сохранено',
  'builder.saveFailed': 'Не удалось сохранить',
  'builder.dirty': 'Есть несохранённые изменения',
  'builder.editorAria': 'Редактор документа',

  'palette.aria': 'Палитра блоков',
  'palette.title': 'Блоки',
  'palette.hint': 'Нажмите на блок, чтобы добавить его в документ.',
  'palette.allAdded': 'Все доступные блоки уже добавлены.',
  'palette.addAria': 'Добавить блок: {title}',
  'palette.conditional': 'Условный · зависит от {variable}',
  'palette.conditionalTitle': 'Условный блок',

  'block.reorderAria': 'Переместить «{title}». Нажмите пробел, затем стрелки.',
  'block.dragTitle': 'Перетащите, чтобы изменить порядок',
  'block.moveUp': 'Переместить блок вверх',
  'block.moveDown': 'Переместить блок вниз',
  'block.requiredTitle': 'Обязательный блок',
  'block.required': 'Обязательный',
  'block.removeAria': 'Удалить «{title}»',
  'block.remove': 'Убрать',
  'block.hiddenNotice':
    'Блок скрыт — нужно, чтобы {variable} имело значение {values}. Измените значение, чтобы показать блок.',
  'block.noVars': 'У этого блока нет переменных.',

  'list.emptyTitle': 'Начните добавлять блоки',
  'list.emptyDesc': 'Выберите блоки на левой панели, чтобы собрать документ.',

  'preview.aria': 'Предпросмотр документа',
  'preview.title': 'Предпросмотр',
  'preview.hint': 'Обновляется по мере редактирования',
  'preview.empty': 'Видимых блоков пока нет. Добавьте блоки из палитры.',

  'category.nda': 'NDA',
  'category.lease': 'Аренда',
  'category.offer': 'Оффер',
  'category.service': 'Услуги',
  'category.freelance': 'Фриланс',
  'category.invoice': 'Счёт',

  'validation.required': 'Обязательное поле',
  'validation.number': 'Введите корректное число',
  'validation.currency': 'Введите неотрицательную сумму',
  'validation.email': 'Введите корректный email',
  'validation.date': 'Введите корректную дату',
};

const en: Dict = {
  'brand.home': 'Patchwork home',
  'nav.primary': 'Primary',
  'nav.templates': 'Templates',
  'nav.documents': 'My documents',
  'lang.switch': 'Interface language',

  'gallery.eyebrow': 'Document builder',
  'gallery.heroTitle': 'Pick a template to start drafting',
  'gallery.heroSubtitle':
    'Assemble contracts, offers, and agreements from reusable blocks. Fill in the variables once, preview the result in real time, and export print-ready HTML.',
  'gallery.filterAria': 'Filter templates',
  'gallery.categoriesAria': 'Categories',
  'gallery.allFilter': 'All',
  'gallery.searchLabel': 'Search templates',
  'gallery.searchPlaceholder': 'Search templates…',
  'gallery.empty': 'No templates match your filters.',
  'gallery.minutes': '~{n} min',
  'gallery.useTemplate': 'Use template',

  'docs.title': 'My documents',
  'docs.subtitle': 'Documents you have saved are listed here.',
  'docs.newDocument': 'New document',
  'docs.emptyTitle': 'No documents yet',
  'docs.emptyDesc': 'Create your first document by picking a template from the gallery.',
  'docs.browse': 'Browse templates',
  'docs.meta': '{n} blocks · updated {time}',
  'docs.edit': 'Edit',
  'docs.delete': 'Delete',
  'docs.deleteConfirm': 'Delete this document? This cannot be undone.',

  'builder.errorTemplate': 'Template not found.',
  'builder.errorDocument': 'Document not found.',
  'builder.errorTemplateGone': 'The template for this document is no longer available.',
  'builder.errorNoTarget': 'No template or document specified.',
  'builder.errorTitle': 'Could not open builder',
  'builder.backToTemplates': 'Back to templates',
  'builder.loading': 'Loading…',
  'builder.docTitleAria': 'Document title',
  'builder.untitled': 'Untitled document',
  'builder.undo': 'Undo (Ctrl+Z)',
  'builder.redo': 'Redo (Ctrl+Shift+Z)',
  'builder.exportHtml': 'Export HTML',
  'builder.printPdf': 'Print / PDF',
  'builder.exportChooseTitle': 'How would you like to export?',
  'builder.exportChooseSubtitle': 'Choose an output format',
  'builder.exportPrint': 'Print',
  'builder.exportPrintHint': 'Opens the browser print dialog',
  'builder.exportPdf': 'PDF',
  'builder.exportPdfHint': 'In the print dialog choose "Save as PDF"',
  'builder.exportCancel': 'Cancel',
  'builder.save': 'Save',
  'builder.saving': 'Saving…',
  'builder.saved': 'Saved',
  'builder.saveFailed': 'Save failed',
  'builder.dirty': 'Unsaved changes',
  'builder.editorAria': 'Document editor',

  'palette.aria': 'Block palette',
  'palette.title': 'Blocks',
  'palette.hint': 'Click a block to append it to your document.',
  'palette.allAdded': 'All available blocks have been added.',
  'palette.addAria': 'Add block: {title}',
  'palette.conditional': 'Conditional · depends on {variable}',
  'palette.conditionalTitle': 'Conditional block',

  'block.reorderAria': 'Reorder {title}. Press space, then arrow keys to move.',
  'block.dragTitle': 'Drag to reorder',
  'block.moveUp': 'Move block up',
  'block.moveDown': 'Move block down',
  'block.requiredTitle': 'Required block',
  'block.required': 'Required',
  'block.removeAria': 'Remove {title}',
  'block.remove': 'Remove',
  'block.hiddenNotice':
    'This block is hidden — it requires {variable} to be {values}. Update the value to include it.',
  'block.noVars': 'No variables for this block.',

  'list.emptyTitle': 'Start adding blocks',
  'list.emptyDesc': 'Pick blocks from the left panel to compose your document.',

  'preview.aria': 'Document preview',
  'preview.title': 'Preview',
  'preview.hint': 'Updates as you edit',
  'preview.empty': 'No visible blocks yet. Add blocks from the palette.',

  'category.nda': 'NDA',
  'category.lease': 'Lease',
  'category.offer': 'Offer',
  'category.service': 'Service',
  'category.freelance': 'Freelance',
  'category.invoice': 'Invoice',

  'validation.required': 'Required',
  'validation.number': 'Must be a valid number',
  'validation.currency': 'Must be a non-negative amount',
  'validation.email': 'Must be a valid email',
  'validation.date': 'Must be a valid date',
};

export const translations: Record<Language, Dict> = { ru, en };

export function translate(lang: Language, key: string, params?: Record<string, string | number>): string {
  const raw = translations[lang][key] ?? translations.en[key] ?? key;
  if (!params) return raw;
  return raw.replace(/\{(\w+)\}/g, (_, k: string) =>
    params[k] !== undefined ? String(params[k]) : `{${k}}`,
  );
}
