import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, ArrowDown, ArrowRight, Copy, Check, X, Plus, Minus, Pause, Play, Menu, Box, Layers3, ScanLine, Workflow, MapPin, Globe2 } from 'lucide-react';
import { profile, projects, strengths, selfEvaluation, experience } from './data';
import BootLoader from './components/BootLoader';
import MediaImage, { mediaSource } from './components/MediaImage';
import PortfolioReel from './components/PortfolioReel';
import DeferredBackground from './components/DeferredBackground';
import SoftwareToolkit from './components/SoftwareToolkit';
import AcademicAchievements from './components/AcademicAchievements';
import ExperienceTimeline from './components/ExperienceTimeline';
import { usePortfolioMotion, useReducedMotion, useHeroActivity } from './motion/usePortfolioMotion';
import './styles.css';

const HERO_POSTER = mediaSource('/assets/interstellar.jpg');
const HERO_VIDEO = mediaSource('/assets/interstellar-loop.mp4', 'src');
const BOOT_IMAGES = [HERO_POSTER];
const icons = { box: Box, layers: Layers3, scan: ScanLine, workflow: Workflow, language: Globe2 };
const navItems = [{ id: 'projects', label: '精选作品' }, { id: 'expertise', label: '综合能力' }, { id: 'about', label: '关于我' }];

function SectionLabel({ number, children }) { return <div className="section-label"><span className="cross">+</span><span>{number} / {children}</span></div>; }

function SectionMasthead({ words }) {
  return <div className="section-masthead" aria-hidden="true">{words.map(word=><span className="section-masthead-word" key={word}>{word}</span>)}</div>;
}

const studyPanels = [
  { title: '机构原理', image: 'principle', heading: '一个动力输入，多关爪同步运动。', text: '霍伯曼连杆机构通过中心盘与放射式连杆传递运动，实现爪径收缩与多点同步夹持。' },
  { title: '装配与细节', image: 'assembly', heading: '让装配关系清晰可见。', text: '从正视、俯视到爆炸与局部细节，展示连杆、支撑、传动与爪夹之间的结构关系。' },
  { title: '工程图纸', image: 'drawings', heading: '从模型走向工程表达。', text: '通过机构简图与装配图，表达关键连接与整体结构。' },
  { title: '结构分析', image: 'analysis', heading: '以仿真辅助结构判断。', text: '使用 ANSYS 分析关键构件，呈现应力与变形分布。' },
  { title: '柔性爪夹', image: 'soft-grip', heading: '刚性承载，柔性接触。', text: '刚性主体负责传力，柔性接触层用于缓冲与防滑；结合可拆卸接触面，探索对不同负载的适应。' },
];
function DroneStudy({ initialPanel = 0 }) {
  const [index, setIndex] = useState(initialPanel);
  const panel = studyPanels[index];
  return <article className="drone-study"><div className="study-header"><div><span className="eyebrow">FEATURED CASE / DESIGN PROCESS</span><h3>低空物流无人机抓取结构</h3><p>低空物流抓取机构 · 从运动原理到结构验证</p></div></div><div className="case-pillars"><div><span>01 / MECHANISM</span><strong>霍伯曼连杆</strong><p>放射式展开与收缩</p></div><div><span>02 / DRIVE</span><strong>单动力同步</strong><p>多点夹持的运动协同</p></div><div><span>03 / CONTACT</span><strong>刚柔结合</strong><p>承载与接触分工设计</p></div><div><span>04 / OUTCOME</span><strong>9.2% 减重</strong><p>抓取结构优化成果</p></div></div><div className="study-tabs" aria-label="浏览无人机设计过程">{studyPanels.map((item,i)=><button key={item.image} aria-pressed={i===index} onClick={()=>setIndex(i)}><span>0{i+1}</span>{item.title}</button>)}</div><figure className="study-figure"><MediaImage usage="full" src={`/assets/drone/${panel.image}.jpg`} alt={`无人机抓取结构项目原稿：${panel.title}`} loading="lazy"/><figcaption><strong>{panel.heading}</strong><p>{panel.text}</p><span>{String(index+1).padStart(2,'0')} / 05</span></figcaption></figure></article>;
}

