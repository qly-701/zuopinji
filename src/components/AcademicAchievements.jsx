import { Award, GraduationCap } from 'lucide-react';
import { achievements } from '../achievementData';

export default function AcademicAchievements() {
  return <div className="academic-achievements">
    <div className="achievement-heading"><span className="eyebrow">LEARNING & ACHIEVEMENTS</span><h3>持续学习，让投入有所回响。</h3></div>
    <div className="achievement-overview">
      <div className="academic-panel achievement-entry"><div className="achievement-entry-motion"><div className="achievement-panel-title"><GraduationCap size={23} strokeWidth={1.4}/><h4>学习成绩</h4></div><div className="academic-stats">{achievements.academic.map(record => <article className="academic-record" key={record.stage}><span className="academic-stage">{record.stage}</span><div className="academic-rank"><span>年级前</span><strong>{record.percentile}<span>%</span></strong></div><h5>{record.school}</h5><p>{record.major}</p></article>)}</div></div></div>
      <div className="competition-panel"><div className="achievement-panel-title"><Award size={23} strokeWidth={1.4}/><h4>竞赛获奖</h4><span>03 AWARDS</span></div><ol className="competition-list">{achievements.competitions.map(item => <li className="competition-award achievement-entry" key={item.year}><div className="achievement-entry-motion"><time>{item.year}</time><h5>{item.title}</h5><strong>{item.award}</strong></div></li>)}</ol></div>
    </div>
    <div className="honors-heading"><h4>奖学金与荣誉</h4><span>SCHOLARSHIPS & RECOGNITION</span></div><div className="honors-grid">{achievements.honors.map(item => <article className="honor-card achievement-entry" key={`${item.year}-${item.title}`}><div className="achievement-entry-motion"><div className="honor-topline"><time>{item.year}</time><span>{item.type}</span></div><h5>{item.title}</h5><p>{item.school}</p></div></article>)}</div>
  </div>;
}
