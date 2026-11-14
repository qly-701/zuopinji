import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Expand, X } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MediaImage from './MediaImage';
import { scheduleScrollRefresh } from '../motion/refreshQueue';
import { softwareTools, softwareCategories } from '../softwareData';

gsap.registerPlugin(ScrollTrigger);

function SoftwareImageDialog({ tool, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    ref.current.showModal();
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; previousFocus?.focus(); };
  }, []);
  return <dialog ref={ref} className="software-dialog" aria-labelledby="software-dialog-title" onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) onClose(); }}><div className="software-dialog-header"><div><h3 id="software-dialog-title">{tool.name}</h3></div><button type="button" autoFocus className="icon-button" onClick={onClose} aria-label="关闭软件图片"><X size={21}/></button></div><MediaImage usage="full" src={tool.image} alt={tool.imageAlt} loading="eager"/><p>{tool.use}</p></dialog>;
}

export default function SoftwareToolkit({ ready, reducedMotion, onModalChange }) {
  const [category, setCategory] = useState('全部工具');
  const [selectedTool, setSelectedTool] = useState(null);
  useEffect(() => { onModalChange?.(!!selectedTool); return () => onModalChange?.(false); }, [selectedTool, onModalChange]);
  const root = useRef(null);
  const tools = softwareTools.filter(tool => category === '全部工具' || tool.category === category);

  useLayoutEffect(() => {
    if (!ready || reducedMotion) return;
    const context = gsap.context(() => {
      root.current.querySelectorAll('.software-card').forEach((card, index) => {
        gsap.fromTo(card.querySelector('.software-card-motion'),
          { y: 48, clipPath: 'inset(100% 0% 0% 0%)' },
          { y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, delay: index % 4 * 0.07,
            ease: 'power3.out', clearProps: 'transform,clipPath',
            scrollTrigger: { trigger: card, start: 'top 94%', once: true } });
      });
    }, root);
    const cancelRefresh = scheduleScrollRefresh();
    return () => { cancelRefresh(); context.revert(); };
  }, [category, ready, reducedMotion]);

  return <div ref={root} className="software-toolkit">
    <div className="software-heading"><div><span className="eyebrow">TOOLS IN PRACTICE</span><h3>从工具，到解决问题的方法。</h3></div><p>建模、分析、开发与表达，<br/>让不同工具在实践中相互连接。</p></div>
    <div className="software-toolbar"><div className="software-filters" aria-label="筛选软件能力">{softwareCategories.map(item => <button type="button" key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}<span>{String(item === '全部工具' ? softwareTools.length : softwareTools.filter(tool => tool.category === item).length).padStart(2, '0')}</span></button>)}</div><span className="software-count" aria-live="polite">{String(tools.length).padStart(2, '0')} TOOLS</span></div>
    <div className="software-grid">{tools.map(tool => <article className="software-card" key={tool.id}><div className="software-card-motion"><div className="software-visual"><MediaImage src={tool.image} sizes="(max-width: 760px) 45vw, (max-width: 1150px) 30vw, (min-width: 1800px) 409px, 23vw" alt={tool.imageAlt} loading="lazy" width={tool.imageWidth} height={tool.imageHeight}/><span>{tool.category}</span><button type="button" className="software-image-open" aria-label={`放大查看${tool.name}图片`} onClick={() => setSelectedTool(tool)}><span><Expand size={15}/></span></button></div><div className="software-content"><div className="software-title"><h4>{tool.name}</h4><span className="software-level">{tool.level}</span></div><p>{tool.use}</p></div></div></article>)}</div>
    {selectedTool && <SoftwareImageDialog tool={selectedTool} onClose={() => setSelectedTool(null)}/>}
  </div>;
}
