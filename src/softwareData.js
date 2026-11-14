import softwareMedia from './softwareMedia.json';

export const softwareTools = [
  { id: 'solidworks', name: 'SolidWorks', category: '建模与制图', level: '熟悉', use: '三维零件与装配建模，表达尺寸、连接与装配关系。' },
  { id: 'creo', name: 'Creo', category: '建模与制图', level: '熟悉', use: '参数化建模与特征组织，推敲零件形态和设计关系。' },
  { id: 'catia', name: 'CATIA', category: '建模与制图', level: '熟悉', use: '三维造型与曲面表达，辅助产品及车辆方案推敲。' },
  { id: 'nx', name: 'UG · Siemens NX', category: '建模与制图', level: '熟悉', use: '实体与曲面建模，在三维环境中组织产品方案。' },
  { id: 'autocad', name: 'AutoCAD', category: '建模与制图', level: '熟悉', use: '二维工程制图与尺寸标注，让设计信息清晰可读。' },
  { id: 'ansys', name: 'ANSYS', category: '仿真与分析', level: '了解', use: '了解仿真分析流程，辅助观察构件的应力与变形。' },
  { id: 'matlab', name: 'MATLAB', category: '仿真与分析', level: '了解', use: '了解数值计算与数据绘图，用曲线辅助分析问题。' },
  { id: 'origin', name: 'Origin', category: '仿真与分析', level: '了解', use: '了解数据整理与科学绘图，直观呈现数据关系。' },
  { id: 'python', name: 'Python', category: '数据与开发', level: '掌握', use: '通过编程处理与整理数据，将重复任务组织为清晰流程。' },
  { id: 'html', name: 'HTML', category: '数据与开发', level: '实习应用', use: '组织页面结构与基础布局，清晰呈现信息内容与交互。' },
  { id: 'office', name: 'Microsoft Office', category: '办公与表达', level: '熟练使用', use: '使用 Word、Excel、PowerPoint 整理文档、数据与汇报材料。' },
  { id: 'visio', name: 'Visio', category: '办公与表达', level: '熟练使用', use: '用流程图与关系图梳理逻辑，帮助团队理解方案。' },
  { id: 'photoshop', name: 'Photoshop', category: '图像与视频', level: '基础应用', use: '进行基础图像处理与版面整理，完善设计展示素材。' },
  { id: 'capcut', name: '剪映', category: '图像与视频', level: '基础应用', use: '进行基础视频剪辑与字幕编排，组织动态展示内容。' },
].map(tool => ({ ...tool, ...softwareMedia[tool.id] }));

export const softwareCategories = ['全部工具', '建模与制图', '仿真与分析', '数据与开发', '办公与表达', '图像与视频'];
