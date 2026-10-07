export function initScreenshotViewer(): void {
  const dialog = document.querySelector<HTMLDialogElement>('#screenshot-viewer');
  const image = dialog?.querySelector<HTMLImageElement>('img');
  const close = dialog?.querySelector<HTMLButtonElement>('[data-close]');
  const original = dialog?.querySelector<HTMLAnchorElement>('[data-original]');
  const zoom = dialog?.querySelector<HTMLButtonElement>('[data-zoom]');
  const status = dialog?.querySelector<HTMLElement>('[data-image-status]');
  const caption = dialog?.querySelector<HTMLElement>('[data-viewer-caption]');
  const hint = dialog?.querySelector<HTMLElement>('.viewer-hint');
  const viewport = dialog?.querySelector<HTMLElement>('.viewer-image');
  if (!dialog || !image || !close || !original || !zoom || !viewport || !status || !hint || !caption || typeof dialog.showModal !== 'function') return;
  const label = dialog.getAttribute('aria-label') ?? '';
  let trigger: HTMLAnchorElement | null = null;
  image.addEventListener('load', () => {
    image.hidden = false;
    hint.hidden = false;
    status.textContent = '';
    status.classList.add('sr-only');
    viewport.tabIndex = 0;
    zoom.disabled = image.naturalWidth <= image.getBoundingClientRect().width * 1.05;
    hint.hidden = zoom.disabled;
  });
  image.addEventListener('error', () => {
    if (!dialog.open) return;
    image.hidden = true;
    hint.hidden = true;
    status.textContent = status.dataset.error ?? '';
    status.classList.remove('sr-only');
    viewport.tabIndex = -1;
  });
  document.querySelectorAll<HTMLAnchorElement>('[data-screenshot]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      trigger = link;
      caption.textContent = link.closest('figure')?.querySelector('figcaption')?.textContent ?? '';
      const thumbnail = link.querySelector('img');
      image.width = Number(thumbnail?.getAttribute('width')) || 1440;
      image.height = Number(thumbnail?.getAttribute('height')) || 960;
      image.hidden = true;
      hint.hidden = true;
      status.textContent = status.dataset.loading ?? '';
      status.classList.remove('sr-only');
      viewport.tabIndex = -1;
      zoom.disabled = true;
      image.src = link.href;
      original.href = link.href;
      image.alt = link.querySelector('img')?.alt ?? '';
      dialog.setAttribute('aria-label', `${label}: ${image.alt}`);
      document.body.style.setProperty('--viewer-scrollbar-width', `${window.innerWidth - document.documentElement.clientWidth}px`);
      document.body.classList.add('viewer-open');
      dialog.showModal();
      close.focus();
    });
  });
  zoom.addEventListener('click', () => {
    const expanded = !dialog.classList.contains('image-expanded');
    const fittedWidth = image.getBoundingClientRect().width;
    zoom.textContent = (expanded ? zoom.dataset.fitLabel : zoom.dataset.zoomLabel) ?? '';
    dialog.classList.toggle('image-expanded', expanded);
    hint.textContent = (expanded ? hint.dataset.panHint : hint.dataset.zoomHint) ?? '';
    if (expanded) {
      const width = matchMedia('(max-width: 750px)').matches
        ? image.naturalWidth
        : Math.min(image.naturalWidth, fittedWidth * 2);
      image.style.width = `${width}px`;
    } else image.style.removeProperty('width');
    viewport.scrollTo(0, 0);
  });
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    document.body.classList.remove('viewer-open');
    document.body.style.removeProperty('--viewer-scrollbar-width');
    dialog.classList.remove('image-expanded');
    zoom.textContent = zoom.dataset.zoomLabel ?? '';
    hint.textContent = hint.dataset.zoomHint ?? '';
    viewport.scrollTo(0, 0);
    image.removeAttribute('src');
    image.style.removeProperty('width');
    status.textContent = '';
    status.classList.add('sr-only');
    viewport.tabIndex = -1;
    image.hidden = true;
    hint.hidden = true;
    image.alt = '';
    caption.textContent = '';
    dialog.setAttribute('aria-label', label);
    original.removeAttribute('href');
    trigger?.focus();
  });
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
}