const robotPanels = [
  { title: '整机设计', image: 'cover', text: '第二版整机前侧视图，展示更新后的机头外形、交互界面和货箱组合。' },
  { title: '后侧与侧视', image: 'rear', text: '从后侧观察货箱与底盘的相对位置，以及整体色彩和外观分区。' },
  { title: '载台方案', image: 'platform', text: '第二版开放载台状态，展示机头、载台与底盘的整体关系。' },
  { title: '底盘与支撑', image: 'chassis', text: '移除货箱后的底盘与支撑面展示，便于观察载台布局。' },
  { title: '货箱设计', image: 'cargo', text: '第二版货箱单独展示，观察外部包覆、底部空间与侧面造型。' },
];
function RobotStudy({ initialPanel = 0 }) {
  const [index, setIndex] = useState(initialPanel);
  const panel = robotPanels[index];
  return <article className="drone-study robot-study"><div className="study-header"><div><span className="eyebrow">设计迭代 / 中车四方配送机器人</span><h3>从初版构想到第二版改造</h3><p>车体、载台与货箱的设计演进。</p></div></div><div className="robot-evolution"><div><span>01 / 初版设计</span><h4>一体式车体 · 开放载台</h4><p>高位交互机头连接后部开放载台，前部灯带与底部轮组形成明确的整机识别。</p></div><ArrowRight size={25}/><div><span>02 / 第二版改造</span><h4>整机更新 · 载台与货箱分项设计</h4><p>围绕整机外观继续迭代，分别展示开放载台、底盘支撑与货箱，使各部分的设计关系更清晰。</p></div></div><div className="study-tabs" aria-label="浏览机器人第二版设计">{robotPanels.map((item,i)=><button key={item.image} aria-pressed={i===index} onClick={()=>setIndex(i)}><span>0{i+1}</span>{item.title}</button>)}</div><figure className="study-figure"><MediaImage usage="full" src={`/assets/robot/${panel.image}.jpg`} alt={`中车四方配送机器人第二版：${panel.title}`} loading="lazy"/><figcaption><strong>{panel.title}</strong><p>{panel.text}</p><span>{String(index+1).padStart(2,'0')} / 05</span></figcaption></figure><div className="robot-result"><strong>6% <span>底盘整体减重</span></strong><p>参与驱动轮、从动轮布局及加强筋优化。<br/>项目后期已投入使用。</p></div></article>;
}
function AdditionalStudy({ project }) {
  const [index, setIndex] = useState(project.initialPanel || 0);
  const panel = project.gallery[index];
  return <article className="drone-study additional-study"><div className="study-header"><div><span className="eyebrow">DESIGN DEVELOPMENT</span><h3>设计过程与细节</h3></div></div><div className="study-tabs" aria-label={`浏览${project.title}设计过程`}>{project.gallery.map((item,i)=><button key={item.image} aria-pressed={i===index} onClick={()=>setIndex(i)}><span>{String(i+1).padStart(2,'0')}</span>{item.title}</button>)}</div><figure className="study-figure"><MediaImage usage="full" src={panel.image} alt={`${project.title}作品集原稿：${panel.title}`} loading="lazy"/><figcaption><strong>{panel.title}</strong><p>{panel.note}</p><span>{String(index+1).padStart(2,'0')} / {String(project.gallery.length).padStart(2,'0')}</span></figcaption></figure></article>;
}

function ProjectStudy({ project }) { if (project.gallery) return <AdditionalStudy project={project}/>; return project.study === 'robot' ? <RobotStudy initialPanel={project.initialPanel || 0}/> : <DroneStudy initialPanel={project.initialPanel || 0}/>; }

function ProjectDialog({ project, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    ref.current.showModal();
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; previous?.focus(); };
  }, []);
  return <dialog ref={ref} className="project-dialog" aria-labelledby="project-title" onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <button autoFocus className="dialog-close icon-button" aria-label="关闭项目详情" onClick={onClose}><X size={22}/></button>
    <div className="dialog-image"><MediaImage usage="full" src={project.image} alt={project.imageAlt || `${project.title}${project.authentic ? "项目渲染" : "概念示意渲染"}`}/>{!project.authentic && <span className="visual-caption">{project.visualLabel || '概念示意'}</span>}</div>
    <div className="dialog-content"><div className="eyebrow">PROJECT {project.id} / {project.english}</div><h2 id="project-title">{project.title}</h2><p className="dialog-context">{project.context}</p>
      <div className="dialog-facts"><div><span>项目角色</span><strong>{project.role}</strong></div><div><span>设计方向</span><strong>{project.category}</strong></div></div>
      <h3>{project.gallery ? '设计内容' : '我的参与'}</h3><ul>{project.tasks.map(t=><li key={t}>{t}</li>)}</ul>
      <div className="outcome"><span>项目成果 / OUTCOME</span><p>{project.outcome}</p></div>
      {(project.study || project.gallery) ? <ProjectStudy project={project}/> : null}
    </div>
  </dialog>;
}

