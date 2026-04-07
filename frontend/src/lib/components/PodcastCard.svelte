<script>
  import { getContext } from 'svelte';
  import { renderMarkdown } from '$lib/markdown.js';
  import { cjkBreak } from '$lib/actions/cjk-break.js';

  let { article, delay = 0 } = $props();
  const app = getContext('app');
  let currentLang = $derived(app.currentLang);

  let displayTitle = $derived(article.suggestedTitle || article.title);
  let displaySummary = $derived(article.suggestedSummary || '');
  let renderedSummary = $derived(renderMarkdown(displaySummary));
</script>

<article
  class="group relative border border-cyber-border rounded-sm p-5 sm:p-6 transition-all duration-300 hover:border-cyber-magenta/40 bg-cyber-surface/60 animate-in"
  style="animation-delay: {delay}ms"
>
  <div class="flex items-start gap-3 mb-3">
    <span class="text-cyber-magenta/60 mt-0.5 shrink-0">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
    </span>
    <div class="flex-1 min-w-0">
      <span class="text-[10px] text-cyber-magenta/70 tracking-wider uppercase font-display">{article.source}</span>
      <h3 class="text-base sm:text-lg font-bold leading-snug text-cyber-heading mt-1 tracking-tight" use:cjkBreak={currentLang}>
        {#if article.url}
          <a href={article.url} target="_blank" rel="noopener noreferrer" class="hover:text-cyber-magenta transition-colors duration-200 no-underline">{article.title}</a>
        {:else}
          {article.title}
        {/if}
      </h3>
    </div>
  </div>

  {#if displayTitle !== article.title}
    <p class="text-[12px] text-cyber-magenta/70 font-bold mb-2 italic" use:cjkBreak={currentLang}>{displayTitle}</p>
  {/if}

  <div class="text-[13px] text-cyber-text leading-relaxed opacity-85 space-y-2" use:cjkBreak={currentLang}>
    {#key renderedSummary}{@html renderedSummary}{/key}
  </div>

  {#if article.url}
    <div class="mt-3">
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        class="text-[10px] px-2 py-0.5 rounded-sm bg-cyber-magenta/8 text-cyber-magenta/70 border border-cyber-magenta/15 hover:border-cyber-magenta/30 transition-colors duration-200 no-underline inline-flex items-center gap-1"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" class="opacity-60"><path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22.97.22 1.56v8.54c0 .59-.09 1.09-.22 1.56-.12.47-.35.85-.65 1.15-.3.3-.68.53-1.15.65-.47.13-.97.22-1.56.22H5.8c-.59 0-1.09-.09-1.56-.22-.47-.12-.85-.35-1.15-.65-.3-.3-.53-.68-.65-1.15-.13-.47-.22-.97-.22-1.56V8.73c0-.59.09-1.09.22-1.56.12-.47.35-.85.65-1.15.3-.3.68-.53 1.15-.65C5.71 5.24 6.21 5.15 6.8 5.15h12.4c.59 0 1.09.09 1.56.22.47.12.85.35 1.15.65.3.3.53.68.65 1.15z"/></svg>
        YouTube
      </a>
    </div>
  {/if}
</article>
