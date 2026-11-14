import React, { memo, useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, Pause, Play } from 'lucide-react';
import { projects } from '../data';
import MediaImage from './MediaImage';

function PortfolioReel({ onOpen, modalOpen, reducedMotion }) {
  const trackRef = useRef(null);
  const cycleWidth = useRef(0);
  const viewportWidth = useRef(1);
  const hovered = useRef(false);
  const focused = useRef(false);
  const manualUntil = useRef(0);
  const controller = useRef({ stop() {}, resume() {} });
  const [moving, setMoving] = useState(!reducedMotion);
  useEffect(() => setMoving(!reducedMotion), [reducedMotion]);

  React.useLayoutEffect(() => {
    const track = trackRef.current;
    const group = track.querySelector('.reel-group');
    let frame = null;
    const measure = () => {
      frame = null;
      cycleWidth.current = group.getBoundingClientRect().width;
      viewportWidth.current = track.clientWidth || window.innerWidth || 1;
    };
    const queue = () => { if (frame === null) frame = requestAnimationFrame(measure); };
    measure();
    const observer = window.ResizeObserver ? new ResizeObserver(queue) : null;
    observer?.observe(group);
    observer?.observe(track);
    if (!observer) window.addEventListener('resize', queue, { passive: true });
    return () => { observer?.disconnect(); window.removeEventListener('resize', queue); if (frame !== null) cancelAnimationFrame(frame); };
  }, []);

  useEffect(() => {
    if (!moving || modalOpen) return;
    const track = trackRef.current;
    let frame = null, timer = null, previous = 0, position = track.scrollLeft;
    const stop = () => {
      if (frame !== null) cancelAnimationFrame(frame);
      if (timer !== null) clearTimeout(timer);
      frame = timer = null;
      previous = 0;
    };
    const blocked = () => hovered.current || focused.current || document.hidden;
    const animate = time => {
      frame = null;
      if (blocked()) return;
      const delta = previous ? Math.min(time - previous, 40) : 0;
      previous = time;
      if (cycleWidth.current > 0) {
        position = (position + delta * 0.045) % cycleWidth.current;
        track.scrollLeft = position;
      }
      frame = requestAnimationFrame(animate);
    };
    const resume = () => {
      stop();
      if (blocked()) return;
      const remaining = manualUntil.current - performance.now();
      if (remaining > 0) { timer = setTimeout(resume, remaining); return; }
      position = track.scrollLeft;
      frame = requestAnimationFrame(animate);
    };
    controller.current = { stop, resume };
    document.addEventListener('visibilitychange', resume);
    resume();
    return () => {
      stop();
      controller.current = { stop() {}, resume() {} };
      document.removeEventListener('visibilitychange', resume);
    };
  }, [moving, modalOpen]);

  useEffect(() => {
    const track = trackRef.current;
    let wheelFrame = null, pending = 0;
    const handleWheel = event => {
      if (event.ctrlKey || !cycleWidth.current) return;
      const factor = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? viewportWidth.current : 1;
      const delta = (Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY) * factor;
      if (!Number.isFinite(delta) || delta === 0) return;
      event.preventDefault();
      controller.current.stop();
      manualUntil.current = performance.now() + 4500;
      pending += delta;
      if (wheelFrame !== null) return;
      wheelFrame = requestAnimationFrame(() => {
        wheelFrame = null;
        const cycle = cycleWidth.current;
        if (cycle > 0) track.scrollLeft = ((track.scrollLeft + pending) % cycle + cycle) % cycle;
        pending = 0;
        controller.current.resume();
      });
    };
    track.addEventListener('wheel', handleWheel, { passive: false });
    return () => { track.removeEventListener('wheel', handleWheel); if (wheelFrame !== null) cancelAnimationFrame(wheelFrame); };
  }, []);

  const defer = () => { manualUntil.current = performance.now() + 4500; controller.current.resume(); };
  const nudge = value => {
    const track = trackRef.current;
    controller.current.stop();
    if (value < 0 && track.scrollLeft < 300 && cycleWidth.current) track.scrollLeft += cycleWidth.current;
    track.scrollBy({ left: value * 300, behavior: reducedMotion ? 'instant' : 'smooth' });
    defer();
  };
  return <div className="portfolio-reel"><div className="reel-track" ref={trackRef} tabIndex={0} role="region" aria-label="六个项目自动循环，支持鼠标滚轮前后浏览，点击查看详情"
    onMouseEnter={() => { hovered.current = true; controller.current.stop(); }}
    onMouseLeave={() => { hovered.current = false; controller.current.resume(); }}
    onFocusCapture={() => { focused.current = true; controller.current.stop(); }}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) { focused.current = false; controller.current.resume(); } }}
    onPointerDown={defer}
    onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); nudge(event.key === 'ArrowRight' ? 1 : -1); } }}>
    {[0,1,2,3].map(copy => <div className="reel-group" key={copy} aria-hidden={copy > 0 ? true : undefined}>{projects.map((project, index) => <div className="reel-enter-shell" key={project.id}><button className={`reel-card reel-${project.id}`} tabIndex={copy > 0 ? -1 : 0} onClick={() => onOpen({ ...project, initialPanel: 0 })} aria-label={`查看${project.title}详情`}><div className="reel-image"><MediaImage src={project.image} usage="thumb" alt={copy > 0 ? '' : project.imageAlt || project.title} loading={copy > 0 ? 'lazy' : 'eager'} fetchPriority={copy === 0 && index === 0 ? 'high' : 'auto'}/><span className="reel-number">0{index + 1}</span><span className="reel-open"><ArrowUpRight size={22}/></span>{project.visualLabel && <span className="reel-concept">{project.visualLabel}</span>}<div className="reel-caption"><h3>{project.title}</h3><p>{project.category}</p></div></div></button></div>)}</div>)}
  </div><div className="reel-toolbar container"><span>滚轮前后浏览 · 点击查看详情</span><div className="reel-controls"><button onClick={() => nudge(-1)} aria-label="上一组作品"><ArrowRight size={15} style={{ transform: 'rotate(180deg)' }}/></button><button onClick={() => nudge(1)} aria-label="下一组作品"><ArrowRight size={15}/></button><button onClick={() => setMoving(!moving)} aria-label={moving ? '暂停作品轮播' : '播放作品轮播'}>{moving ? <Pause size={13}/> : <Play size={13}/>}</button></div></div></div>;
}
export default memo(PortfolioReel);
