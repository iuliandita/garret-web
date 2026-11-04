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
  let pending: number | null = null;
  const render = (fit: boolean): void => {
    previous.forEach(button => button.setAttribute('aria-disabled', String(current === 0)));
    next.forEach(button => button.setAttribute('aria-disabled', String(current === slides.length - 1)));
    counters.forEach(counter => { counter.textContent = `${current + 1}/${slides.length}`; });
    if (fit) {
      track.style.height = 'auto';
      const height = matchMedia('(min-width: 1101px)').matches
        ? Math.max(...slides.map(slide => slide.offsetHeight))
        : slides[current].offsetHeight;
      track.style.height = `${height + 16}px`;
    }
    slides.forEach((slide, index) => {
      slide.setAttribute('aria-hidden', String(index !== current));
      slide.querySelectorAll<HTMLAnchorElement>('[data-screenshot]').forEach(link => { link.tabIndex = index === current ? 0 : -1; });
    });
    links.forEach((link, index) => {
      if (index === current) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };
  const select = (index: number, fit = true): void => {
    if (index !== current) {
      current = index;
      announcement.textContent = `${status.dataset.positionLabel} ${current + 1} ${status.dataset.ofLabel} ${slides.length}`;
      history.replaceState(null, '', '#' + slides[current].id);
    }
    render(fit);
  };
  const update = (): void => {
    if (pending !== null) {
      if (Math.abs(offset(slides[pending]) - track.scrollLeft) > 2) return render(true);
      pending = null;
    }
    select(slides.reduce((nearest, slide, index) =>
      Math.abs(offset(slide) - track.scrollLeft) < Math.abs(offset(slides[nearest]) - track.scrollLeft) ? index : nearest, 0));
  };
  const reduced = (): boolean => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const go = (index: number, orient = false): void => {
    const target = Math.max(0, Math.min(slides.length - 1, index));
    const slide = slides[target];
    pending = target;
    select(target, reduced());
    track.scrollTo({ left: offset(slide), behavior: reduced() ? 'instant' : 'smooth' });
    if (!orient) return;
    const heading = slide.querySelector<HTMLElement>('.slide-heading h3');
    if (!heading) return;
    const top = heading.getBoundingClientRect().top;
    if (top < 0 || top > innerHeight) window.scrollTo({ top: scrollY + top - 24, behavior: reduced() ? 'auto' : 'smooth' });
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
  };
  let selecting = false;
  track.addEventListener('pointerdown', () => { selecting = true; pending = null; });
  track.addEventListener('wheel', () => { pending = null; }, { passive: true });
  document.addEventListener('pointerup', () => { selecting = false; });
  document.addEventListener('pointercancel', () => { selecting = false; });
  document.addEventListener('selectionchange', () => {
    if (selecting) return;
    const selection = document.getSelection()?.anchorNode?.parentElement?.closest<HTMLElement>('.feature-slide');
    const index = selection ? slides.indexOf(selection) : -1;
    if (index !== -1 && index !== current) go(index);
  });
  const bottom = (button: HTMLElement): boolean => button.closest('.browse-controls-bottom') !== null;
  const step = (button: HTMLElement, delta: number): void => {
    if (button.getAttribute('aria-disabled') === 'true') return;
    go(current + delta, bottom(button));
  };
  previous.forEach(button => button.addEventListener('click', () => step(button, -1)));
  next.forEach(button => button.addEventListener('click', () => step(button, 1)));
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
    settle = setTimeout(() => { pending = null; update(); }, 120);
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
