export const profile = {
  name: '瞿林毅', english: 'QU LINYI', email: '2350062875@qq.com', phone: '15949239044',
  location: '中国 · 成都', portrait: '/assets/portrait.jpg',
};
export const projects = [
  {
    id: '01', category: '机器人设计', title: '中车四方 · 配送机器人', english: 'AUTONOMOUS DELIVERY ROBOT',
    image: '/assets/robot/cover.jpg', authentic: true, study: 'robot', tags: ['底盘结构', '轻量化设计', '外观造型'], metric: '6%', metricLabel: '底盘整体减重',
    summary: '从初版一体式车体，到第二版整机、载台与货箱的设计迭代。',
    context: '面向广州地铁站内无人配送需求，参与底盘结构与外观造型设计。初版采用高位交互机头与开放载台；第二版围绕整机外观、底盘载台和货箱继续迭代。',
    tasks: ['参与机器人底盘结构与外观造型设计。', '改变驱动轮与从动轮位置，优化底盘布局。', '调整加强筋，对底盘结构进行优化。'],
    outcome: '底盘整体减重 6%，项目后期实际投入使用。', role: '主要成员',
  },
  {
    id: '02', category: '机构设计', title: '无人机抓取结构', english: 'AERIAL LOGISTICS GRIPPER',
    image: '/assets/drone/cover.jpg', authentic: true, study: 'drone', tags: ['霍伯曼连杆', '同步抓取', '柔性爪夹'], metric: '9.2%', metricLabel: '抓取结构整体减重',
    summary: '以单动力协同多爪运动，探索低空物流中的稳定抓取。',
    context: '面向低空物流抓取与配送需求，项目采用霍伯曼连杆实现多爪同步运动，结合刚性承载与柔性接触层，围绕机构布局、装配关系与轻量化展开设计。',
    tasks: ['参与轻量化抓取无人机机械爪设计。', '参与抓取配送机构整体设计方案。', '完成相关三维结构展示，表达机构方案与装配关系。'],
    outcome: '抓取结构整体减重 9.2%。', role: '主要成员',
  },
  {
    id: '03', category: '工程结构', title: '锦官花城 · 照明支架', english: 'ARCHITECTURAL LIGHTING SUPPORT',
    image: '/assets/lighting/bracket-reference-zh.webp', visualLabel: '参考图', imageAlt: '建筑幕墙线型洗墙灯支架中文安装节点参考图', tags: ['支架结构', '安装适配', '装配检查'], metric: '工程适配', metricLabel: '从结构方案到安装条件核对',
    summary: '以现场安装为起点，让每一个连接都有据可依。',
    context: '参与四川天剑光电锦官花城综合体夜景照明支架结构设计，围绕建筑立面灯具的安装与工程适配问题开展方案分析。',
    tasks: ['分析连接方式、安装空间、角度调节与装配干涉。', '绘制支架结构方案，完成相关灯具模型。', '梳理安装检查要点与材料需求，核对安装条件。'],
    outcome: '形成支架结构方案、相关灯具模型及安装检查与材料需求资料。', role: '主要成员',
  },
];
export const experience = {
  education: [
    { time: '2024.09 — 至今', title: '成都理工大学', role: '工业设计工程（机械类） · 硕士在读', detail: '年级前 15% · 机械设计与构造 / 建模与仿真 / 现代设计方法' },
    { time: '2020.09 — 2024.06', title: '金陵科技学院', role: '车辆工程 · 学士', detail: '年级前 10% · 机械设计基础 / 工程力学 / 机械制图与 CAD' },
  ],
  internship: [
    { time: '2024.06 — 2025.09', title: '四川大能科技有限公司', role: '设备实习生', detail: '围绕电源零部件的功能和接口要求，参与结构设计、工程图绘制与样件试制；结合装配记录、振动条件及残余扭矩分析螺栓扭矩衰减，并与供应商协同核对散热器水道、密封圈及点胶的加工可行性和材料风险。沉淀螺栓复拧 SOP，扭矩衰减程度≤40%；总结钣金件 SKU 缩减30%的优化经验。' },
    { time: '2026.01 — 2026.03', title: '索尔思光电（成都）有限公司', role: '结构实习生', detail: '布置六向定位、紧定螺钉与螺纹连接，降低支架偏移及合舱干涉风险；配合双组分胶混合、真空脱泡与60°C固化，验证装配后的光纤通断。完成密封舱、绕纤支架及定位结构方案，形成可装配样件方案，封装过程断纤率降低30%。' },
  ],
  projects: [
    { projectId: '01', detail: '参与配送机器人底盘结构与外观造型设计，调整驱动轮、从动轮位置并优化加强筋布局，推动底盘轻量化。', result: '底盘整体减重 6% · 后期投入使用' },
    { projectId: '02', detail: '参与低空物流无人机机械爪与抓取配送机构方案设计，完成三维结构展示，围绕机构布局、装配关系与轻量化开展优化。', result: '抓取结构整体减重 9.2%' },
    { projectId: '03', detail: '参与锦官花城夜景照明支架设计，分析连接、安装空间与装配干涉，完成支架方案、灯具模型及安装条件核对。', result: '结构方案 · 灯具模型 · 工程适配' },
  ],
};
export const strengths = [
  { icon: 'box', en: 'DESIGN & ENGINEERING', title: '设计与工程实践', text: '结合工业设计工程与车辆工程的学习背景，从产品需求、工程原理到三维建模，探索设计构想到方案实现的完整过程。', tools: 'SolidWorks / Creo / CATIA / UG / AutoCAD' },
  { icon: 'scan', en: 'ANALYSIS & DATA', title: '分析与数据表达', text: '了解仿真与数据分析工具，结合 Python 和图表整理，将信息转化为便于比较、理解与交流的分析结果。', tools: 'ANSYS / MATLAB / Origin / Python' },
  { icon: 'layers', en: 'ADAPTATION & TEAMWORK', title: '跨领域理解与协作', text: '拥有电源零部件与光电封装的实践经历，围绕可靠性、定位与密封问题开展分析，并与供应商协同核对加工可行性和材料风险。', tools: '可靠性分析 / 装配验证 / 供应商沟通' },
  { icon: 'workflow', en: 'VISUAL COMMUNICATION', title: '视觉与汇报表达', text: '运用办公、流程和视觉工具组织信息，结合基础图片处理、视频剪辑与页面布局，让方案清楚可读、便于交流。', tools: 'Office / Visio / Photoshop / 剪映 / HTML' },
  { icon: 'language', en: 'ENGLISH & SELF LEARNING', title: '英语与自主学习', text: '通过大学英语六级，具备较强的英语学习能力。主动理解新概念、学习新工具，持续拓展跨领域的知识与应用能力。', tools: 'CET-6 / 英语学习 / 持续提升', badge: 'CET-6' },
];

