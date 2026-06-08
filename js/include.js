/* =========================================================
   MAGOCLUB · partials include + chrome behavior
   - Replaces [data-include="..."] elements with fetched HTML
   - Substitutes {{ROOT}} based on <html data-root="...">
   - Sets active nav state from <body data-page="...">
   - Wires up mobile drawer + Pillars dropdown
   ========================================================= */
(function () {
  'use strict';

  var root = document.documentElement.getAttribute('data-root') || '';
  var page = document.body && document.body.getAttribute('data-page');

  // Pillar pages should also show "The Pillars" parent as active
  var pillarPages = ['body', 'skill', 'mind', 'connection'];

  function injectPartial(el) {
    var src = el.getAttribute('data-include');
    return fetch(src)
      .then(function (r) {
        if (!r.ok) throw new Error('Failed to load ' + src + ' (' + r.status + ')');
        return r.text();
      })
      .then(function (html) {
        // Substitute {{ROOT}} with the page's relative root
        var resolved = html.replace(/\{\{ROOT\}\}/g, root);
        // Use a temporary container so we can return real DOM nodes
        var tmp = document.createElement('div');
        tmp.innerHTML = resolved;
        // Replace the placeholder with its children
        var parent = el.parentNode;
        while (tmp.firstChild) {
          parent.insertBefore(tmp.firstChild, el);
        }
        parent.removeChild(el);
      })
      .catch(function (err) {
        console.error(err);
        el.innerHTML = '<!-- include failed: ' + src + ' -->';
      });
  }

  function setActiveNav() {
    if (!page) return;
    // Mark the matching primary link
    var link = document.querySelector('[data-nav="' + page + '"]');
    if (link) link.setAttribute('aria-current', 'page');
    // For pillar pages, also mark the parent dropdown trigger
    if (pillarPages.indexOf(page) !== -1) {
      var parent = document.querySelector('[data-nav-parent="pillars"]');
      if (parent) parent.setAttribute('data-active', 'true');
    }
  }

  function wireDrawer() {
    var nav = document.querySelector('.site-nav');
    if (!nav) return;
    var toggle = nav.querySelector('.nav-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    // Close the drawer when a link inside it is tapped (not the dropdown button).
    nav.addEventListener('click', function (e) {
      if (!nav.classList.contains('is-open')) return;
      var link = e.target.closest && e.target.closest('a');
      if (!link) return;
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
    });
  }

  function wireDropdown() {
    var btn = document.querySelector('.has-dropdown > button');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
    document.addEventListener('click', function (e) {
      if (!btn.parentElement.contains(e.target)) {
        btn.setAttribute('aria-expanded', 'false');
      }
    });
    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') btn.setAttribute('aria-expanded', 'false');
    });
  }

  // Run on DOM ready, then chrome behaviors AFTER includes resolve
  function start() {
    var includes = Array.prototype.slice.call(
      document.querySelectorAll('[data-include]')
    );
    var jobs = includes.map(injectPartial);
    Promise.all(jobs).then(function () {
      setActiveNav();
      wireDrawer();
      wireDropdown();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
