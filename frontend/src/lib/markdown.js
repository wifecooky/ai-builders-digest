/**
 * Lightweight markdown renderer for digest summaries.
 * Handles: **bold**, bullet lists (- item), and paragraph breaks.
 * Escapes HTML first to prevent XSS.
 */
export function renderMarkdown(text) {
  if (!text) return '';

  // Escape HTML
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Bold: **text**
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Split into paragraphs by double newline
  const paragraphs = html.split(/\n\n+/);

  return paragraphs.map(p => {
    const lines = p.split('\n');
    const bulletLines = [];
    const textLines = [];
    let inList = false;

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ')) {
        if (!inList && textLines.length > 0) {
          // Flush text before list
          bulletLines.push(`<p>${textLines.join('<br>')}</p>`);
          textLines.length = 0;
        }
        inList = true;
        bulletLines.push(`<li>${trimmed.slice(2)}</li>`);
      } else {
        if (inList) {
          bulletLines.push('</ul>');
          inList = false;
        }
        textLines.push(trimmed);
      }
    }

    // Build output
    let out = '';
    let listStarted = false;
    for (const item of bulletLines) {
      if (item.startsWith('<li>') && !listStarted) {
        out += '<ul class="list-disc pl-4 my-1 space-y-0.5">';
        listStarted = true;
      }
      if (item === '</ul>') {
        out += '</ul>';
        listStarted = false;
        continue;
      }
      out += item;
    }
    if (listStarted) out += '</ul>';
    if (textLines.length > 0) {
      out += `<p>${textLines.join('<br>')}</p>`;
    }
    return out;
  }).join('');
}
