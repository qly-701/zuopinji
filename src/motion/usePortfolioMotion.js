import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scheduleScrollRefresh } from './refreshQueue';

gsap.registerPlugin(ScrollTrigger);
const OPEN = 'inset(0% 0% 0% 0%)';
const COVER = 'inset(100% 0% 0% 0%)';

function useMediaQuery(queryString) {
  const [matches, setMatches] = useState(() => window.matchMedia(queryString).matches);
  useEffect(() => {
    const query = window.matchMedia(queryString);
    const update = () => setMatches(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, [queryString]);
  return matches;
}

export function useReducedMotion() { return useMediaQuery('(prefers-reduced-motion: reduce)'); }

export function useHeroActivity(rootRef) {
  const [active, setActive] = useState(!document.hidden);
  useEffect(() => {
    const home = rootRef.current?.querySelector('#home');
    if(!home) return;
    let inView = true;
    const update = () => setActive(inView && !document.hidden);
    const observer = new IntersectionObserver(entries => { inView = entries.some(entry => entry.isIntersecting); update(); }, { rootMargin: '100px 0px' });
    observer.observe(home);
    document.addEventListener('visibilitychange', update);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); };
  }, [rootRef]);
  return active;
}

// Every tween/trigger belongs to a local context; there is no global kill or permanent ticker.
export function usePortfolioMotion({ rootRef, ready, filter, reducedMotion, onOpeningComplete }) {
  const openingFinished = useRef(false);
  const sectionIntros = useRef(new Map());
  const previousFilter = useRef(filter);
  const mobileLayout = useMediaQuery('(max-width: 760px)');

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (reducedMotion) {
      if (ready) { openingFinished.current = true; onOpeningComplete(); }
      return;
    }
    let cancelRefresh;
    const ctx = gsap.context(() => {
      const select = gsap.utils.selector(root);
      const prepareHero = () => {
        gsap.set(select('.hero-title-word'), { yPercent: 125, scaleX: 0.82, scaleY: 1.28, rotation: 3, transformOrigin: 'left bottom' });
        gsap.set(select('.hero-name-char'), { x: 38, rotation: -5, scaleX: 0.68, transformOrigin: 'left bottom' });
        gsap.set(select('.nav-inner'), { yPercent: -135, clipPath: 'inset(0% 0% 100% 0%)' });
        gsap.set(select('.hero-media'), { scale: 1.12, xPercent: 2, clipPath: 'inset(0% 0% 0% 25%)' });
        gsap.set(select('.hero-eyebrow,.hero-intro,.hero-description,.hero-content .button,.hero-content .hero-resume'), { y: 28, clipPath: COVER });
        gsap.set(select('.reel-enter-shell'), { yPercent: 108, scaleY: 0.82, rotation: 5, clipPath: COVER, transformOrigin: 'center bottom' });
        gsap.set(select('.reel-toolbar,.hero-film-credit,.background-control'), { y: 22, clipPath: COVER });
      };
      if (!ready) { prepareHero(); return; }

      const completeOpening = () => {
        openingFinished.current = true;
        root.dataset.opening = 'complete';
        onOpeningComplete();
      };
      const home = root.querySelector('#home');
      const visibleReel = select('.reel-enter-shell').filter(shell => { const rect = shell.getBoundingClientRect(); return rect.right >= 0 && rect.left <= window.innerWidth; });
      const hiddenReel = select('.reel-enter-shell').filter(shell => !visibleReel.includes(shell));
      if (!openingFinished.current && window.scrollY < (home?.offsetHeight || window.innerHeight) * 0.65) {
        prepareHero();
        gsap.set(hiddenReel, { clearProps: 'transform,clipPath' });
        root.dataset.opening = 'running';
        const intro = gsap.timeline({ defaults: { ease: 'power4.out' }, onComplete: completeOpening });
        intro.to(select('.hero-media'), { scale: 1, xPercent: 0, clipPath: OPEN, duration: 2.8, ease: 'power3.inOut', clearProps: 'transform,clipPath' }, 0)
          .to(select('.nav-inner'), { yPercent: 0, clipPath: OPEN, duration: 1.2, clearProps: 'transform,clipPath' }, 0.12)
          .to(select('.hero-eyebrow,.hero-intro'), { y: 0, clipPath: OPEN, duration: 1.1, stagger: 0.13, clearProps: 'transform,clipPath' }, 0.3)
          .to(select('.hero-title-word'), { yPercent: 0, scaleX: 1, scaleY: 1, rotation: 0, duration: 1.85, stagger: 0.3, ease: 'expo.out', clearProps: 'transform' }, 0.48)
          .to(select('.hero-name-char'), { x: 0, rotation: 0, scaleX: 1, duration: 1.65, stagger: 0.11, ease: 'expo.out', clearProps: 'transform' }, 0.55)
          .to(select('.hero-description'), { y: 0, clipPath: OPEN, duration: 1.25, clearProps: 'transform,clipPath' }, 1.15)
          .to(select('.hero-content .button,.hero-content .hero-resume'), { y: 0, clipPath: OPEN, duration: 1.15, stagger: 0.12, clearProps: 'transform,clipPath' }, 1.5)
          .to(visibleReel, { yPercent: 0, scaleY: 1, rotation: 0, clipPath: OPEN, duration: 1.5, stagger: index => (index % 6) * 0.13, clearProps: 'transform,clipPath' }, 1.7)
          .to(select('.reel-toolbar,.hero-film-credit,.background-control'), { y: 0, clipPath: OPEN, duration: 1, stagger: 0.1, clearProps: 'transform,clipPath' }, 2.35);
        ScrollTrigger.create({ trigger: home, start: 'bottom top', once: true, onEnter: () => intro.progress(1) });
      } else completeOpening();

      sectionIntros.current.clear();
      select('.content-region > section').forEach(section => {
        const masthead = section.querySelector('.section-masthead');
        if (!masthead) return;
        const words = masthead.querySelectorAll('.section-masthead-word');
        const timeline = gsap.timeline({
          defaults: { ease: 'power4.out' },
          scrollTrigger: { trigger: masthead, start: 'top 86%', once: true, invalidateOnRefresh: true },
        });
        sectionIntros.current.set(section.id, timeline);
        timeline.fromTo(words,
          { yPercent: 115, xPercent: -16, scaleX: 0.73, rotation: -3, transformOrigin: 'left bottom' },
          { yPercent: 0, xPercent: 0, scaleX: 1, rotation: 0, duration: 1.65, stagger: 0.12, ease: 'expo.out', clearProps: 'transform' }, 0)
          .fromTo(section.querySelector('.section-label'), { x: -30, clipPath: 'inset(0% 100% 0% 0%)' }, { x: 0, clipPath: OPEN, duration: 1.15, clearProps: 'transform,clipPath' }, 0.08);
        const heading = section.querySelector('.section-heading');
        if (heading) timeline.fromTo(heading.children, { y: 46, clipPath: COVER }, { y: 0, clipPath: OPEN, duration: 1.3, stagger: 0.14, clearProps: 'transform,clipPath' }, 0.55);
        if (section.id === 'expertise') {
          timeline.fromTo(section.querySelectorAll('.strength-card-motion'), { yPercent: 55, scaleY: 0.86, clipPath: COVER }, { yPercent: 0, scaleY: 1, clipPath: OPEN, duration: 1.5, stagger: 0.14, clearProps: 'transform,clipPath' }, 1.45);
          section.querySelectorAll('.achievement-entry').forEach((entry, index) => {
            gsap.fromTo(entry.querySelector('.achievement-entry-motion'),
              { y: 48, clipPath: COVER },
              { y: 0, clipPath: OPEN, duration: 1.3, delay: index % 4 * 0.08, ease: 'power4.out', clearProps: 'transform,clipPath',
                scrollTrigger: { trigger: entry, start: 'top 94%', once: true } });
          });
        }
        if (section.id === 'about') {
          timeline.fromTo(section.querySelector('.portrait-reveal'), { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: OPEN, duration: 1.65, clearProps: 'clipPath' }, 0.8)
            .fromTo(section.querySelector('.portrait-reveal img'), { scale: 1.16 }, { scale: 1, duration: 1.9, clearProps: 'transform' }, 0.8)
            .fromTo(section.querySelector('.about-brief'), { y: 60, clipPath: COVER }, { y: 0, clipPath: OPEN, duration: 1.5, clearProps: 'transform,clipPath' }, 0.9);
          const evaluation = section.querySelector('.self-evaluation');
          gsap.timeline({ scrollTrigger: { trigger: evaluation, start: 'top 88%', once: true } })
            .fromTo(evaluation.children, { y: 55, clipPath: COVER }, { y: 0, clipPath: OPEN, duration: 1.55, stagger: 0.18, ease: 'power4.out', clearProps: 'transform,clipPath' });
          section.querySelectorAll('.experience-entry').forEach((entry, index) => {
            gsap.fromTo(entry.querySelector('.experience-entry-motion'),
              { y: 48, clipPath: COVER },
              { y: 0, clipPath: OPEN, duration: 1.3, delay: index % 3 * 0.08, ease: 'power4.out', clearProps: 'transform,clipPath',
                scrollTrigger: { trigger: entry, start: 'top 94%', once: true } });
          });
        }
        if (section.id === 'contact') {
          timeline.fromTo(section.querySelector('.contact-topline'), { y: 32, clipPath: COVER }, { y: 0, clipPath: OPEN, duration: 1.2, clearProps: 'transform,clipPath' }, 0.65)
            .fromTo(section.querySelectorAll('.contact-title-word'), { yPercent: 120, scaleY: 0.8, skewY: 3, transformOrigin: 'left bottom' }, { yPercent: 0, scaleY: 1, skewY: 0, duration: 1.7, stagger: 0.16, ease: 'expo.out', clearProps: 'transform' }, 1.0)
            .fromTo(section.querySelector('.contact-circle-motion'), { rotation: 50, scale: 0.72 }, { rotation: 0, scale: 1, duration: 1.55, ease: 'expo.out', clearProps: 'transform' }, 1.25);
          const detailBlocks = section.querySelectorAll('.contact-details > *, .contact-links, footer');
          detailBlocks.forEach(block => gsap.fromTo(block, { y: 45, clipPath: COVER }, { y: 0, clipPath: OPEN, duration: 1.4, ease: 'power4.out', clearProps: 'transform,clipPath', scrollTrigger: { trigger: block, start: 'top 92%', once: true } }));
        }
      });
      cancelRefresh = scheduleScrollRefresh();
    }, root);
    return () => {
      cancelRefresh?.();
      ctx.revert();
      sectionIntros.current.clear();
      delete root.dataset.opening;
    };
  }, [rootRef, ready, reducedMotion, onOpeningComplete]);

  // Filtering replaces keyed cards: only rebuild this context, never replay the opening.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || !ready || reducedMotion) return;
    const changed = previousFilter.current !== filter;
    previousFilter.current = filter;
    let cancelRefresh;
    const ctx = gsap.context(() => {
      const cards = [...root.querySelectorAll('.project-card')];
      const columns = mobileLayout ? 1 : filter === '全部项目' ? 3 : 2;
      const allowParallax = !mobileLayout;
      cards.forEach((card, index) => {
        const shell = card.querySelector('.project-card-motion');
        const image = card.querySelector('.project-image-reveal');
        const plane = card.querySelector('.project-image-parallax');
        gsap.set(shell, { y: 85, scaleY: 0.94, clipPath: COVER, transformOrigin: 'center bottom' });
        gsap.set(image, { clipPath: 'inset(0% 0% 100% 0%)' });
        const reveal = gsap.timeline({ paused: true, defaults: { ease: 'power4.out' } })
          .to(shell, { y: 0, scaleY: 1, clipPath: OPEN, duration: 1.4, clearProps: 'transform,clipPath' }, 0)
          .to(image, { clipPath: OPEN, duration: 1.65, ease: 'power3.inOut', clearProps: 'clipPath' }, 0.1);
        ScrollTrigger.create({ trigger: card, start: 'top 92%', once: true, onEnter: () => {
          const heading = sectionIntros.current.get('projects');
          const remaining = !changed && heading?.isActive() ? Math.max(0, heading.duration() - heading.time() - 0.3) : 0;
          reveal.delay(remaining + (index % columns) * 0.13).play();
        } });
        if (allowParallax) gsap.fromTo(plane, { yPercent: -5, scale: 1.13 }, { yPercent: 5, scale: 1.13, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 1.1 } });
      });
      cancelRefresh = scheduleScrollRefresh();
    }, root);
    return () => {
      cancelRefresh?.();
      ctx.revert();
    };
  }, [rootRef, ready, filter, reducedMotion, mobileLayout]);
}
