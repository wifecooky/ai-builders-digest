<script>
  import '../app.css';
  import config from '$lib/site-config.js';
  import { browser } from '$app/environment';
  import { setContext } from 'svelte';

  let { children } = $props();

  const langNames = { en: 'EN', zh: '中文', ja: '日本語' };
  const supportedLangs = Object.keys(langNames);

  function detectLang() {
    if (!browser) return 'en';
    const saved = localStorage.getItem('lang');
    if (saved && supportedLangs.includes(saved)) return saved;
    const nav = navigator.language?.toLowerCase() || '';
    if (nav.startsWith('zh')) return 'zh';
    if (nav.startsWith('ja')) return 'ja';
    return 'en';
  }

  // Always start 'en' to match SSR/prerender. $effect corrects after hydration.
  let currentLang = $state('en');

  $effect(() => {
    if (browser) {
      const detected = detectLang();
      if (currentLang !== detected) {
        currentLang = detected;
      }
      document.documentElement.lang = currentLang;
    }
  });

  function switchLang(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
  }

  let themeMode = $state(browser ? (localStorage.getItem('theme') || 'system') : 'system');

  $effect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
  });

  function cycleTheme() {
    const order = ['system', 'light', 'dark'];
    const idx = order.indexOf(themeMode);
    themeMode = order[(idx + 1) % 3];
    localStorage.setItem('theme', themeMode);
  }

  const themeIcons = { system: '◐', light: '☀', dark: '☾' };

  const siteNames = config.site.title;
  const siteKeywords = config.site.keywords;
  const siteUrl = config.site.url;
  const ogLocales = { en: 'en_US', zh: 'zh_CN', ja: 'ja_JP' };
  const rssUrls = { en: '/rss.xml', zh: '/rss-zh.xml', ja: '/rss-ja.xml' };

  setContext('app', {
    get currentLang() { return currentLang; },
    switchLang,
  });
</script>

<svelte:head>
  <meta name="keywords" content={siteKeywords[currentLang]} />
  <meta name="robots" content="index, follow" />
  <meta property="og:site_name" content={siteNames[currentLang]} />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content={ogLocales[currentLang]} />
  <meta property="og:image" content={`${siteUrl}/og-image.png`} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content={`${siteUrl}/og-image.png`} />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <link rel="alternate" type="application/rss+xml" title={`${siteNames[currentLang]} RSS`} href={rssUrls[currentLang]} />
  <link rel="alternate" hreflang="en" href={`${siteUrl}/`} />
  <link rel="alternate" hreflang="zh" href={`${siteUrl}/`} />
  <link rel="alternate" hreflang="ja" href={`${siteUrl}/`} />
  <link rel="alternate" hreflang="x-default" href={`${siteUrl}/`} />
</svelte:head>

<div class="min-h-screen bg-cyber-bg text-cyber-text grid-bg transition-colors duration-300">
  <header class="sticky top-0 z-30 bg-cyber-bg/90 backdrop-blur-md border-b border-cyber-border transition-colors duration-300">
    <div class="max-w-3xl mx-auto px-5 py-3">
      <div class="flex items-center justify-between">
        <a href="/" class="flex items-center gap-2.5 no-underline">
          <svg width="22" height="22" viewBox="0 0 32 32" class="shrink-0">
            <polygon points="16,4 27,10 27,22 16,28 5,22 5,10" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" class="text-cyber-cyan" opacity="0.7"/>
            <circle cx="16" cy="16" r="6.5" fill="none" stroke="currentColor" stroke-width="1.5" class="text-cyber-cyan" opacity="0.4"/>
            <circle cx="16" cy="16" r="3.5" fill="currentColor" class="text-cyber-cyan"/>
          </svg>
          <span class="font-display text-xs font-bold tracking-[0.25em] text-cyber-cyan glow-cyan uppercase">
            {siteNames[currentLang]}
          </span>
        </a>

        <div class="flex items-center gap-2">
          <a
            href="/about"
            class="px-2.5 py-1 text-[10px] font-bold tracking-wider cursor-pointer transition-all duration-200 border border-cyber-border rounded text-cyber-text-muted hover:text-cyber-cyan hover:border-cyber-cyan/30 no-underline"
          >?</a>

          <button
            onclick={cycleTheme}
            class="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold tracking-wider cursor-pointer transition-all duration-200 border border-cyber-border rounded text-cyber-text-muted hover:text-cyber-cyan hover:border-cyber-cyan/30"
            aria-label="Toggle theme"
          >
            <span class="text-base leading-none">{themeIcons[themeMode]}</span>
          </button>

          <nav class="flex gap-px border border-cyber-border rounded" aria-label="Language">
            {#each Object.entries(langNames) as [code, name]}
              <button
                onclick={() => switchLang(code)}
                class="px-3 py-1 text-[10px] font-bold tracking-wider cursor-pointer transition-all duration-200 {currentLang === code
                  ? 'bg-cyber-cyan/15 text-cyber-cyan border-cyber-cyan/30'
                  : 'text-cyber-text-muted hover:text-cyber-cyan hover:bg-cyber-cyan/5'}"
                aria-current={currentLang === code ? 'true' : undefined}
              >
                {name}
              </button>
            {/each}
          </nav>
        </div>
      </div>
    </div>
  </header>

  {@render children()}
</div>
