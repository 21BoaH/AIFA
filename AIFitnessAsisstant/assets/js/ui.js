/* ============================================================================
   Shared UI behaviour: mobile navigation + scroll reveal.
   Progressive enhancement — every page is fully readable and navigable
   without this file. It only upgrades what is already there.
   ========================================================================== */
(function () {
    'use strict';

    var MOBILE_QUERY = '(max-width: 900px)';

    /* ---------------------------------------------------- Mobile navigation */
    function initNav() {
        var toggle = document.querySelector('.nav__toggle');
        var links = document.getElementById('nav-links');
        if (!toggle || !links) return;

        var mq = window.matchMedia(MOBILE_QUERY);

        function open() {
            links.hidden = false;
            toggle.setAttribute('aria-expanded', 'true');
        }

        function close(returnFocus) {
            links.hidden = true;
            toggle.setAttribute('aria-expanded', 'false');
            if (returnFocus) toggle.focus();
        }

        // On wide viewports the links are always visible and the toggle is
        // hidden, so `hidden` must be cleared or the nav would vanish.
        function syncToViewport() {
            if (mq.matches) {
                if (toggle.getAttribute('aria-expanded') !== 'true') links.hidden = true;
            } else {
                links.hidden = false;
                toggle.setAttribute('aria-expanded', 'false');
            }
        }

        toggle.addEventListener('click', function () {
            if (toggle.getAttribute('aria-expanded') === 'true') close(false);
            else open();
        });

        // Escape closes the drawer and hands focus back to the trigger.
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
                close(true);
            }
        });

        // A tap outside the drawer dismisses it.
        document.addEventListener('click', function (e) {
            if (!mq.matches) return;
            if (toggle.getAttribute('aria-expanded') !== 'true') return;
            if (links.contains(e.target) || toggle.contains(e.target)) return;
            close(false);
        });

        // Following a link inside the drawer should close it.
        links.addEventListener('click', function (e) {
            if (mq.matches && e.target.closest('a')) close(false);
        });

        if (mq.addEventListener) mq.addEventListener('change', syncToViewport);
        else if (mq.addListener) mq.addListener(syncToViewport);

        syncToViewport();
    }

    /* ---------------------------------------------- Mark the current page */
    function markCurrentPage() {
        var here = window.location.pathname.split('/').pop() || 'index.html';
        var links = document.querySelectorAll('.nav__link');
        for (var i = 0; i < links.length; i++) {
            var href = (links[i].getAttribute('href') || '').split('/').pop().split('#')[0];
            if (href && href === here) links[i].setAttribute('aria-current', 'page');
        }
    }

    /* ------------------------------------------------------- Scroll reveal */
    function initReveal() {
        var items = document.querySelectorAll('.reveal');
        if (!items.length) return;

        var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
        // No IntersectionObserver, or the user asked for less motion:
        // show everything immediately rather than animating.
        if (reduced.matches || !('IntersectionObserver' in window)) {
            for (var i = 0; i < items.length; i++) items[i].classList.add('is-visible');
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);   // reveal once, then stop watching
            });
        }, { rootMargin: '0px 0px -80px 0px', threshold: 0.05 });

        for (var j = 0; j < items.length; j++) observer.observe(items[j]);
    }

    function init() {
        initNav();
        markCurrentPage();
        initReveal();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
