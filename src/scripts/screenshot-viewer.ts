export function initScreenshotViewer(): void {
  const dialog = document.querySelector<HTMLDialogElement>('#screenshot-viewer');
  const image = dialog?.querySelector<HTMLImageElement>('img');
  const close = dialog?.querySelector<HTMLButtonElement>('button');
  if (!dialog || !image || !close || typeof dialog.showModal !== 'function') return;
  let trigger: HTMLAnchorElement | null = null;
  document.querySelectorAll<HTMLAnchorElement>('[data-screenshot]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      trigger = link;
      image.src = link.href;
      image.alt = link.querySelector('img')?.alt ?? '';
      dialog.showModal();
      close.focus();
    });
  });
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    if (event.key === 'Tab') {
      event.preventDefault();
      close.focus();
    }
  });
  dialog.addEventListener('close', () => trigger?.focus());
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
}
