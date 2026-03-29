<script>
  import config from '$lib/site-config.js';

  /** @type {{ lang?: 'en' | 'zh' | 'ja' }} */
  let { lang = 'en' } = $props();

  const labels = {
    subscribe: config.labels.subscribe,
    placeholder: config.labels.emailPlaceholder,
  };

  const msgs = {
    en: { success: "You're in! Check your inbox.", error: 'Something went wrong. Try again.' },
    zh: { success: '订阅成功！请检查邮箱。', error: '出错了，请重试。' },
    ja: { success: '登録完了！メールを確認してください。', error: 'エラーが発生した。再試行してください。' },
  };

  const tagMap = { en: 'lang:en', zh: 'lang:zh', ja: 'lang:ja' };
  const username = config.newsletter?.username || 'newsletter';

  let email = $state('');
  let status = $state('idle');

  async function handleSubmit(e) {
    e.preventDefault();
    status = 'loading';
    try {
      const form = new FormData();
      form.append('email', email);
      form.append('tag', tagMap[lang]);
      form.append('embed', '1');
      await fetch(`https://buttondown.com/api/emails/embed-subscribe/${username}`, {
        method: 'POST',
        body: form,
        mode: 'no-cors',
      });
      status = 'success';
      email = '';
    } catch {
      status = 'error';
    }
    setTimeout(() => { if (status !== 'idle') status = 'idle'; }, 5000);
  }
</script>

{#if status === 'success'}
  <p class="text-xs text-cyber-green font-display tracking-wider animate-in">{msgs[lang].success}</p>
{:else if status === 'error'}
  <p class="text-xs text-red-400 font-display tracking-wider animate-in">{msgs[lang].error}</p>
{:else}
  <form
    onsubmit={handleSubmit}
    class="flex items-center justify-center gap-2 max-w-sm mx-auto"
  >
    <input
      type="email"
      bind:value={email}
      placeholder={labels.placeholder[lang]}
      required
      class="flex-1 min-w-0 text-xs px-3 py-1.5 bg-cyber-surface border border-cyber-border rounded-sm text-cyber-text placeholder:text-cyber-text-muted/40 focus:border-cyber-cyan/50 focus:outline-none transition-colors duration-200 font-mono"
    />
    <button
      type="submit"
      disabled={status === 'loading'}
      class="text-[10px] font-display font-bold tracking-[0.2em] px-4 py-1.5 border border-cyber-cyan/40 rounded-sm text-cyber-cyan bg-cyber-cyan/10 hover:bg-cyber-cyan/20 transition-colors duration-200 uppercase shrink-0 disabled:opacity-50"
    >{status === 'loading' ? '...' : labels.subscribe[lang]}</button>
  </form>
{/if}
