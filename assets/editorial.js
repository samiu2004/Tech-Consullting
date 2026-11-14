/* Homepage motion is optional; all links and content work without JavaScript. */
(() => {
  const home = document.querySelector('.editorial-home');
  if (!home) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motionButton = home.querySelector('.ed-motion-toggle');
  const art = home.querySelector('.ed-art');
  let paused = false;
  function setMotionState() {
    home.classList.toggle('ed-motion-paused', paused || reduced.matches);
    home.classList.toggle('ed-page-hidden', document.hidden);
    if (motionButton) {
      motionButton.setAttribute('aria-pressed', String(paused));
      motionButton.textContent = paused ? 'Resume motion' : 'Pause motion';
    }
  }
  motionButton?.addEventListener('click', () => { paused = !paused; setMotionState(); });
  document.addEventListener('visibilitychange', setMotionState);
  reduced.addEventListener('change', setMotionState);
  setMotionState();

  const reveals = home.querySelectorAll('.ed-reveal');
  if ('IntersectionObserver' in window && !reduced.matches) {
    home.classList.add('ed-motion-ready');
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: 0.08 });
    reveals.forEach(el => observer.observe(el));
    reduced.addEventListener('change', () => {
      if (reduced.matches) {
        home.classList.remove('ed-motion-ready');
        observer.disconnect();
      }
    });
  }

  const filters = home.querySelectorAll('[data-news-filter]');
  const rows = home.querySelectorAll('[data-news-category]');
  const count = home.querySelector('#ed-feed-count');
  filters.forEach(button => button.addEventListener('click', () => {
    const category = button.dataset.newsFilter;
    let shown = 0;
    rows.forEach(row => {
      const show = category === 'all' || row.dataset.newsCategory === category;
      row.hidden = !show;
      if (show) shown++;
    });
    filters.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    if (count) count.textContent = `${shown} ${shown === 1 ? 'story' : 'stories'}`;
  }));

  // Close the existing mobile menu after following an in-page destination.
  const nav = document.querySelector('#main-links');
  nav?.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    document.querySelector('.menu-toggle')?.setAttribute('aria-expanded', 'false');
  }));
})();