// 展示顺序：机器人设计 → 机构设计 → 工程结构。


// 追加作品：依据用户提供的《瞿林毅作品集-副本2.pdf》整理。
const page = (number, title, note) => ({ title, note, image: `/assets/additional/page-${String(number).padStart(2, '0')}.jpg` });
projects.push(
  {
    id: '04', category: '产品设计', title: '火灾救援集成设备', english: 'FIRE RESCUE INTEGRATION EQUIPMENT',
    image: '/assets/additional/fire-cover.jpg', authentic: true, tags: ['公共安全', '应急交互', '产品造型'],
    metric: '公共安全', metricLabel: '消防设备与使用流程设计',
    summary: '面向公共场所的消防场景，整合信息展示、报警与应急用品的产品方案。',
    context: 'FIRE SHIELD 是面向公共场所消防场景的集成设备概念方案。设计围绕楼层疏散信息、报警交互与应急用品的可见性和取用方式展开，以红白色彩强化识别。',
    tasks: ['通过草图推敲产品轮廓、模块布局与视觉识别。', '展示楼层信息、报警按钮、应急用品等功能区域。', '通过连续情境图表达发现警情、查看路线、报警及应急取用流程。'],
    outcome: '形成产品草图、整体渲染、细节与使用流程展示。', role: '产品方案设计',
    gallery: [page(2, '方案概览', '消防集成设备的产品定位与整体造型。'), page(3, '草图推敲', '从多个草图方向推敲外形与功能模块布局。'), page(4, '产品细节', '呈现信息展示、应急交互与用品取用区域。'), page(5, '使用流程', '以情境图说明从警情发现到疏散和取用的设计流程。')],
  },
  {
    id: '05', category: '产品设计', title: '银龄智能接送车', english: 'SILVER AGE INTELLIGENT SHUTTLE',
    image: '/assets/additional/silver-cover.jpg', authentic: true, tags: ['适老出行', '交通工具', '交互设计'],
    metric: '适老出行', metricLabel: '面向社区接送场景的概念方案',
    summary: '从祖辈接送儿童的日常出发，探索更友好的社区短途出行体验。',
    context: 'SILVER 聚焦老年人接送儿童的社区短途出行场景。方案围绕上下车便利性、车内座椅与储物空间，以及预约和确认交互展开，提供整车、细节与使用场景表达。',
    tasks: ['结合竞品分析与适老场景，梳理产品设计目标。', '通过草图与整车渲染表达车体造型、低底盘和上下车辅助设计。', '展示车门、扶手等细节，并补充预约、确认与到达交互界面。'],
    outcome: '形成调研、设计目标、草图、车辆细节、交互界面及场景渲染。', role: '交通工具概念设计',
    gallery: [page(6, '方案概览', '银龄智能接送车整体方案。'), page(7, '竞品分析', '围绕社区共享交通工具整理比较与场景观察。'), page(8, '设计目标', '从适老场景、功能需求与造型表达确定设计方向。'), page(9, '草图推敲', '通过草图探索体量、空间与车辆外观。'), page(10, '细节展示', '呈现车门、上下车辅助与局部结构的设计意图。'), page(11, '交互界面', '展示预约、车辆确认与到达流程的界面方案。'), page(12, '场景展示', '用场景渲染表达社区接送体验。')],
  },
  {
    id: '06', category: '产品设计', title: '竹 影灯', english: 'BAMBOO GLOW',
    image: '/assets/additional/bamboo-cover.jpg', authentic: true, tags: ['竹编工艺', '光影表达', '材料与造型'],
    metric: '材料与光', metricLabel: '传统竹编与现代灯具的设计探索',
    summary: '以传统竹编为灵感，将框架、灯罩与光影组织为日常生活中的一盏灯。',
    context: '竹 影灯以传统竹编灯具为文化线索，探索竹材框架、灯罩与光影的组合关系。方案通过调研、市场分析和产品细节，呈现传统材料语言在现代生活场景中的表达。',
    tasks: ['整理竹编灯具的文化背景与市场分析。', '以框架、灯罩与局部纹样建立产品的造型层次。', '通过细节与室内场景渲染表达材料、结构及灯光氛围。'],
    outcome: '形成设计背景、市场分析、产品细节及室内场景展示。', role: '文创产品方案设计',
    gallery: [page(13, '方案概览', '竹 影灯的整体造型与室内展示。'), page(14, '调研与分析', '围绕竹编工艺与产品方向整理背景和市场分析。'), page(15, '产品细节', '通过局部视图呈现框架、灯罩及细节处理。')],
  }
);

export const selfEvaluation = '坚持长期主义，重视长期发展与专业积累，愿意在岗位上持续深耕，通过一步步改进，与工作共同成长。坚持规律健身，以稳定的体能与自律支撑工作投入，能够适应加班与轮班节奏，在高强度任务中保持专注。面对不同工作方向，主动学习、及时调整，尽快理解新的任务要求与协作方式。积极争取学习与成长的机会，力求把事情做到前列，同时尊重职责边界与成果归属，以能力赢得机会，以分寸维护协作。通过大学英语六级，具备较强的英语学习能力，持续将语言学习与专业积累相结合。';
