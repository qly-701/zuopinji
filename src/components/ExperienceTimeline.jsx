import MediaImage from './MediaImage';
import { ArrowUpRight } from 'lucide-react';

export default function ExperienceTimeline({ experience, projects, onOpen }) {
  return <div className="experience-timeline">
    <div className="experience-heading"><span className="eyebrow">EXPERIENCE & PRACTICE</span><h3>在不同实践中，积累解决问题的能力。</h3></div>
    <div className="experience-columns">
      <div className="internship-column"><div className="experience-column-label"><h4>实习经历</h4><span>02 / INTERNSHIPS</span></div><ol className="experience-list">{experience.internship.slice().reverse().map(item => <li className="experience-entry internship-entry" key={item.title}><article className="experience-entry-motion"><span className="experience-date">{item.time}</span><h5>{item.title}</h5><span className="experience-role">{item.role}</span><p>{item.detail}</p></article></li>)}</ol></div>
      <div className="project-experience-column"><div className="experience-column-label"><h4>项目经历</h4><span>03 / PROJECT EXPERIENCE</span></div><ol className="experience-list">{experience.projects.map(item => {
        const project = projects.find(project => project.id === item.projectId);
        return <li className="experience-entry" key={item.projectId}><div className="experience-entry-motion"><button type="button" className="experience-project" onClick={() => onOpen(project)} aria-label={`从项目经历查看${project.title}详情`}><div className="experience-project-image"><MediaImage usage="thumb" sizes="130px" src={project.image} alt={project.imageAlt || `${project.title}项目展示`} loading="lazy"/>{!project.authentic && <span>{project.visualLabel || '概念示意'}</span>}</div><div className="experience-project-content"><div className="experience-project-top"><h5>{project.title}</h5><ArrowUpRight size={17}/></div><span className="experience-role">{project.role} · {project.category}</span><p>{item.detail}</p><span className="experience-result">{item.result}</span></div></button></div></li>;
      })}</ol></div>
    </div>
  </div>;
}
