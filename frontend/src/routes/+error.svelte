<script>
  import { page } from '$app/state';
  import { getContext } from 'svelte';
  import config from '$lib/site-config.js';

  const app = getContext('app');
  let currentLang = $derived(app.currentLang);
  const siteTitle = config.site.title;

  const messages = {
    en: { title: 'PAGE NOT FOUND', desc: 'This digest doesn\'t exist yet.', cta: 'Go to latest' },
    zh: { title: '页面未找到', desc: '该日报尚不存在。', cta: '前往最新一期' },
    ja: { title: 'ページが見つからない', desc: 'このダイジェストはまだ存在しない。', cta: '最新号へ' },
  };

  let msg = $derived(messages[currentLang] || messages.en);
</script>

<svelte:head>
  <title>{msg.title} — {siteTitle[currentLang]}</title>
</svelte:head>

<main class="max-w-3xl mx-auto px-5">
  <div class="text-center py-32 animate-in">
    <p class="font-display text-6xl font-black text-cyber-cyan/20 mb-6">{page.status}</p>
    <p class="text-[10px] font-display tracking-[0.3em] text-cyber-text-muted uppercase mb-2">{msg.title}</p>
    <p class="text-sm text-cyber-text/60 mb-8">{msg.desc}</p>
    <a
      href="/"
      class="inline-block text-[11px] font-display font-bold tracking-[0.15em] text-cyber-cyan border border-cyber-cyan/30 px-5 py-2 rounded-sm hover:bg-cyber-cyan/10 transition-colors duration-200 no-underline uppercase"
    >
      ← {msg.cta}
    </a>
  </div>
</main>
