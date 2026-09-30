export function initFeatureBrowser(): void {
  const root = document.querySelector<HTMLElement>('[data-feature-browser]');
  const track = root?.querySelector<HTMLElement>('.feature-track');
  const controls = root?.querySelector<HTMLElement>('.browse-controls');
  const previous = root?.querySelector<HTMLButtonElement>('[data-previous]');
  const next = root?.querySelector<HTMLButtonElement>('[data-next]');
  const status = root?.querySelector<HTMLElement>('.browse-position');
  const counter = status?.querySelector<HTMLElement>('[data-counter]');
  const announcement = status?.querySelector<HTMLElement>('[data-announcement]');
  if (!root || !track || !controls || !previous || !next || !status || !counter || !announcement) return;
  const slides = [...track.querySelectorAll<HTMLElement>('.feature-slide')];
  const links = [...root.querySelectorAll<HTMLAnchorElement>('.feature-nav a')];
  let current = 0;
  const offset = (slide: HTMLElement): number => slide.offsetLeft - slides[0].offsetLeft;
  const update = (): void => {
    current = slides.reduce((nearest, slide, index) =>
      Math.abs(offset(slide) - track.scrollLeft) < Math.abs(offset(slides[nearest]) - track.scrollLeft) ? index : nearest, 0);
    previous.disabled = current === 0;
    next.disabled = current === slides.length - 1;
    counter.textContent = `${current + 1}/${slides.length}`;
    announcement.textContent = `${status.dataset.positionLabel} ${current + 1} ${status.dataset.ofLabel} ${slides.length}`;
    links.forEach((link, index) => {
      if (index === current) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };
  const go = (index: number): void => {
    const slide = slides[Math.max(0, Math.min(slides.length - 1, index))];
    track.scrollTo({ left: offset(slide), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };
  previous.addEventListener('click', () => go(current - 1));
  next.addEventListener('click', () => go(current + 1));
  links.forEach((link, index) => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    go(index);
  }));
  track.addEventListener('keydown', event => {
    if (event.target !== track) return;
    const destinations: Record<string, number> = { ArrowLeft: current - 1, ArrowRight: current + 1, Home: 0, End: slides.length - 1 };
    if (!(event.key in destinations)) return;
    event.preventDefault();
    go(destinations[event.key]);
  });
  let settle: ReturnType<typeof setTimeout>;
  track.addEventListener('scroll', () => {
    clearTimeout(settle);
    settle = setTimeout(update, 120);
  });
  new ResizeObserver(update).observe(track);
  controls.hidden = false;
  update();
}
