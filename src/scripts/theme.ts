type Theme = 'auto' | 'light' | 'dark';
const validTheme = (value: string | null): value is Theme => value === 'auto' || value === 'light' || value === 'dark';

export function initThemeControls(): void {
  const button = document.querySelector<HTMLButtonElement>('#theme-toggle');
  if (!button) return;
  let preference: Theme = 'auto';
  try {
    const saved = localStorage.getItem('garret-theme');
    if (validTheme(saved)) preference = saved;
  } catch {
    // Storage may be blocked; the controls still work for this page.
  }
  document.documentElement.dataset.theme = preference;
  const system = matchMedia('(prefers-color-scheme: dark)');
  const isDark = (): boolean => preference === 'dark' || (preference === 'auto' && system.matches);
  const render = (): void => {
    const dark = isDark();
    const target = dark ? 'light' : 'dark';
    document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach(meta => {
      meta.content = dark ? '#211f1c' : '#f8f5ef';
    });
    document.querySelectorAll<HTMLSourceElement>('[data-theme-source]').forEach(source => {
      source.media = dark ? 'all' : 'not all';
    });
    const label = target === 'light' ? button.dataset.lightLabel : button.dataset.darkLabel;
    button.setAttribute('aria-label', label ?? target);
    button.title = label ?? target;
    button.querySelectorAll<HTMLElement>('[data-theme-icon]').forEach(icon => { icon.hidden = icon.dataset.themeIcon !== target; });
  };
  render();
  button.hidden = false;
  system.addEventListener('change', render);
  button.addEventListener('click', () => {
    preference = isDark() ? 'light' : 'dark';
    document.documentElement.dataset.theme = preference;
    render();
    try { localStorage.setItem('garret-theme', preference); } catch { /* Page-local choice remains usable. */ }
  });
}
