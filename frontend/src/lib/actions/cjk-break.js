/**
 * Svelte action: apply BudouX phrase breaking to a leaf text element.
 *
 * Usage:
 *   <p use:cjkBreak={currentLang}>{text}</p>
 *
 * Only activates for 'ja' and 'zh'. Lazy-loads the parser on first use so
 * English-only visitors never download BudouX. Walks descendants and inserts
 * <wbr> at phrase boundaries, letting the browser wrap at semantically
 * correct positions instead of mid-cluster.
 *
 * Parent layouts use {#key currentLang} to remount cards on language switch,
 * so the action is expected to run fresh on each language change.
 */

let jaParser = null;
let zhHansParser = null;

async function getParser(lang) {
  if (lang === 'ja') {
    if (!jaParser) {
      const { loadDefaultJapaneseParser } = await import('budoux');
      jaParser = loadDefaultJapaneseParser();
    }
    return jaParser;
  }
  if (lang === 'zh') {
    if (!zhHansParser) {
      const { loadDefaultSimplifiedChineseParser } = await import('budoux');
      zhHansParser = loadDefaultSimplifiedChineseParser();
    }
    return zhHansParser;
  }
  return null;
}

export function cjkBreak(node, lang) {
  let cancelled = false;
  let applied = false;

  async function apply(currentLang) {
    if (applied) return;
    if (currentLang !== 'ja' && currentLang !== 'zh') return;
    const parser = await getParser(currentLang);
    if (cancelled || !parser) return;
    parser.applyElement(node);
    applied = true;
  }

  apply(lang);

  return {
    update(newLang) {
      apply(newLang);
    },
    destroy() {
      cancelled = true;
    },
  };
}
