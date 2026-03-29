import { g as getContext, h as head, e as escape_html, a as ensure_array_like, a5 as attr_style, a4 as derived, c as attr, d as stringify } from "../../../chunks/index.js";
import { c as config } from "../../../chunks/_virtual_site-config.js";
import { S as SubscribeForm } from "../../../chunks/SubscribeForm.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const app = getContext("app");
    let currentLang = derived(() => app.currentLang);
    const about = config.about;
    const labels = config.labels;
    const SITE_URL = config.site.url;
    const siteTitle = config.site.title;
    const rssSources = config.sources.rss || [];
    const sourceNames = rssSources.map((s) => s.name);
    const sourceCount = sourceNames.length + 1 + 1;
    const pipeline = {
      en: [
        {
          step: "01",
          name: "COLLECT",
          desc: `RSS feeds and APIs polled every 24h from ${sourceCount} sources. Deduplicated by URL, filtered to last 24h.`
        },
        {
          step: "02",
          name: "SCORE",
          desc: "Composite score: source authority weight, multi-source verification, community engagement, timeliness decay."
        },
        {
          step: "03",
          name: "AI SELECT",
          desc: "All candidates sent to AI with editorial guidelines. Featured stories + quick news, with story synthesis."
        },
        {
          step: "04",
          name: "TRANSLATE",
          desc: "Editorial headlines + technical analysis in EN/ZH/JA via AI with domain terminology."
        }
      ],
      zh: [
        {
          step: "01",
          name: "采集",
          desc: `每 24 小时从 ${sourceCount} 个数据源轮询 RSS 和 API。按 URL 去重，过滤至最近 24 小时。`
        },
        {
          step: "02",
          name: "评分",
          desc: "综合评分：数据源权威权重、多源交叉验证、社区互动指标、时效性衰减。"
        },
        {
          step: "03",
          name: "AI 筛选",
          desc: "全部候选发送至 AI，选出深度解读和快讯，相关报道合成叙事。"
        },
        { step: "04", name: "翻译", desc: "生成编辑标题和分析段落，通过 AI 翻译为中英日三语。" }
      ],
      ja: [
        {
          step: "01",
          name: "収集",
          desc: `${sourceCount}ソースから24時間ごとにRSSとAPIをポーリング。URL重複排除、直近24時間に絞込。`
        },
        {
          step: "02",
          name: "スコア",
          desc: "複合スコア：ソース権威性、複数ソース検証、コミュニティ指標、鮮度減衰。"
        },
        {
          step: "03",
          name: "AI選定",
          desc: "全候補をAIに送信。特集とクイックニュースを選出、関連記事を統合。"
        },
        { step: "04", name: "翻訳", desc: "編集見出しと分析を生成。AIで中国語・日本語に翻訳。" }
      ]
    };
    const pipelineTitle = { en: "PIPELINE", zh: "处理流程", ja: "パイプライン" };
    const disclaimerTitle = { en: "DISCLAIMER", zh: "免责声明", ja: "免責事項" };
    const aboutPageTitle = derived(() => `${about.title[currentLang()]} — ${siteTitle[currentLang()]}`);
    head("cwls5q", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(aboutPageTitle())}</title>`);
      });
      $$renderer3.push(`<meta name="description"${attr("content", about.overview[currentLang()])}/> <link rel="canonical"${attr("href", `${stringify(SITE_URL)}/about`)}/> <meta property="og:url"${attr("content", `${stringify(SITE_URL)}/about`)}/> <meta property="og:title"${attr("content", aboutPageTitle())}/> <meta property="og:description"${attr("content", about.overview[currentLang()])}/> <meta name="twitter:title"${attr("content", aboutPageTitle())}/> <meta name="twitter:description"${attr("content", about.overview[currentLang()])}/>`);
    });
    $$renderer2.push(`<main class="max-w-3xl mx-auto px-6 sm:px-8 pt-14 sm:pt-20 pb-10"><div class="relative mb-14 sm:mb-20 animate-in"><div class="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-cyber-cyan/30 hidden sm:block"></div> <div class="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-cyber-cyan/30 hidden sm:block"></div> <p class="text-[10px] font-mono tracking-[0.3em] text-cyber-cyan/40 mb-5">// SYSTEM.DOCS</p> <h1 class="font-display text-2xl sm:text-4xl font-black tracking-tight text-cyber-heading mb-6">${escape_html(about.title[currentLang()])}</h1> <p class="text-[13px] sm:text-sm text-cyber-text/80 leading-[1.9] max-w-2xl">${escape_html(about.overview[currentLang()])}</p> <div class="gradient-line mt-8"></div></div> <section class="mb-14 sm:mb-20 animate-in" style="animation-delay: 120ms"><div class="flex items-center gap-3 mb-8 sm:mb-10"><span class="text-[10px] font-display font-bold tracking-[0.3em] text-cyber-cyan glow-cyan uppercase">${escape_html(pipelineTitle[currentLang()])}</span> <div class="flex-1 h-px bg-cyber-border"></div> <span class="text-[10px] font-mono text-cyber-cyan/25 tabular-nums">04</span></div> <div class="relative pl-8 sm:pl-10"><div class="absolute left-[9px] sm:left-[11px] top-1 bottom-1 w-px bg-gradient-to-b from-cyber-cyan/30 via-cyber-cyan/10 to-cyber-cyan/5"></div> <!--[-->`);
    const each_array = ensure_array_like(pipeline[currentLang()]);
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      let item = each_array[i];
      $$renderer2.push(`<div class="relative flex gap-5 sm:gap-6 pb-8 last:pb-0 animate-in"${attr_style(`animation-delay: ${stringify(180 + i * 100)}ms`)}><div class="absolute -left-8 sm:-left-10 top-0.5 z-10 w-[19px] sm:w-[23px] h-[19px] sm:h-[23px] rounded-full border border-cyber-cyan/30 bg-cyber-bg flex items-center justify-center"><div class="w-1.5 h-1.5 rounded-full bg-cyber-cyan/50"></div></div> <div class="flex-1 min-w-0"><div class="flex items-baseline gap-2.5 mb-2"><span class="font-mono text-[10px] text-cyber-cyan/30 tabular-nums">${escape_html(item.step)}</span> <span class="font-display text-[11px] sm:text-[12px] font-bold tracking-[0.15em] text-cyber-heading uppercase">${escape_html(item.name)}</span></div> <p class="text-[12px] sm:text-[13px] text-cyber-text/60 leading-relaxed">${escape_html(item.desc)}</p></div></div>`);
    }
    $$renderer2.push(`<!--]--></div></section> <section class="mb-14 sm:mb-20 animate-in" style="animation-delay: 600ms"><div class="flex items-center gap-3 mb-8 sm:mb-10"><span class="text-[10px] font-display font-bold tracking-[0.3em] text-cyber-magenta glow-magenta uppercase">${escape_html({ en: "DATA SOURCES", zh: "数据源", ja: "データソース" }[currentLang()])}</span> <div class="flex-1 h-px bg-cyber-border"></div> <span class="text-[10px] font-mono text-cyber-magenta/25 tabular-nums">${escape_html(sourceCount)}</span></div> <div class="flex flex-wrap gap-1.5"><!--[-->`);
    const each_array_1 = ensure_array_like(sourceNames);
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let name = each_array_1[$$index_1];
      $$renderer2.push(`<span class="text-[10px] px-2 py-[3px] rounded-sm border tracking-wider bg-cyber-cyan/8 text-cyber-cyan/80 border-cyber-cyan/15">${escape_html(name)}</span>`);
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="text-[10px] px-2 py-[3px] rounded-sm border tracking-wider bg-cyber-green/8 text-cyber-green/80 border-cyber-green/15">Hacker News</span>`);
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="text-[10px] px-2 py-[3px] rounded-sm border tracking-wider bg-cyber-green/8 text-cyber-green/80 border-cyber-green/15">HuggingFace Papers</span>`);
    }
    $$renderer2.push(`<!--]--></div></section> <section class="mb-14 sm:mb-20 animate-in" style="animation-delay: 800ms"><div class="rounded-sm px-5 sm:px-6 py-4 sm:py-5 border border-cyber-border/40 bg-cyber-surface/20"><p class="text-[11px] sm:text-[12px] text-cyber-text/60 leading-[1.8]">${escape_html(about.policyAudience[currentLang()])}</p></div></section> <section class="animate-in" style="animation-delay: 900ms"><div class="rounded-sm px-5 sm:px-6 py-4 sm:py-5 border border-cyber-border/40 bg-cyber-surface/20"><p class="text-[10px] font-display tracking-[0.15em] text-cyber-text-muted/50 uppercase mb-2">${escape_html(disclaimerTitle[currentLang()])}</p> <p class="text-[11px] sm:text-[12px] text-cyber-text-muted/70 leading-[1.8]">${escape_html(about.disclaimer[currentLang()])}</p></div></section> <section class="mt-14 sm:mt-20 animate-in" style="animation-delay: 1000ms"><div class="rounded-sm px-5 sm:px-6 py-6 sm:py-8 border border-cyber-border/40 bg-cyber-surface/20 text-center"><p class="text-[10px] font-display font-bold tracking-[0.3em] text-cyber-cyan glow-cyan uppercase mb-2">${escape_html(labels.stayUpdated[currentLang()])}</p> <p class="text-[11px] sm:text-[12px] text-cyber-text-muted/70 leading-relaxed mb-5">${escape_html(labels.stayUpdatedDesc[currentLang()])}</p> `);
    SubscribeForm($$renderer2, { lang: currentLang() });
    $$renderer2.push(`<!----></div></section> <footer class="pt-10 pb-4 text-center"><div class="gradient-line mb-6"></div> <a href="/" class="inline-block text-[10px] font-display tracking-[0.2em] text-cyber-text-muted/60 hover:text-cyber-cyan transition-colors duration-200 no-underline uppercase py-2 px-4">← BACK</a></footer></main>`);
  });
}
export {
  _page as default
};
