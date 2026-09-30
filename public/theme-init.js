try {
  const saved = localStorage.getItem('garret-theme');
  if (saved === 'light' || saved === 'dark') document.documentElement.dataset.theme = saved;
} catch {}
