type Theme = 'auto' | 'light' | 'dark';
const validTheme = (value: string | null): value is Theme => value === 'auto' || value === 'light' || value === 'dark';

export function initThemeControls(): void {
  const select = document.querySelector<HTMLSelectElement>('#theme-preference');
  if (!select) return;
  let preference: Theme = 'auto';
  try {
    const saved = localStorage.getItem('garret-theme');
    if (validTheme(saved)) preference = saved;
  } catch {
    // Storage may be blocked; the controls still work for this page.
  }
  document.documentElement.dataset.theme = preference;
  select.value = preference;
  document.querySelector<HTMLElement>('[data-theme-controls]')?.removeAttribute('hidden');
  select.addEventListener('change', () => {
    if (!validTheme(select.value)) return;
    document.documentElement.dataset.theme = select.value;
    try { localStorage.setItem('garret-theme', select.value); } catch { /* Page-local choice remains usable. */ }
  });
}
