(() => {
  const header = document.querySelector('.header');
  const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  updateHeader();
  window.addEventListener('scroll', updateHeader, {passive: true});
  window.addEventListener('pageshow', updateHeader);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduced && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js-motion');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {entry.target.classList.add('visible');observer.unobserve(entry.target);}
    }), {threshold: 0.08});
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const track = document.querySelector('.hero-scroll');
  const hero = track.querySelector('.hero');
  const title = hero.querySelector('h1');
  // Keep a single accessible heading while animating its visual characters.
  title.setAttribute('aria-label', title.textContent);
  const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);
  const letters = [];
  textNodes.forEach(node => {
    const fragment = document.createDocumentFragment();
    Array.from(node.textContent).forEach(character => {
      const span = document.createElement('span');
      span.className = 'hero-letter';
      span.textContent = character;
      span.setAttribute('aria-hidden', 'true');
      letters.push(span);
      fragment.appendChild(span);
    });
    node.replaceWith(fragment);
  });
  const fades = [
    ...Array.from(hero.querySelectorAll('.hero-topline, .hero-copy > .eyebrow, .hero-note, .round-link, .hero-bottom, .hero-word'))
      .map((element, index) => ({element, start: 0.03 + index * 0.025, end: 0.63 + index * 0.04})),
    ...letters.map((element, index) => ({element, start: 0.08 + index / Math.max(1, letters.length - 1) * 0.25, end: 0.6 + index / Math.max(1, letters.length - 1) * 0.28}))
  ];
  const clamp = value => Math.min(1, Math.max(0, value));
  let distance = 1;
  let pinOffset = 0;
  let trackTop = 0;
  let frame = 0;
  let previousProgress = -1;
  function paintHero() {
    frame = 0;
    if (motionPreference.matches) return;
    const progress = clamp((window.scrollY - trackTop - pinOffset) / distance);
    if (progress === previousProgress) return;
    previousProgress = progress;
    fades.forEach(({element, start, end}) => {
      const amount = clamp((progress - start) / (end - start));
      const eased = amount * amount * (3 - 2 * amount);
      element.style.opacity = String(1 - eased);
      element.style.transform = `translate3d(${eased * 10}px, ${-eased * 18}px, 0)`;
      element.style.filter = eased > 0 && eased < 1 ? `blur(${eased * 5}px)` : 'none';
      element.style.visibility = amount === 1 ? 'hidden' : '';
    });
  }
  function measureHero() {
    document.documentElement.classList.toggle('hero-scroll-enabled', !motionPreference.matches);
    previousProgress = -1;
    if (motionPreference.matches) {
      fades.forEach(({element}) => ['opacity','transform','filter','visibility'].forEach(property => element.style.removeProperty(property)));
      return;
    }
    // Tall mobile heroes scroll into full view before their lower edge is pinned.
    const viewport = document.documentElement.clientHeight;
    const height = hero.offsetHeight;
    pinOffset = Math.max(0, height - viewport);
    distance = Math.max(480, viewport * 0.95);
    trackTop = track.getBoundingClientRect().top + window.scrollY;
    track.style.setProperty('--hero-track-height', `${height + distance}px`);
    track.style.setProperty('--hero-pin-top', `${-pinOffset}px`);
    paintHero();
  }
  window.addEventListener('scroll', () => {
    if (!frame && !motionPreference.matches) frame = requestAnimationFrame(paintHero);
  }, {passive: true});
  window.addEventListener('resize', measureHero);
  window.addEventListener('pageshow', measureHero);
  motionPreference.addEventListener('change', measureHero);
  measureHero();
  if (document.fonts) document.fonts.ready.then(measureHero);

  function openDetail(hash) {
    const el = document.getElementById(hash.slice(1));
    if (el && el.tagName === 'DETAILS') el.open = true;
  }
  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', () => openDetail(a.hash)));
  window.addEventListener('hashchange', () => openDetail(location.hash));
  openDetail(location.hash);
})();
