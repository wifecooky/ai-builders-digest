import { s as setContext, h as head, e as escape_html, a as ensure_array_like, b as attr_class, c as attr, d as stringify } from "../../chunks/index.js";
import { c as config } from "../../chunks/_virtual_site-config.js";
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { children } = $$props;
    const langNames = { en: "EN", zh: "中文", ja: "日本語" };
    function detectLang() {
      return "en";
    }
    let currentLang = detectLang();
    function switchLang(lang) {
      currentLang = lang;
      localStorage.setItem("lang", lang);
      document.documentElement.lang = lang;
    }
    let themeMode = "system";
    const themeIcons = { system: "◐", light: "☀", dark: "☾" };
    const siteNames = config.site.title;
    const siteKeywords = config.site.keywords;
    const siteUrl = config.site.url;
    const ogLocales = { en: "en_US", zh: "zh_CN", ja: "ja_JP" };
    const rssUrls = { en: "/rss.xml", zh: "/rss-zh.xml", ja: "/rss-ja.xml" };
    setContext("app", {
      get currentLang() {
        return currentLang;
      },
      switchLang
    });
    head("12qhfyh", $$renderer2, ($$renderer3) => {
      $$renderer3.push(`<meta name="keywords"${attr("content", siteKeywords[currentLang])}/> <meta name="robots" content="index, follow"/> <meta property="og:site_name"${attr("content", siteNames[currentLang])}/> <meta property="og:type" content="website"/> <meta property="og:locale"${attr("content", ogLocales[currentLang])}/> <meta property="og:image"${attr("content", `${siteUrl}/og-image.svg`)}/> <meta property="og:image:width" content="1200"/> <meta property="og:image:height" content="630"/> <meta name="twitter:card" content="summary_large_image"/> <meta name="twitter:image"${attr("content", `${siteUrl}/og-image.svg`)}/> <link rel="alternate" type="application/rss+xml"${attr("title", `${stringify(siteNames[currentLang])} RSS`)}${attr("href", rssUrls[currentLang])}/> <link rel="alternate" hreflang="en"${attr("href", `${siteUrl}/`)}/> <link rel="alternate" hreflang="zh"${attr("href", `${siteUrl}/`)}/> <link rel="alternate" hreflang="ja"${attr("href", `${siteUrl}/`)}/> <link rel="alternate" hreflang="x-default"${attr("href", `${siteUrl}/`)}/>`);
    });
    $$renderer2.push(`<div class="min-h-screen bg-cyber-bg text-cyber-text grid-bg transition-colors duration-300"><header class="sticky top-0 z-30 bg-cyber-bg/90 backdrop-blur-md border-b border-cyber-border transition-colors duration-300"><div class="max-w-3xl mx-auto px-5 py-3"><div class="flex items-center justify-between"><a href="/" class="flex items-center gap-3 no-underline"><span class="relative flex h-2 w-2"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-cyan opacity-75"></span> <span class="relative inline-flex rounded-full h-2 w-2 bg-cyber-cyan"></span></span> <span class="font-display text-xs font-bold tracking-[0.25em] text-cyber-cyan glow-cyan uppercase">${escape_html(siteNames[currentLang])}</span></a> <div class="flex items-center gap-2"><a href="/about" class="px-2.5 py-1 text-[10px] font-bold tracking-wider cursor-pointer transition-all duration-200 border border-cyber-border rounded text-cyber-text-muted hover:text-cyber-cyan hover:border-cyber-cyan/30 no-underline">?</a> <button class="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold tracking-wider cursor-pointer transition-all duration-200 border border-cyber-border rounded text-cyber-text-muted hover:text-cyber-cyan hover:border-cyber-cyan/30" aria-label="Toggle theme"><span class="text-sm leading-none">${escape_html(themeIcons[themeMode])}</span></button> <nav class="flex gap-px border border-cyber-border rounded" aria-label="Language"><!--[-->`);
    const each_array = ensure_array_like(Object.entries(langNames));
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let [code, name] = each_array[$$index];
      $$renderer2.push(`<button${attr_class(`px-3 py-1 text-[10px] font-bold tracking-wider cursor-pointer transition-all duration-200 ${stringify(currentLang === code ? "bg-cyber-cyan/15 text-cyber-cyan border-cyber-cyan/30" : "text-cyber-text-muted hover:text-cyber-cyan hover:bg-cyber-cyan/5")}`)}${attr("aria-current", currentLang === code ? "true" : void 0)}>${escape_html(name)}</button>`);
    }
    $$renderer2.push(`<!--]--></nav></div></div></div></header> `);
    children($$renderer2);
    $$renderer2.push(`<!----></div>`);
  });
}
export {
  _layout as default
};
