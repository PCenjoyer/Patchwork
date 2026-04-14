import type { Template, DocumentBlockInstance, DocumentState } from '../types';
import { collectAllVariables, isBlockVisible, renderBody } from './templateEngine';
import type { Language } from '../i18n/translations';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export interface RenderedBlock {
  instanceId: string;
  definitionId: string;
  title: string;
  text: string;
}

export function renderDocument(template: Template, doc: DocumentState, lang: Language = 'en'): RenderedBlock[] {
  const allVars = collectAllVariables(template);
  const varMap = Object.fromEntries(allVars.map((v) => [v.key, v]));
  const defById = new Map(template.blocks.map((b) => [b.id, b] as const));
  const out: RenderedBlock[] = [];
  for (const inst of doc.blocks) {
    const def = defById.get(inst.definitionId);
    if (!def) continue;
    if (!isBlockVisible(def, doc.values)) continue;
    out.push({
      instanceId: inst.instanceId,
      definitionId: def.id,
      title: def.title,
      text: renderBody(def.body, varMap, doc.values, { highlightMissing: true, lang }),
    });
  }
  return out;
}

export function buildPrintableHtml(template: Template, doc: DocumentState, lang: Language = 'en'): string {
  const blocks = renderDocument(template, doc, lang);
  const bodyHtml = blocks
    .map((b) => {
      const paragraphs = b.text
        .split(/\n{2,}/)
        .map((p) => `<p>${escapeHtml(p).replace(/\n/g, '<br/>')}</p>`)
        .join('\n');
      return `<section class="block">\n${paragraphs}\n</section>`;
    })
    .join('\n');

  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(doc.title)}</title>
<style>
  @page { size: A4; margin: 25mm 22mm; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: 'Georgia', 'Times New Roman', serif;
    font-size: 12pt;
    line-height: 1.55;
    color: #1a1a1a;
    background: #fff;
  }
  main { max-width: 170mm; margin: 0 auto; padding: 18mm 0; }
  h1.doc-title {
    font-size: 18pt;
    text-align: center;
    margin: 0 0 24pt 0;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .block { margin: 0 0 14pt 0; page-break-inside: avoid; }
  .block p { margin: 0 0 8pt 0; text-align: justify; }
  @media print {
    main { padding: 0; }
    .block { break-inside: avoid; }
  }
</style>
</head>
<body>
<main>
<h1 class="doc-title">${escapeHtml(doc.title)}</h1>
${bodyHtml}
</main>
</body>
</html>`;
}

export function downloadFile(filename: string, contents: string, mime: string) {
  const blob = new Blob([contents], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function openPrintWindow(html: string) {
  const win = window.open('', '_blank', 'noopener,noreferrer');
  if (!win) return;
  win.document.open();
  win.document.write(html);
  win.document.close();
  win.addEventListener('load', () => {
    win.focus();
    win.print();
  });
}

export type { DocumentBlockInstance };