const CinemaBackground = React.memo(function CinemaBackground({ modalOpen, reducedMotion, ready }) {
  const ref = useRef(null);
  const connection = navigator.connection;
  const constrained = () => !!connection?.saveData || ['slow-2g', '2g'].includes(connection?.effectiveType);
  const [playing, setPlaying] = useState(() => !reducedMotion && !constrained());
  const [activated, setActivated] = useState(false);
  useEffect(() => {
    const update = () => setPlaying(!reducedMotion && !constrained());
    update();
    connection?.addEventListener?.('change', update);
    return () => connection?.removeEventListener?.('change', update);
  }, [reducedMotion, connection]);
  const shouldPlay = ready && playing && !modalOpen;
  useEffect(() => { if (shouldPlay) setActivated(true); }, [shouldPlay]);
  useEffect(() => {
    const video = ref.current;
    if (activated && shouldPlay) video?.play().catch(() => setPlaying(false));
    else video?.pause();
  }, [activated, shouldPlay]);
  return <><div className="hero-media" aria-hidden="true"><video ref={ref} src={activated ? HERO_VIDEO : undefined} autoPlay={activated && shouldPlay} loop muted playsInline preload={activated ? 'metadata' : 'none'} poster={HERO_POSTER}/></div><button className="background-control" onClick={() => setPlaying(!playing)} aria-label={playing ? '暂停背景视频' : '播放背景视频'}>{playing ? <Pause size={12}/> : <Play size={12}/>}<span>动态背景</span></button></>;
});

const MemoSoftwareToolkit = React.memo(SoftwareToolkit);
const MemoAcademicAchievements = React.memo(AcademicAchievements);
const MemoExperienceTimeline = React.memo(ExperienceTimeline);

