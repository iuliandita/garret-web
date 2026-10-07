export function initFeatureBrowser(): void {
  const root = document.querySelector<HTMLElement>('[data-feature-browser]');
  const track = root?.querySelector<HTMLElement>('.feature-track');
  const controls = [...(root?.querySelectorAll<HTMLElement>('.browse-controls') ?? [])];
  const previous = [...(root?.querySelectorAll<HTMLButtonElement>('[data-previous]') ?? [])];
  const next = [...(root?.querySelectorAll<HTMLButtonElement>('[data-next]') ?? [])];
  const status = root?.querySelector<HTMLElement>('.browse-position');
  const counters = [...(root?.querySelectorAll<HTMLElement>('[data-counter]') ?? [])];
  const announcement = status?.querySelector<HTMLElement>('[data-announcement]');
  if (!root || !track || !controls.length || !previous.length || !next.length || !status || !counters.length || !announcement) return;
  const slides = [...track.querySelectorAll<HTMLElement>('.feature-slide')];
  const links = [...root.querySelectorAll<HTMLAnchorElement>('.feature-nav a')];
  if (!slides.length) return;
  let current = 0;
  const offset = (slide: HTMLElement): number => slide.offsetLeft - slides[0].offsetLeft;
  const update = (): void => {
    const prior = current;
    current = slides.reduce((nearest, slide, index) =>
      Math.abs(offset(slide) - track.scrollLeft) < Math.abs(offset(slides[nearest]) - track.scrollLeft) ? index : nearest, 0);
    previous.forEach(button => button.setAttribute('aria-disabled', String(current === 0)));
    next.forEach(button => button.setAttribute('aria-disabled', String(current === slides.length - 1)));
    counters.forEach(counter => { counter.textContent = `${current + 1}/${slides.length}`; });
    if (prior !== current) {
      announcement.textContent = `${status.dataset.positionLabel} ${current + 1} ${status.dataset.ofLabel} ${slides.length}`;
      history.replaceState(null, '', '#' + slides[current].id);
    }
    track.style.height = 'auto';
    const height = matchMedia('(min-width: 1101px)').matches
      ? Math.max(...slides.map(slide => slide.offsetHeight))
      : slides[current].offsetHeight;
    track.style.height = `${height + 16}px`;
    slides.forEach((slide, index) => {
      slide.setAttribute('aria-hidden', String(index !== current));
      slide.querySelectorAll<HTMLAnchorElement>('[data-screenshot]').forEach(link => { link.tabIndex = index === current ? 0 : -1; });
    });
    links.forEach((link, index) => {
      if (index === current) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };
  const go = (index: number): void => {
    const slide = slides[Math.max(0, Math.min(slides.length - 1, index))];
    history.replaceState(null, '', '#' + slide.id);
    track.scrollTo({ left: offset(slide), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };
  let selecting = false;
  track.addEventListener('pointerdown', () => { selecting = true; });
  document.addEventListener('pointerup', () => { selecting = false; });
  document.addEventListener('pointercancel', () => { selecting = false; });
  document.addEventListener('selectionchange', () => {
    if (selecting) return;
    const selection = document.getSelection()?.anchorNode?.parentElement?.closest<HTMLElement>('.feature-slide');
    const index = selection ? slides.indexOf(selection) : -1;
    if (index !== -1 && index !== current) go(index);
  });
  previous.forEach(button => button.addEventListener('click', () => go(current - 1)));
  next.forEach(button => button.addEventListener('click', () => go(current + 1)));
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
  const resize = new ResizeObserver(update);
  resize.observe(track);
  slides.forEach(slide => resize.observe(slide));
  controls.forEach(control => { control.hidden = false; });
  const hint = root.querySelector<HTMLElement>('[data-enhanced-hint]');
  if (hint?.dataset.enhancedHint) hint.textContent = hint.dataset.enhancedHint;
  const initial = slides.find(slide => '#' + slide.id === location.hash);
  if (initial) track.scrollTo({ left: offset(initial), behavior: 'instant' });
  update();
}
