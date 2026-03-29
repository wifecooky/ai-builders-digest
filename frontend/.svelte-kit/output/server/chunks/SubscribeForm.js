import { c as attr, e as escape_html, d as stringify } from "./index.js";
import { c as config } from "./_virtual_site-config.js";
function SubscribeForm($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { lang = "en" } = $$props;
    const labels = {
      subscribe: config.labels.subscribe,
      placeholder: config.labels.emailPlaceholder
    };
    const tagMap = { en: "lang:en", zh: "lang:zh", ja: "lang:ja" };
    const username = config.newsletter?.username;
    $$renderer2.push(`<form${attr("action", `https://buttondown.com/api/emails/embed-subscribe/${stringify(username)}`)} method="post" target="_blank" class="flex items-center justify-center gap-2 max-w-sm mx-auto"><input type="email" name="email"${attr("placeholder", labels.placeholder[lang])} required="" class="flex-1 min-w-0 text-xs px-3 py-1.5 bg-cyber-surface border border-cyber-border rounded-sm text-cyber-text placeholder:text-cyber-text-muted/40 focus:border-cyber-cyan/50 focus:outline-none transition-colors duration-200 font-mono"/> <input type="hidden" value="1" name="embed"/> <input type="hidden" name="tag"${attr("value", tagMap[lang])}/> <button type="submit" class="text-[10px] font-display font-bold tracking-[0.2em] px-4 py-1.5 border border-cyber-cyan/40 rounded-sm text-cyber-cyan bg-cyber-cyan/10 hover:bg-cyber-cyan/20 transition-colors duration-200 uppercase shrink-0">${escape_html(labels.subscribe[lang])}</button></form>`);
  });
}
export {
  SubscribeForm as S
};
