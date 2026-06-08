/* =========================================================
   MAGOCLUB · entrance reveals
   - [data-reveal] / [data-reveal-stagger]: scroll-triggered via
     IntersectionObserver. Fires once per element.
   - [data-reveal-load]: fires shortly after page load (hero
     cascade).
   - [data-kenburns]: gentle hero-image zoom; triggered on load
     when in view, on scroll otherwise.
   - If IntersectionObserver is unavailable, fall back to
     revealing everything so content is never trapped invisible.
   ========================================================= */
(function () {
  'use strict';

  var SCROLL_SELECTOR = '[data-reveal], [data-reveal-stagger], [data-kenburns]';
  var LOAD_SELECTOR   = '[data-reveal-load]';

  function revealAll() {
    var nodes = document.querySelectorAll(SCROLL_SELECTOR + ', ' + LOAD_SELECTOR);
    for (var i = 0; i < nodes.length; i++) nodes[i].classList.add('is-visible');
  }

  function fireLoadReveals() {
    var nodes = document.querySelectorAll(LOAD_SELECTOR);
    // rAF + small timeout gives the browser one paint of the initial
    // (invisible) state before flipping — otherwise the transition
    // can be skipped and elements pop in.
    requestAnimationFrame(function () {
      setTimeout(function () {
        for (var i = 0; i < nodes.length; i++) nodes[i].classList.add('is-visible');
      }, 60);
    });
  }

  function wireObserver() {
    var nodes = document.querySelectorAll(SCROLL_SELECTOR);
    if (!nodes.length) return true;

    if (!('IntersectionObserver' in window)) {
      for (var i = 0; i < nodes.length; i++) nodes[i].classList.add('is-visible');
      return false;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -10% 0px'
    });

    for (var j = 0; j < nodes.length; j++) io.observe(nodes[j]);
    return true;
  }

  function start() {
    try {
      fireLoadReveals();
      wireObserver();
    } catch (err) {
      // If anything throws, don't leave content trapped invisible.
      console.error('reveal.js error, falling back to reveal-all:', err);
      revealAll();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