function App() {
  const [bootReady, setBootReady] = useState(false);
  const [openingDone, setOpeningDone] = useState(false);
  const siteRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const heroActive = useHeroActivity(siteRef);
  const finishOpening = React.useCallback(() => setOpeningDone(true), []);
  const [active, setActive] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState('全部项目');
  const [selected, setSelected] = useState(null);
  const [softwareModalOpen, setSoftwareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const copyTimer = useRef(null);
  usePortfolioMotion({ rootRef: siteRef, ready: bootReady, filter, reducedMotion, onOpeningComplete: finishOpening });
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting) setActive(e.target.id); }), { rootMargin: '-20% 0px -45% 0px' });
    document.querySelectorAll('main section[id]').forEach(el => observer.observe(el));
    return () => { observer.disconnect(); clearTimeout(copyTimer.current); };
  }, []);
  useEffect(() => { if (!menuOpen) return; const close = e => { if(e.key === 'Escape') setMenuOpen(false); }; window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close); }, [menuOpen]);
  const copyEmail = async () => {
    try { clearTimeout(copyTimer.current); await navigator.clipboard.writeText(profile.email); setCopied(true); setCopyError(false); copyTimer.current = setTimeout(()=>setCopied(false), 2500); }
    catch { setCopyError(true); }
  };
  return <>
    {!bootReady && <BootLoader images={BOOT_IMAGES} onComplete={() => setBootReady(true)}/>}
    <div ref={siteRef} className="site-shell" inert={!bootReady ? true : undefined}>
    <a className="skip-link" href="#projects">跳转到精选作品</a>
    <header className="header"><div className="container nav-inner">
      <a href="#home" className="brand" aria-label="瞿林毅 首页"><span className="monogram">q<span>l</span>y<span className="brand-dot">.</span></span><span className="brand-name">瞿林毅<span>工业设计工程 × 车辆工程</span></span></a>
      <nav className={menuOpen ? 'nav open' : 'nav'} aria-label="主导航">{navItems.map((n,i)=><a key={n.id} href={`#${n.id}`} className={active === n.id ? 'active' : ''} onClick={()=>setMenuOpen(false)}><span>0{i+1}</span>{n.label}</a>)}</nav>
      <a className="nav-contact" href="#contact" onClick={()=>setMenuOpen(false)}>聊聊新机会 <ArrowUpRight size={16}/></a>
      <button className="menu-toggle icon-button" aria-label={menuOpen ? '关闭菜单' : '打开菜单'} aria-expanded={menuOpen} onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button>
    </div></header>
    <main>
      <section id="home" className="hero hero-cinema">
        <CinemaBackground ready={bootReady} modalOpen={!!selected || !bootReady || !heroActive} reducedMotion={reducedMotion}/><div className="hero-shade"/><div className="science-overlay" aria-hidden="true"><div className="orbital-ring" style={{ animationPlayState: bootReady && heroActive && !selected ? 'running' : 'paused' }}><i/><i/></div><div className="science-coordinate">设计 / 工程 / 探索<span>PRECISION IN EVERY DETAIL</span></div><span className="science-cross">+</span></div>
        <div className="container hero-layout"><div className="hero-content"><div className="eyebrow hero-eyebrow"><span className="status-dot"/>工业设计工程 × 车辆工程</div><p className="hero-intro">设计思维 · 工程基础 · 持续学习</p><h1 aria-label="瞿林毅，个人作品集"><span className="hero-title-line" aria-hidden="true"><span className="hero-title-word hero-accent">{Array.from(profile.name).map((char,i)=><span className="hero-name-char" key={i}>{char}</span>)}</span></span><span className="hero-title-line" aria-hidden="true"><span className="hero-portfolio-title hero-title-word">个人作品集</span></span></h1><p className="hero-description">工业设计工程硕士在读 · 车辆工程本科<br/>连接设计思维、工程基础与数字化应用。</p><a href="#projects" className="button button-primary">浏览全部项目 <ArrowDown size={17}/></a></div></div>
        <PortfolioReel onOpen={setSelected} modalOpen={!!selected || !bootReady || !openingDone || !heroActive} reducedMotion={reducedMotion}/>
        <div className="hero-film-credit"><a href="https://www.legendary.com/film/interstellar/" target="_blank" rel="noreferrer">《星际穿越》 · Legendary</a><span>QU LINYI · DESIGN PORTFOLIO</span></div>
      </section>

      <div className="content-region">
        <DeferredBackground ready={bootReady && (openingDone || !heroActive)} active={bootReady && !selected && !softwareModalOpen} reducedMotion={reducedMotion}/>
      <div className="specialties"><div className="container"><span>DESIGNED WITH PURPOSE</span><p>产品设计 <Plus/> 工程实践 <Plus/> 数据分析 <Plus/> 视觉表达</p><span className="specialty-end">IDEA → REALITY <ArrowUpRight size={16}/></span></div></div>

      <section id="projects" className="section projects"><div className="container"><SectionLabel number="01">SELECTED WORK</SectionLabel><SectionMasthead words={['SELECTED','WORK']}/><div className="section-heading"><h2>以多元视角，<span>回应真实需求。</span></h2><p className="section-description">从工程项目到产品与交互方案，<br/>以实践连接设计思考与技术表达。</p></div>
        <div className="project-toolbar"><div className="filters" aria-label="筛选项目">{['全部项目','机构设计','机器人设计','产品设计','工程结构'].map(f=><button key={f} className={filter === f ? 'selected' : ''} onClick={()=>setFilter(f)} aria-pressed={filter === f}>{f}{f === '全部项目' && <sup>{String(projects.length).padStart(2,'0')}</sup>}</button>)}</div><span className="project-count">{String(projects.filter(p=>filter === '全部项目' || p.category === filter).length).padStart(2,'0')} PROJECTS</span></div>
        <div className={`project-grid ${filter !== '全部项目' ? 'filtered' : ''}`}>{projects.filter(p=>filter === '全部项目' || p.category === filter).map(p=><React.Fragment key={p.id}><button className={`project-card project-${p.id} ${p.study ? "has-study" : ""}`} onClick={()=>setSelected(p)} aria-label={`查看${p.title}项目详情`}><div className="project-card-motion"><div className="project-image"><div className="project-image-reveal"><div className="project-image-parallax"><MediaImage layout={filter === '全部项目' ? 'card' : 'filteredCard'} src={p.image} alt={p.imageAlt || `${p.title}${p.authentic ? "项目渲染" : "概念示意图"}`} loading="lazy"/></div></div><span className="project-number">PROJECT / {p.id}</span>{!p.authentic && <span className="concept-tag">{p.visualLabel || '概念示意'}</span>}<span className="project-open"><ArrowUpRight size={25}/></span><div className="image-metric"><strong>{p.metric}</strong><span>{p.metricLabel}</span></div></div><div className="project-info"><div><span className="project-en">{p.english}</span><h3>{p.title}</h3><p>{p.summary}</p></div><div className="project-tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div></div></div></button></React.Fragment>)}</div>

      </div></section>

      <section id="expertise" className="section expertise"><div className="container"><SectionLabel number="02">CAPABILITIES</SectionLabel><SectionMasthead words={['SKILL','SET']}/><div className="section-heading"><h2>多元背景，<span>综合能力。</span></h2><span className="heading-note">DESIGN / ENGINEERING / COMMUNICATION</span></div><div className="strength-grid">{strengths.map((s,i)=>{ const Icon = icons[s.icon]; return <article className="strength-card" key={s.en}><div className="strength-card-motion"><div className="strength-top"><Icon size={37} strokeWidth={1}/><span>{s.badge || `0${i+1}`}</span></div><span className="strength-en">{s.en}</span><h3>{s.title}</h3><p>{s.text}</p><div className="strength-tools">{s.tools}</div></div></article>; })}</div><MemoAcademicAchievements/><MemoSoftwareToolkit ready={bootReady} reducedMotion={reducedMotion} onModalChange={setSoftwareModalOpen}/>
      </div></section>

      <section id="about" className="section about about-compact"><div className="container"><SectionLabel number="03">ABOUT ME</SectionLabel><SectionMasthead words={['THE','PROFILE']}/></div><div className="container about-strip"><div className="mini-portrait"><div className="portrait-reveal"><MediaImage src={profile.portrait} loading="lazy" alt="瞿林毅彩色个人照片"/></div></div><div className="about-brief"><h2>瞿林毅 <span>设计 · 工程 · 数字化应用</span></h2><p className="about-education">成都理工大学 · 工业设计工程（机械类）硕士在读<br/>金陵科技学院 · 车辆工程本科</p><p>结合工程基础、设计表达与数字工具，探索从产品构想到方案实现的多种可能。在工程设计、装配验证与产品方案的实践中，持续拓展理解问题与解决问题的能力。</p><div className="about-contact"><a href={`mailto:${profile.email}`}>{profile.email}<ArrowUpRight size={14}/></a></div></div><span className="about-city"><MapPin size={14}/>{profile.location}</span></div><div className="container"><MemoExperienceTimeline experience={experience} projects={projects} onOpen={setSelected}/></div><div className="container self-evaluation"><div><h3>自我评价</h3><span>SELF REFLECTION</span></div><p>{selfEvaluation}</p></div></section>

      <section id="contact" className="contact"><div className="contact-grid" aria-hidden="true"/><div className="container contact-inner"><SectionLabel number="04">LET’S CONNECT</SectionLabel><SectionMasthead words={["LET’S",'TALK']}/><div className="contact-topline"><span><i className="status-dot"/> 期待新的工作与合作机会</span><span>GOOD DESIGN STARTS WITH A CONVERSATION</span></div><div className="contact-main"><h2><span className="contact-title-line"><span className="contact-title-word">让下一个想法，</span></span><span className="contact-title-line"><span className="contact-title-word">有一个<span>好的开始。</span></span></span></h2><div className="contact-circle-motion"><a href={`mailto:${profile.email}`} className="contact-circle" aria-label="发送邮件给瞿林毅"><ArrowUpRight strokeWidth={1} /></a></div></div><div className="contact-details"><p>关于设计、工程、数字化应用，<br/>或一个值得一起探索的方向。</p><div className="email-area"><span className="eyebrow">SAY HELLO</span><div><a href={`mailto:${profile.email}`} className="email-link">{profile.email}</a><button className="copy-button icon-button" onClick={copyEmail} aria-label="复制邮箱">{copied ? <Check size={20}/> : <Copy size={20}/>}</button></div><span role="status" className="copy-status">{copied ? '邮箱已复制' : copyError ? '请长按或选中邮箱复制' : '\u00A0'}</span></div></div><div className="contact-links"><a href={`tel:${profile.phone}`}>电话 <span>{profile.phone}</span><ArrowUpRight size={16}/></a><span><MapPin size={14}/>{profile.location}</span></div><footer><a href="#home" className="footer-logo">QU LINYI<span> / DESIGN PORTFOLIO</span></a><span>© {new Date().getFullYear()} 瞿林毅 · <a href="/assets/software/image-credits.txt" target="_blank" rel="noreferrer">图像署名</a></span><a href="#home">回到顶部 <ArrowUpRight size={15}/></a></footer></div></section>
      </div>
    </main>
    {selected && <ProjectDialog project={selected} onClose={()=>setSelected(null)}/>}
    </div>
  </>;
}

createRoot(document.getElementById('root')).render(<App/>);
