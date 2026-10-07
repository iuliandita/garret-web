try {
  const saved = localStorage.getItem('garret-theme');
  if (saved === 'light' || saved === 'dark') {
    document.documentElement.dataset.theme = saved;
    document.querySelectorAll('meta[name="theme-color"]').forEach(meta => {
      meta.content = saved === 'dark' ? '#211f1c' : '#f8f5ef';
    });
    const sources = new MutationObserver(records => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (!(node instanceof Element)) continue;
          const candidates = node.matches('[data-theme-source]') ? [node] : node.querySelectorAll('[data-theme-source]');
          for (const source of candidates) source.media = saved === 'dark' ? 'all' : 'not all';
        }
      }
    });
    sources.observe(document.documentElement, { childList: true, subtree: true });
    document.addEventListener('DOMContentLoaded', () => sources.disconnect(), { once: true });
  }
} catch {}
