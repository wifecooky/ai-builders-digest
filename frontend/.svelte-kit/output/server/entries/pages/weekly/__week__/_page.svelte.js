import { g as getContext, h as head, e as escape_html, a as ensure_array_like, a5 as attr_style, c as attr, b as attr_class, d as stringify, a4 as derived } from "../../../../chunks/index.js";
import { c as config } from "../../../../chunks/_virtual_site-config.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    const app = getContext("app");
    let currentLang = derived(() => app.currentLang);
    let content = derived(() => data.content[currentLang()] || data.content.en);
    const labels = config.labels;
    const SITE_URL = config.site.url;
    head("1yoj9zf", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(labels.weeklyTitle[currentLang()])} — ${escape_html(data.week)}</title>`);
      });
      $$renderer3.push(`<meta name="description"${attr("content", content()?.week_overview || "")}/> <link rel="canonical"${attr("href", `${stringify(SITE_URL)}/weekly/${stringify(data.week)}`)}/>`);
    });
    $$renderer2.push(`<main class="max-w-3xl mx-auto px-5">`);
    if (!content()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="text-center py-32"><p class="text-cyber-text-muted font-display text-sm tracking-widest">No report available.</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="pt-14 pb-10 animate-in"><a href="/" class="inline-block text-[10px] font-display tracking-[0.2em] text-cyber-amber/70 hover:text-cyber-amber transition-colors duration-200 no-underline uppercase mb-4">${escape_html(labels.backDaily[currentLang()])}</a> <p class="text-[10px] text-cyber-text-muted uppercase tracking-[0.3em] mb-3 font-display">${escape_html(labels.weeklyTitle[currentLang()])}</p> <h2 class="text-4xl sm:text-5xl font-display font-black tracking-tight text-cyber-heading">${escape_html(data.week)}</h2> <div class="flex items-center gap-3 mt-4"><div class="gradient-line flex-1"></div> <span class="text-[10px] text-cyber-text-muted tracking-widest font-display tabular-nums">${escape_html(content().metadata?.totalArticles || 0)} articles this week</span></div></div> <section class="pb-8"><div class="flex items-center gap-3 mb-6"><span class="text-[10px] font-display font-bold tracking-[0.3em] text-cyber-cyan glow-cyan uppercase">${escape_html(labels.weeklyOverview[currentLang()])}</span> <div class="flex-1 h-px bg-cyber-border"></div></div> <p class="text-[13px] text-cyber-text leading-relaxed">${escape_html(content().week_overview)}</p></section> `);
      if (content().trends?.length > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<section class="pb-8"><div class="flex items-center gap-3 mb-8"><span class="text-[10px] font-display font-bold tracking-[0.3em] text-cyber-magenta glow-magenta uppercase">${escape_html(labels.weeklyTrends[currentLang()])}</span> <div class="flex-1 h-px bg-cyber-border"></div></div> <div class="space-y-6"><!--[-->`);
        const each_array = ensure_array_like(content().trends);
        for (let i = 0, $$length = each_array.length; i < $$length; i++) {
          let trend = each_array[i];
          $$renderer2.push(`<article class="relative border border-cyber-border rounded-sm p-5 sm:p-6 transition-all duration-300 hover:border-cyber-magenta/40 bg-cyber-surface/60 animate-in"${attr_style(`animation-delay: ${stringify(i * 120)}ms`)}><span class="absolute top-0 left-0 w-3 h-3 border-t border-l border-cyber-magenta/50"></span> <span class="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cyber-magenta/50"></span> <div class="flex items-start gap-4"><span class="font-display text-3xl font-black text-cyber-magenta/20 leading-none select-none shrink-0">${escape_html(String(i + 1).padStart(2, "0"))}</span> <div class="flex-1"><h3 class="text-base sm:text-lg font-bold text-cyber-heading mb-3 tracking-tight">${escape_html(trend.title)}</h3> <p class="text-[13px] text-cyber-text leading-relaxed opacity-85">${escape_html(trend.narrative)}</p></div></div></article>`);
        }
        $$renderer2.push(`<!--]--></div></section>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (content().hot10?.length > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<section class="py-8"><div class="flex items-center gap-3 mb-6"><span class="text-[10px] font-display font-bold tracking-[0.3em] text-cyber-green uppercase" style="text-shadow: 0 0 7px rgba(57, 255, 20, 0.4);">${escape_html(labels.weeklyHot10[currentLang()])}</span> <div class="flex-1 h-px bg-cyber-border"></div></div> <ul class="space-y-0"><!--[-->`);
        const each_array_1 = ensure_array_like(content().hot10);
        for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
          let article = each_array_1[i];
          $$renderer2.push(`<li class="flex items-baseline gap-3 py-2.5 border-b border-cyber-border/50 text-sm group/item transition-colors duration-200 hover:bg-cyber-cyan/3 animate-in"${attr_style(`animation-delay: ${stringify(i * 60)}ms`)}><span class="text-[10px] text-cyber-cyan/40 font-mono tabular-nums select-none w-5 text-right shrink-0">${escape_html(String(i + 1).padStart(2, "0"))}</span> <span class="flex-1 text-cyber-text leading-snug transition-colors duration-200 group-hover/item:text-cyber-heading">`);
          if (article.url) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<a${attr("href", article.url)} target="_blank" rel="noopener noreferrer" class="text-inherit hover:text-cyber-cyan transition-colors duration-200 no-underline">${escape_html(article.title)}</a>`);
          } else {
            $$renderer2.push("<!--[-1-->");
            $$renderer2.push(`${escape_html(article.title)}`);
          }
          $$renderer2.push(`<!--]--></span> <span class="text-[10px] text-cyber-text-muted tracking-wider font-display shrink-0 uppercase">${escape_html(article.source)}</span></li>`);
        }
        $$renderer2.push(`<!--]--></ul></section>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (content().next_week_outlook) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<section class="py-8"><div class="flex items-center gap-3 mb-6"><span class="text-[10px] font-display font-bold tracking-[0.3em] text-cyber-amber uppercase" style="text-shadow: 0 0 7px rgba(255, 184, 0, 0.3);">${escape_html(labels.weeklyOutlook[currentLang()])}</span> <div class="flex-1 h-px bg-cyber-border"></div></div> <p class="text-[13px] text-cyber-text leading-relaxed">${escape_html(content().next_week_outlook)}</p></section>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (data.weeks.length > 1) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<section class="py-8"><div class="flex items-center gap-3 mb-6"><span class="text-[10px] font-display font-bold tracking-[0.3em] text-cyber-amber uppercase">${escape_html(labels.weeklyArchive[currentLang()])}</span> <div class="flex-1 h-px bg-cyber-border"></div></div> <div class="flex flex-wrap gap-2"><!--[-->`);
        const each_array_2 = ensure_array_like(data.weeks);
        for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
          let w = each_array_2[$$index_2];
          $$renderer2.push(`<a${attr("href", `/weekly/${stringify(w)}`)}${attr_class(`text-[11px] font-mono tabular-nums px-3 py-1.5 rounded-sm border transition-all duration-200 no-underline ${stringify(w === data.week ? "border-cyber-amber/40 bg-cyber-amber/10 text-cyber-amber" : "border-cyber-border/50 text-cyber-text-muted hover:border-cyber-amber/30 hover:text-cyber-amber/80")}`)}>${escape_html(w)}</a>`);
        }
        $$renderer2.push(`<!--]--></div></section>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <footer class="py-10 text-center"><div class="gradient-line mb-6"></div> <p class="text-[10px] text-cyber-text-muted tracking-widest font-display tabular-nums">${escape_html(content().metadata?.generatedAt ? new Date(content().metadata.generatedAt).toLocaleString() : "")}</p></footer>`);
    }
    $$renderer2.push(`<!--]--></main>`);
  });
}
export {
  _page as default
};
