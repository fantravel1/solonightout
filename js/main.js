/* ============================================================
   SoloNightOut — Main JavaScript
   Handles: mobile nav, header scroll, animations, SoloScore counter
   ============================================================ */

(function () {
    'use strict';

    // ---- Mobile Navigation ----
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const navOverlay = document.getElementById('mobile-nav-overlay');
    const body = document.body;

    function openNav() {
        menuToggle.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
        navOverlay.classList.add('open');
        body.classList.add('nav-open');
    }

    function closeNav() {
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        navOverlay.classList.remove('open');
        body.classList.remove('nav-open');
    }

    if (menuToggle && navOverlay) {
        menuToggle.addEventListener('click', function () {
            const isOpen = navOverlay.classList.contains('open');
            if (isOpen) {
                closeNav();
            } else {
                openNav();
            }
        });

        // Close on link click
        navOverlay.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', closeNav);
        });

        // Close on Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navOverlay.classList.contains('open')) {
                closeNav();
                menuToggle.focus();
            }
        });
    }

    // ---- Header Scroll Behavior ----
    const header = document.getElementById('site-header');
    let lastScroll = 0;

    function handleHeaderScroll() {
        var scrollY = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = scrollY;
    }

    if (header) {
        window.addEventListener('scroll', handleHeaderScroll, { passive: true });
        handleHeaderScroll(); // Initial check
    }

    // ---- Scroll Fade-In Animations ----
    function initScrollAnimations() {
        // Elements to animate
        var animateSelectors = [
            '.reframe-card',
            '.factor-card',
            '.city-card',
            '.dining-card',
            '.mode-card',
            '.safety-card',
            '.safety-feature',
            '.space-card',
            '.route-card',
            '.validation-card',
            '.faq-item',
            '.oph-step',
            '.soloscore-demo',
            '.section-header',
            '.walks-text',
            '.walks-img-wrap',
            '.dining-quote',
            '.reframe-quote',
            '.cta-inner'
        ];

        var elements = document.querySelectorAll(animateSelectors.join(','));

        elements.forEach(function (el) {
            el.classList.add('fade-in-up');
        });

        // Use IntersectionObserver if available
        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(
                function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                            observer.unobserve(entry.target);
                        }
                    });
                },
                {
                    threshold: 0.1,
                    rootMargin: '0px 0px -40px 0px'
                }
            );

            elements.forEach(function (el) {
                observer.observe(el);
            });
        } else {
            // Fallback: show everything
            elements.forEach(function (el) {
                el.classList.add('visible');
            });
        }
    }

    // ---- SoloScore Counter Animation ----
    function initSoloScoreAnimation() {
        var scoreEl = document.querySelector('.soloscore-value');
        if (!scoreEl) return;

        var target = parseInt(scoreEl.getAttribute('data-target'), 10);
        if (isNaN(target)) return;

        var animated = false;

        function animateCount() {
            if (animated) return;
            animated = true;

            var start = 0;
            var duration = 1500;
            var startTime = null;

            function step(timestamp) {
                if (!startTime) startTime = timestamp;
                var progress = Math.min((timestamp - startTime) / duration, 1);
                // Ease out cubic
                var eased = 1 - Math.pow(1 - progress, 3);
                var current = Math.round(start + (target - start) * eased);
                scoreEl.textContent = current;
                if (progress < 1) {
                    requestAnimationFrame(step);
                }
            }

            requestAnimationFrame(step);
        }

        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(
                function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            animateCount();
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.5 }
            );
            observer.observe(scoreEl);
        } else {
            animateCount();
        }
    }

    // ---- Smooth Scroll for Anchor Links ----
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (link) {
            link.addEventListener('click', function (e) {
                var targetId = this.getAttribute('href');
                if (targetId === '#') return;

                var targetEl = document.querySelector(targetId);
                if (targetEl) {
                    e.preventDefault();
                    var headerHeight = header ? header.offsetHeight : 0;
                    var targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;

                    window.scrollTo({
                        top: targetPos,
                        behavior: 'smooth'
                    });

                    // Close mobile nav if open
                    closeNav();
                }
            });
        });
    }

    // ---- Stagger Animation Delays ----
    function applyStaggerDelays() {
        var groups = [
            '.soloscore-factors .factor-card',
            '.cities-grid .city-card',
            '.dining-grid .dining-card',
            '.modes-grid .mode-card',
            '.spaces-grid .space-card',
            '.validation-grid .validation-card'
        ];

        groups.forEach(function (selector) {
            var items = document.querySelectorAll(selector);
            items.forEach(function (item, index) {
                item.style.transitionDelay = (index * 80) + 'ms';
            });
        });
    }

    // ---- Initialize Everything ----
    function init() {
        initScrollAnimations();
        initSoloScoreAnimation();
        initSmoothScroll();
        applyStaggerDelays();
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
