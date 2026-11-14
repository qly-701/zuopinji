import { lazy, memo, Suspense, useEffect, useRef, useState } from 'react';
const ColorBends = lazy(() => import('./ColorBends/ColorBends'));
const COLORS = ['#c82d43', '#86263d', '#30415c'];

function DeferredBackground({ ready, active, reducedMotion }) {
  const ref = useRef(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    if (!ready || near) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        setNear(true);
        observer.disconnect();
      }
    }, { rootMargin: '240px 0px' });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ready, near]);
  return <div className="content-background" aria-hidden="true"><div ref={ref} className="content-background-sticky">{near && <Suspense fallback={null}><ColorBends colors={COLORS} rotation={35} speed={0.12} scale={1.1} frequency={1.1} warpStrength={1} mouseInfluence={0} parallax={0} noise={0.025} intensity={0.9} transparent={false} active={active} reducedMotion={reducedMotion} maxFps={30} maxDpr={1}/></Suspense>}</div></div>;
}
export default memo(DeferredBackground);
