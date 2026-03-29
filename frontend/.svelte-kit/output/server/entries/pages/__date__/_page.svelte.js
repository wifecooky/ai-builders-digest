import { g as getContext, h as head, e as escape_html, c as attr, d as stringify, a as ensure_array_like, a5 as attr_style, b as attr_class, a4 as derived } from "../../../chunks/index.js";
import { c as config } from "../../../chunks/_virtual_site-config.js";
import { S as SubscribeForm } from "../../../chunks/SubscribeForm.js";
function html(value) {
  var html2 = String(value ?? "");
  var open = "<!---->";
  return open + html2 + "<!---->";
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    const app = getContext("app");
    let currentLang = derived(() => app.currentLang);
    let content = derived(() => data.content[currentLang()]);
    let archiveDates = derived(() => data.dates.filter((d) => d !== data.date));
    const labels = config.labels;
    const SITE_URL = config.site.url;
    const siteTitle = config.site.title;
    const siteDesc = config.site.description;
    const subtitle = config.site.subtitle;
    function formatDate(dateStr) {
      if (!dateStr) return "";
      const d = /* @__PURE__ */ new Date(dateStr + "T00:00:00");
      return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
    }
    function getSources(article) {
      if (article.relatedSources?.length > 0) return article.relatedSources;
      return [article.source];
    }
    let copiedId = null;
    let canonicalUrl = derived(() => `${SITE_URL}/${content()?.date || ""}`);
    let pageTitle = derived(() => `${siteTitle[currentLang()]} — ${content()?.date || "Today"}`);
    let pageDesc = derived(() => {
      if (!content()?.featured?.length) return siteDesc[currentLang()];
      const titles = content().featured.map((a) => a.suggestedTitle || a.title).slice(0, 2).join("; ");
      const more = content().quickNews?.length || 0;
      const suffix = {
        en: ` + ${more} more`,
        zh: ` + ${more} 条快讯`,
        ja: ` + ${more} 件の速報`
      };
      return more > 0 ? titles + suffix[currentLang()] : titles;
    });
    let jsonLdScript = derived(() => {
      const ld = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: pageTitle(),
        description: pageDesc(),
        url: canonicalUrl()
      };
      return '<script type="application/ld+json">' + JSON.stringify(ld) + "<\/script>";
    });
    head("1lvll81", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(pageTitle())}</title>`);
      });
      $$renderer3.push(`<meta name="description"${attr("content", pageDesc())}/> <link rel="canonical"${attr("href", canonicalUrl())}/> <meta property="og:url"${attr("content", canonicalUrl())}/> <meta property="og:title"${attr("content", pageTitle())}/> <meta property="og:description"${attr("content", pageDesc())}/> <meta name="twitter:url"${attr("content", canonicalUrl())}/> <meta name="twitter:title"${attr("content", pageTitle())}/> <meta name="twitter:description"${attr("content", pageDesc())}/> ${html(jsonLdScript())}`);
    });
    $$renderer2.push(`<main class="max-w-3xl mx-auto px-5">`);
    if (!content()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="text-center py-32"><p class="text-cyber-text-muted font-display text-sm tracking-widest">${escape_html(labels.empty[currentLang()])}</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="pt-14 pb-10 animate-in">`);
      if (data.date !== data.latest) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<a href="/" class="inline-block text-[10px] font-display tracking-[0.2em] text-cyber-amber/70 hover:text-cyber-amber transition-colors duration-200 no-underline uppercase mb-4">← ${escape_html(labels.backToday[currentLang()])}</a>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <p class="text-[10px] text-cyber-text-muted uppercase tracking-[0.3em] mb-3 font-display">${escape_html(subtitle[currentLang()])}</p> <h2 class="text-4xl sm:text-5xl font-display font-black tracking-tight text-cyber-heading">${escape_html(formatDate(content().date))}</h2> <div class="flex items-center gap-3 mt-4"><div class="gradient-line flex-1"></div> <span class="text-[10px] text-cyber-text-muted tracking-widest font-display tabular-nums">${escape_html(content().metadata?.totalArticles || 0)} ${escape_html(labels.sources[currentLang()])}</span></div></div> `);
      if (data.weeks?.length > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<a${attr("href", `/weekly/${stringify(data.weeks[0])}`)} class="group flex items-center justify-between border border-cyber-magenta/20 rounded-sm px-4 py-3 mb-8 transition-all duration-300 hover:border-cyber-magenta/40 bg-cyber-surface/40 no-underline animate-in"><div class="flex items-center gap-3"><span class="text-[10px] font-display font-bold tracking-[0.3em] text-cyber-magenta/60 uppercase">${escape_html(labels.weeklyReport[currentLang()])}</span> <span class="text-cyber-border">·</span> <span class="text-[12px] text-cyber-text-muted group-hover:text-cyber-magenta transition-colors duration-200">${escape_html(data.weeks[0])}</span></div> <span class="text-cyber-magenta/40 group-hover:text-cyber-magenta transition-colors duration-200">→</span></a>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (content().featured?.length > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<section class="pb-8"><div class="flex items-center gap-3 mb-8"><span class="text-[10px] font-display font-bold tracking-[0.3em] text-cyber-magenta glow-magenta uppercase">${escape_html(labels.featured[currentLang()])}</span> <div class="flex-1 h-px bg-cyber-border"></div></div> <div class="space-y-6"><!--[-->`);
        const each_array = ensure_array_like(content().featured);
        for (let i = 0, $$length = each_array.length; i < $$length; i++) {
          let article = each_array[i];
          const displayTitle = article.suggestedTitle || article.title;
          const displaySummary = article.suggestedSummary || article.summary || "";
          const sources = getSources(article);
          $$renderer2.push(`<article class="group relative border border-cyber-border rounded-sm p-5 sm:p-6 transition-all duration-300 hover:border-cyber-cyan/40 hover:border-glow bg-cyber-surface/60 animate-in"${attr_style(`animation-delay: ${stringify(i * 120)}ms`)}><span class="absolute top-0 left-0 w-3 h-3 border-t border-l border-cyber-cyan/50"></span> <span class="absolute top-0 right-0 w-3 h-3 border-t border-r border-cyber-cyan/50"></span> <span class="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-cyber-cyan/50"></span> <span class="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cyber-cyan/50"></span> <div class="flex items-start gap-4"><span class="font-display text-3xl sm:text-4xl font-black text-cyber-cyan/20 leading-none select-none tabular-nums flicker shrink-0">${escape_html(String(i + 1).padStart(2, "0"))}</span> <div class="flex-1 min-w-0"><h3 class="text-base sm:text-lg font-bold leading-snug text-cyber-heading mb-3 tracking-tight">`);
          if (article.url) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<a${attr("href", article.url)} target="_blank" rel="noopener noreferrer" class="hover:text-cyber-cyan transition-colors duration-200 no-underline">${escape_html(displayTitle)}</a>`);
          } else {
            $$renderer2.push("<!--[-1-->");
            $$renderer2.push(`${escape_html(displayTitle)}`);
          }
          $$renderer2.push(`<!--]--></h3> <p class="text-[13px] text-cyber-text leading-relaxed mb-4 opacity-85">${escape_html(displaySummary)}</p> <div class="flex flex-wrap items-center gap-2"><span class="text-[10px] text-cyber-text-muted tracking-wider uppercase font-display">${escape_html(labels.fromSources[currentLang()])}</span> <!--[-->`);
          const each_array_1 = ensure_array_like(sources);
          for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
            let src = each_array_1[$$index];
            $$renderer2.push(`<span class="text-[10px] px-2 py-0.5 rounded-sm bg-cyber-cyan/10 text-cyber-cyan/80 border border-cyber-cyan/20 tracking-wider">${escape_html(src)}</span>`);
          }
          $$renderer2.push(`<!--]--> `);
          if (article.url) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<span class="flex-1"></span> <span class="flex items-center gap-1"><button class="p-1 text-cyber-text-muted/40 hover:text-cyber-cyan transition-colors duration-200" title="Share on X"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg></button> <button class="p-1 text-cyber-text-muted/40 hover:text-cyber-cyan transition-colors duration-200" title="Copy link">`);
            if (copiedId === article.id) {
              $$renderer2.push("<!--[0-->");
              $$renderer2.push(`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`);
            } else {
              $$renderer2.push("<!--[-1-->");
              $$renderer2.push(`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`);
            }
            $$renderer2.push(`<!--]--></button></span>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--></div></div></div></article>`);
        }
        $$renderer2.push(`<!--]--></div></section>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (data.sponsor) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<section class="py-6 animate-in"${attr_style(`animation-delay: ${stringify((content()?.featured?.length || 0) * 120 + 100)}ms`)}><a${attr("href", typeof data.sponsor.url === "string" ? data.sponsor.url : data.sponsor.url[currentLang()])} target="_blank" rel="noopener noreferrer sponsored" class="group block relative border border-cyber-amber/20 rounded-sm p-5 sm:p-6 transition-all duration-300 hover:border-cyber-amber/40 bg-cyber-surface/40 no-underline"><span class="text-[10px] font-display font-bold tracking-[0.3em] text-cyber-amber/60 uppercase">${escape_html(data.sponsor.label)}</span> <h3 class="text-base sm:text-lg font-bold leading-snug text-cyber-heading mt-2 mb-2 tracking-tight group-hover:text-cyber-amber transition-colors duration-200">${escape_html(data.sponsor.name)} — ${escape_html(data.sponsor.title[currentLang()])}</h3> <p class="text-[13px] text-cyber-text/70 leading-relaxed">${escape_html(data.sponsor.description[currentLang()])}</p></a></section>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (content().quickNews?.length > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<section class="py-8"><div class="flex items-center gap-3 mb-6"><span class="text-[10px] font-display font-bold tracking-[0.3em] text-cyber-green uppercase" style="text-shadow: 0 0 7px rgba(57, 255, 20, 0.4);">${escape_html(labels.signal[currentLang()])}</span> <div class="flex-1 h-px bg-cyber-border"></div></div> <ul class="space-y-0"><!--[-->`);
        const each_array_2 = ensure_array_like(content().quickNews);
        for (let i = 0, $$length = each_array_2.length; i < $$length; i++) {
          let article = each_array_2[i];
          $$renderer2.push(`<li class="flex items-baseline gap-3 py-2.5 border-b border-cyber-border/50 text-sm group/item transition-colors duration-200 hover:bg-cyber-cyan/3 animate-in"${attr_style(`animation-delay: ${stringify((content().featured?.length || 0) * 120 + i * 80)}ms`)}><span class="text-[10px] text-cyber-cyan/40 font-mono tabular-nums select-none w-5 text-right shrink-0">${escape_html(String(i + 1).padStart(2, "0"))}</span> <span class="flex-1 text-cyber-text leading-snug transition-colors duration-200 group-hover/item:text-cyber-heading">`);
          if (article.url) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<a${attr("href", article.url)} target="_blank" rel="noopener noreferrer" class="text-inherit hover:text-cyber-cyan transition-colors duration-200 no-underline">${escape_html(article.title)}</a>`);
          } else {
            $$renderer2.push("<!--[-1-->");
            $$renderer2.push(`${escape_html(article.title)}`);
          }
          $$renderer2.push(`<!--]--></span> <span class="text-[10px] text-cyber-text-muted tracking-wider font-display shrink-0 uppercase">${escape_html(article.source)}</span> `);
          if (article.url) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<span class="flex items-center gap-1 shrink-0"><button class="p-0.5 text-cyber-text-muted/30 hover:text-cyber-cyan transition-colors duration-200" title="Share on X"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg></button> <button class="p-0.5 text-cyber-text-muted/30 hover:text-cyber-cyan transition-colors duration-200" title="Copy link">`);
            if (copiedId === article.id) {
              $$renderer2.push("<!--[0-->");
              $$renderer2.push(`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`);
            } else {
              $$renderer2.push("<!--[-1-->");
              $$renderer2.push(`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`);
            }
            $$renderer2.push(`<!--]--></button></span>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--></li>`);
        }
        $$renderer2.push(`<!--]--></ul></section>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <section class="py-8"><div class="rounded-sm px-5 sm:px-6 py-6 border border-cyber-border/40 bg-cyber-surface/20 text-center"><p class="text-[10px] font-display font-bold tracking-[0.3em] text-cyber-cyan glow-cyan uppercase mb-2">${escape_html(labels.stayUpdated[currentLang()])}</p> <p class="text-[11px] text-cyber-text-muted/70 leading-relaxed mb-4">${escape_html(labels.stayUpdatedDesc[currentLang()])}</p> `);
      SubscribeForm($$renderer2, { lang: currentLang() });
      $$renderer2.push(`<!----></div></section> `);
      if (archiveDates().length > 0 || data.weeks?.length > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<section class="py-8"><div class="flex items-center gap-3 mb-6"><span class="text-[10px] font-display font-bold tracking-[0.3em] text-cyber-amber uppercase" style="text-shadow: 0 0 7px rgba(255, 184, 0, 0.3);">${escape_html(labels.archive[currentLang()])}</span> <div class="flex-1 h-px bg-cyber-border"></div></div> `);
        if (data.weeks?.length > 0) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="flex flex-wrap gap-2 mb-4"><!--[-->`);
          const each_array_3 = ensure_array_like(data.weeks);
          for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
            let w = each_array_3[$$index_3];
            $$renderer2.push(`<a${attr("href", `/weekly/${stringify(w)}`)} class="text-[11px] font-mono tabular-nums px-3 py-1.5 rounded-sm border transition-all duration-200 no-underline border-cyber-magenta/30 text-cyber-magenta/60 hover:border-cyber-magenta/50 hover:text-cyber-magenta hover:bg-cyber-magenta/5">${escape_html(w)}</a>`);
          }
          $$renderer2.push(`<!--]--></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <div class="flex flex-wrap gap-2"><!--[-->`);
        const each_array_4 = ensure_array_like(archiveDates());
        for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
          let d = each_array_4[$$index_4];
          const isCurrent = d === data.date;
          $$renderer2.push(`<a${attr("href", `/${stringify(d)}`)}${attr_class(`text-[11px] font-mono tabular-nums px-3 py-1.5 rounded-sm border transition-all duration-200 no-underline ${stringify(isCurrent ? "border-cyber-amber/40 bg-cyber-amber/10 text-cyber-amber" : "border-cyber-border/50 text-cyber-text-muted hover:border-cyber-amber/30 hover:text-cyber-amber/80 hover:bg-cyber-amber/5")}`)}>${escape_html(d)}</a>`);
        }
        $$renderer2.push(`<!--]--></div></section>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <footer class="py-10 text-center"><div class="gradient-line mb-6"></div> <p class="text-[10px] text-cyber-text-muted tracking-widest font-display tabular-nums">${escape_html(content().metadata?.generatedAt ? new Date(content().metadata.generatedAt).toLocaleString() : "")}</p> <p class="text-[10px] text-cyber-text-muted/50 tracking-wider font-display mt-2 flex items-center justify-center gap-3"><a href="/about" class="hover:text-cyber-cyan transition-colors duration-200 no-underline">ABOUT</a> <span class="text-cyber-border">·</span> <a${attr("href", { en: "/rss.xml", zh: "/rss-zh.xml", ja: "/rss-ja.xml" }[currentLang()])} class="hover:text-cyber-amber transition-colors duration-200 no-underline" target="_blank" rel="noopener noreferrer">RSS</a> <span class="text-cyber-border">·</span> <a${attr("href", `https://docs.google.com/forms/d/e/1FAIpQLSeQg6mNFUf7Mpzes-jTT5iTsJ1grPzgKBtkMtYNWKzEcdXnuw/viewform?usp=pp_url&entry.1797362154=${stringify(encodeURIComponent(siteTitle))}`)} class="hover:text-cyber-green transition-colors duration-200 no-underline" target="_blank" rel="noopener noreferrer">FEEDBACK</a></p></footer>`);
    }
    $$renderer2.push(`<!--]--></main>`);
  });
}
export {
  _page as default
};
