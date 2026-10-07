export function initPageContents(): void {
  document.querySelectorAll<HTMLDetailsElement>('[data-page-contents]').forEach(contents => {
    const narrow = matchMedia('(max-width: 750px)');
    const resize = (): void => { contents.open = !narrow.matches; };
    resize();
    narrow.addEventListener('change', resize);
    const sections = [...contents.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')]
      .flatMap(link => {
        const section = document.getElementById(link.hash.slice(1));
        return section ? [{ link, section }] : [];
      });
    let queued = false;
    const update = (): void => {
      queued = false;
      const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      const current = atBottom ? sections.at(-1) : sections.reduce((active, entry) =>
        entry.section.getBoundingClientRect().top <= innerHeight * .25 ? entry : active, sections[0]);
      sections.forEach(entry => {
        if (entry === current) entry.link.setAttribute('aria-current', 'location');
        else entry.link.removeAttribute('aria-current');
      });
    };
    const schedule = (): void => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
  });
}
