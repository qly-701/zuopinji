import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

function LoadingCount({ value, onReady }) {
  const node = useRef(null);
  const counter = useRef({ value: 0 });
  useLayoutEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tween = gsap.to(counter.current, {
      value, duration: reduced ? 0 : 0.4, ease: 'power3.out',
      onUpdate: () => { if (node.current) node.current.textContent = String(Math.round(counter.current.value)); },
      onComplete: () => { if (value === 100) onReady(); },
    });
    return () => tween.kill();
  }, [value, onReady]);
  return <span ref={node}>0</span>;
}

export default function BootLoader({ images, onComplete }) {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const completeRef = useRef(onComplete);
  const exiting = useRef(false);
  const exitTimer = useRef(null);
  completeRef.current = onComplete;

  const enter = useCallback(() => {
    if (exiting.current) return;
    exiting.current = true;
    setLeaving(true);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    exitTimer.current = setTimeout(() => completeRef.current(), reduced ? 0 : 650);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    let cancelled = false;
    let completed = 0;
    const sources = [...new Set(images)];
    const advance = () => {
      if (cancelled || exiting.current) return;
      completed += 1;
      setProgress(Math.round(completed / sources.length * 100));
    };
    const preloads = sources.map(src => {
      const img = new Image();
      img.onload = img.onerror = advance;
      img.src = src;
      return img;
    });
    if (!sources.length) setProgress(100);
    // Fonts and video enhance the page after entry, without gating its content.
    const deadline = setTimeout(enter, 1500);
    return () => {
      cancelled = true;
      clearTimeout(deadline);
      clearTimeout(exitTimer.current);
      preloads.forEach(img => { img.onload = null; img.onerror = null; });
      document.body.style.overflow = previousOverflow;
    };
  }, [enter, images]);

  return <div className={`boot-loader${leaving ? ' is-leaving' : ''}`}>
    <div className="boot-masthead"><span>瞿林毅</span><span>工业设计工程硕士在读 · 车辆工程本科</span></div>
    <div className="boot-center" role="progressbar" aria-label="作品集加载进度" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
      <span className="boot-eyebrow">DESIGN / ENGINEERING / EXPLORATION</span>
      <div className="boot-counter" aria-hidden="true"><LoadingCount value={progress} onReady={enter}/><span className="boot-percent">%</span></div>
      <div className="boot-track"><span style={{ transform: `scaleX(${progress / 100})` }}/></div>
      <p role="status">{progress === 100 ? '准备就绪，即将进入' : '正在准备作品集'}</p>
    </div>
    <div className="boot-bottom"><span>PRECISION IN EVERY DETAIL</span><button className="skip-loader" onClick={enter}>直接进入 <span aria-hidden="true">↗</span></button></div>
  </div>;
}
