from pathlib import Path
from io import BytesIO
import json
import fitz
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'public/assets'
OUTPUT = ROOT / 'public/downloads/qu-linyi-portfolio.pdf'
W, H = 841.89, 595.28
BG = (0.965, 0.957, 0.945)
DARK = (0.065, 0.067, 0.078)
INK = (0.12, 0.12, 0.14)
MUTED = (0.40, 0.39, 0.41)
RED = (0.70, 0.10, 0.18)
PALE = (0.86, 0.83, 0.82)
WHITE = (0.98, 0.97, 0.96)
REG = str(ROOT / 'scripts/fonts/NotoSansSC-regular.ttf')
BOLD = str(ROOT / 'scripts/fonts/NotoSansSC-bold.ttf')
LATIN = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
fonts = {'cjk': fitz.Font(fontfile=REG), 'bold': fitz.Font(fontfile=BOLD), 'latin': fitz.Font(fontfile=LATIN)}
doc = fitz.open()
bookmarks = []
links = []


def page(section, dark=False):
    p = doc.new_page(width=W, height=H)
    for key, path in [('cjk', REG), ('bold', BOLD), ('latin', LATIN)]:
        p.insert_font(fontname=key, fontfile=path)
    p.draw_rect(p.rect, color=None, fill=DARK if dark else BG)
    line(p, 42, 554, 800, 554, (0.29,0.27,0.29) if dark else PALE, .5)
    text(p, 'QU LINYI  /  DESIGN & ENGINEERING', 42, 565, 7, (0.66,0.63,0.65) if dark else MUTED, 'latin')
    text(p, section.replace('\n', ' · '), 390, 564, 7, (0.70,0.67,0.69) if dark else MUTED)
    text(p, f'{len(doc):02d}', 777, 563, 9, (0.96,0.64,0.69) if dark else RED, 'latin')
    return p


def rect(p, x, y, w, h, fill, border=None, radius=0):
    p.draw_rect(fitz.Rect(x,y,x+w,y+h), color=border, fill=fill, width=.6)


def line(p,x1,y1,x2,y2,color=PALE,width=.7):
    p.draw_line((x1,y1),(x2,y2),color=color,width=width)


def text(p, s, x, y, size=12, color=INK, font='cjk', width=None, height=None, align=0):
    # y is the top of a text area, not a baseline.
    width = width if width is not None else W-x-42
    height = height if height is not None else size*2.1
    r = fitz.Rect(x,y,x+width,y+height)
    remaining = p.insert_textbox(r,s,fontsize=size,fontname=font,color=color,lineheight=1.55,align=align,render_mode=0)
    if remaining < -0.1:
        raise ValueError(f'Text overflow on page {len(doc)}: {s[:45]!r}, available={height}, remaining={remaining}')
    return r


def para(p,s,x,y,width,size=11.3,color=MUTED,height=120):
    return text(p,s,x,y,size,color,width=width,height=height)


def image(p,path,x,y,w,h,crop=None,bg=None):
    if bg:rect(p,x,y,w,h,bg)
    path=ASSETS/path
    if crop:
        im=Image.open(path).convert('RGB')
        iw,ih=im.size
        im=im.crop(tuple(round(value*(iw if idx%2==0 else ih)) for idx,value in enumerate(crop)))
        stream=BytesIO();im.save(stream,format='JPEG',quality=94,optimize=True)
        return p.insert_image(fitz.Rect(x,y,x+w,y+h),stream=stream.getvalue(),keep_proportion=True)
    return p.insert_image(fitz.Rect(x,y,x+w,y+h),filename=str(path),keep_proportion=True)


def heading(p,code,title,subtitle=None,dark=False):
    text(p,code,42,28,8,(.91,.43,.50) if dark else RED,'latin')
    text(p,title,42,51,28,WHITE if dark else INK,'bold')
    if subtitle:para(p,subtitle,43,99,750,10.5,(.73,.69,.72) if dark else MUTED,40)


def bullet(p, title, body, x,y,w=235,dark=False):
    rect(p,x,y+6,3,15,RED)
    text(p,title,x+13,y,13,WHITE if dark else INK,'bold',width=w-13)
    para(p,body,x+13,y+29,w-13,10.8,(.75,.71,.74) if dark else MUTED,76)


def opener(number,title,category,description,role,metric,metric_label,pic,crop=None):
    p=page(title,True)
    bookmarks.append([1,title.replace('\n',' · '),len(doc)])
    rect(p,340,0,W-340,548,(.995,.995,.99))
    image(p,pic,350,30,477,485,crop=crop)
    text(p,number,42,29,58,(.47,.13,.21),'latin')
    text(p,category,45,110,9,(.91,.54,.60))
    text(p,title,42,144,29,WHITE,'bold',width=275,height=112)
    para(p,description,45,264,245,11.8,(.80,.77,.79),105)
    line(p,45,390,285,390,(.34,.27,.31),.7)
    text(p,'参与内容',45,410,8,(.74,.56,.62))
    text(p,role,45,431,11,WHITE,width=250,height=45)
    text(p,metric,45,488,26,(1,.55,.62),'latin' if metric.replace('.','').replace('%','').isdigit() else 'bold',width=200)
    text(p,metric_label,150 if metric in ('6%','9.2%') else 45,502 if metric in ('6%','9.2%') else 525,8,(.80,.73,.77),width=155 if metric in ('6%','9.2%') else 250)
    return p

# 01 — cover
p=page('个人作品集',True)
rect(p,441,0,401,548,(.99,.99,.98))
image(p,'robot/cover.jpg',449,36,390,410)
rect(p,42,47,35,3,RED)
text(p,'PORTFOLIO',42,75,12,(.77,.72,.76),'latin')
text(p,'瞿林毅',38,129,51,WHITE,'bold')
text(p,'设计与工程作品集',42,217,27,(1,.52,.60),'bold')
para(p,'工业设计工程硕士在读\n车辆工程本科',45,280,335,16,(.83,.79,.82),80)
text(p,'产品设计  /  工程实践  /  数字化表达',45,398,11,(.86,.77,.82))
text(p,'15949239044',45,463,12,WHITE,'latin')
text(p,'2350062875@qq.com',45,489,11,WHITE,'latin')
text(p,'SELECTED WORKS  /  06 PROJECTS',473,466,9,MUTED,'latin')
text(p,'从需求理解，到方案表达。',473,491,14,INK,'bold')

# 02 — clickable contents
p=page('项目目录')
heading(p,'CONTENTS / SELECTED WORKS','作品先行，实践为证。','六个项目，呈现工程、产品与交互表达中的不同探索。')
entries=[('01','中车四方 · 配送机器人','底盘设计 / 设计迭代','robot/cover.jpg',4),('02','无人机抓取结构','运动机构 / 装配与分析','drone/cover.jpg',6),('03','锦官花城 · 照明支架','安装适配 / 工程实践',None,10),('04','火灾救援集成设备','公共安全 / 产品概念','additional/fire-cover.jpg',11),('05','银龄智能接送车','适老出行 / 交互概念','additional/silver-cover.jpg',14),('06','竹 影灯','竹编材料 / 光影表达','additional/page-13.jpg',18)]
for i,(n,title,tag,pic,dest) in enumerate(entries):
    x=42+(i%3)*260;y=153+(i//3)*194
    rect(p,x,y,240,126,(1,1,1))
    if pic:image(p,pic,x+8,y+5,224,116,crop=(.36,.15,1,.90) if n=='06' else None)
    else:
        text(p,'连接 / 空间 / 装配',x+21,y+29,17,INK,'bold',width=200)
        line(p,x+22,y+79,x+210,y+79,RED,1)
        text(p,'工程安装适配',x+24,y+91,10,MUTED,width=190)
    text(p,n,x,y+134,9,RED,'latin')
    text(p,title,x+24,y+131,13,INK,'bold',width=216,height=24)
    text(p,tag,x+24,y+157,8.5,MUTED,width=216)
    links.append((len(doc)-1,fitz.Rect(x,y,x+240,y+180),dest-1))

# 03 — profile
p=page('个人背景与实习')
heading(p,'PROFILE / BACKGROUND','跨领域背景，持续积累。')
image(p,'portrait.jpg',42,127,116,152)
text(p,'瞿林毅',180,125,25,INK,'bold')
para(p,'工业设计工程（机械类）硕士在读，车辆工程本科背景。结合工程基础、设计表达与数字工具，探索从产品构想到方案实现的多种可能。',180,169,600,12,MUTED,76)
text(p,'CET-6  /  英语六级',181,251,10,RED)
line(p,42,306,800,306)
text(p,'教育经历',42,325,15,INK,'bold')
text(p,'2024.09 — 至今',42,365,9,RED,'cjk',width=180)
text(p,'成都理工大学',42,387,14,INK,'bold',width=300)
para(p,'工业设计工程（机械类） · 硕士在读\n年级前 15%',42,416,310,11,MUTED,60)
text(p,'2020.09 — 2024.06',42,487,9,RED,'latin',width=190)
text(p,'金陵科技学院 · 车辆工程学士',42,508,12,INK,width=320)
text(p,'年级前 10%',42,531,10,RED,width=220,height=20)
text(p,'实习经历',410,325,15,INK,'bold')
text(p,'2026.01 — 2026.03  /  结构实习生',410,354,9,RED,width=380)
text(p,'索尔思光电（成都）有限公司',410,375,12.5,INK,'bold',width=385)
para(p,'参与密封舱、绕纤支架与定位结构方案，配合点胶密封及光纤通断验证，封装过程断纤率降低30%。',410,404,380,10.5,MUTED,55)
text(p,'2024.06 — 2025.09  /  设备实习生',410,462,9,RED,width=380)
text(p,'四川大能科技有限公司',410,483,12,INK,'bold',width=385)
para(p,'参与电源零部件结构设计、工程图与样件试制，开展螺栓扭矩衰减分析及散热密封结构协同。',410,511,380,10.2,MUTED,40)

# 04–05 — robot
opener('01','中车四方\n配送机器人','机器人设计 / 工程实践','面向广州地铁站内无人配送场景，参与机器人底盘结构与外观造型设计。','主要成员 · 底盘结构与外观造型','6%','底盘整体减重','robot/cover.jpg')
p=page('配送机器人 / 设计迭代')
heading(p,'01 / DESIGN DEVELOPMENT','围绕载台、底盘与货箱，展开设计迭代。','参与调整驱动轮与从动轮位置、优化加强筋布局；项目后期实际投入使用。')
for x,pic,title,desc in [(42,'robot/platform.jpg','开放载台','观察机头、载台与底盘的组合关系。'),(302,'robot/chassis-top.jpg','底盘与支撑面','展示载台布局及外部支撑面的设计表达。'),(562,'robot/cargo.jpg','货箱方案','围绕货箱外部包覆和底部空间进行造型推敲。')]:
    image(p,pic,x,163,238,256,bg=(1,1,1))
    text(p,title,x,439,16,INK,'bold',width=237)
    para(p,desc,x,476,236,10.5,MUTED,47)

# 06–09 — gripper
opener('02','无人机\n抓取结构','机构设计 / 轻量化探索','面向低空物流抓取与配送，采用霍伯曼连杆实现多爪同步运动，探索稳定抓取与柔性接触。','主要成员 · 机械爪与抓取配送机构方案','9.2%','抓取结构整体减重','drone/cover.jpg')
p=page('无人机抓取结构 / 运动与装配')
heading(p,'02 / MECHANISM & ASSEMBLY','一个动力输入，多爪同步运动。','从运动传递到空间布局，梳理连杆、支撑与爪夹的装配关系。')
image(p,'drone/principle.jpg',42,145,455,277,bg=(1,1,1))
image(p,'drone/assembly.jpg',518,145,282,277,bg=(1,1,1))
bullet(p,'运动协同','通过中心盘与放射式连杆传递运动，组织爪径收缩与多点同步夹持。',42,446,350)
bullet(p,'装配表达','通过多视角模型，表达支撑、传动及爪夹的连接与相对位置。',439,446,350)
p=page('无人机抓取结构 / 工程图表达')
heading(p,'02 / ENGINEERING DRAWINGS','让模型走向清晰的工程表达。','机构简图与装配图，呈现关键连接及整体关系。')
image(p,'drone/drawings.jpg',42,142,758,345,bg=(1,1,1))
text(p,'表达重点  /  运动关系、关键连接、整体装配',43,508,11,INK)
p=page('无人机抓取结构 / 分析与接触设计')
heading(p,'02 / ANALYSIS & CONTACT','刚性承载，柔性接触。','结合结构分析与接触层设计，探索构件轻量化和负载适应。')
image(p,'drone/analysis.jpg',42,151,366,231,bg=(1,1,1))
image(p,'drone/soft-grip.jpg',434,151,366,231,bg=(1,1,1))
bullet(p,'ANSYS 分析展示','以应力与变形分布辅助观察关键构件，支持方案判断与结构优化。',42,413,352)
bullet(p,'刚柔结合的爪夹方案','刚性主体负责传力，柔性接触层用于缓冲与防滑，并探索可拆卸接触面的应用。',434,413,352)

# 10 — lighting: actual work described without passing off outside drawings as own.
p=page('锦官花城 / 工程实践',True)
bookmarks.append([1,'锦官花城 · 照明支架',len(doc)])
heading(p,'03 / ENGINEERING PRACTICE','锦官花城 · 照明支架','四川天剑光电照明工程实践 / 主要成员',True)
para(p,'围绕建筑立面灯具的安装与工程适配问题，参与连接方式、安装空间、角度调节及装配干涉分析，推进方案与安装条件的核对。',43,151,720,14,(.81,.77,.80),80)
steps=[('01','连接方式','梳理灯具与支架的连接关系。'),('02','安装空间','核对安装位置、角度和操作条件。'),('03','装配检查','观察装配干涉，整理安装检查要点。'),('04','资料交付','整理支架方案、灯具模型与材料需求。')]
for i,(n,t,b) in enumerate(steps):
    x=43+i*193
    rect(p,x,289,179,173,(.12,.11,.14))
    text(p,n,x+15,304,24,(.90,.35,.44),'latin',width=140)
    text(p,t,x+15,352,16,WHITE,'bold',width=146)
    para(p,b,x+15,389,145,10.5,(.77,.72,.76),54)
line(p,43,490,798,490,(.34,.27,.31))
text(p,'工作成果',43,507,9,(.93,.50,.59),width=85)
text(p,'支架结构方案  /  灯具模型  /  安装检查与材料需求资料',133,504,11,WHITE,width=660)

# 11–13 — fire rescue concept
opener('04','火灾救援\n集成设备','产品概念设计 / 公共安全','面向公共场所消防情境，将疏散信息、报警交互与应急用品组织为易于识别和取用的集成设备方案。','产品方案 · 造型与使用流程表达','公共安全','概念方案','additional/fire-cover.jpg')
p=page('火灾救援集成设备 / 设计细节')
heading(p,'04 / PRODUCT DETAILS','把信息识别与应急取用，组织在一起。','围绕设备开合、应急用品收纳和辅助使用区域展开细节表达。')
image(p,'additional/page-04.jpg',42,151,350,257,crop=(.385,.115,.587,.455),bg=(1,1,1))
image(p,'additional/page-04.jpg',413,151,387,257,crop=(.605,.115,.969,.455),bg=(1,1,1))
bullet(p,'收纳与开合','利用开门状态，展示应急用品的可见性与取用方式。',42,435,350)
bullet(p,'功能区域组织','通过整体布局和局部区域，呈现医疗箱及消防信息资料的放置关系。',434,435,352)
p=page('火灾救援集成设备 / 使用流程')
heading(p,'04 / USE SCENARIO','从发现警情，到获取疏散与救援支持。','以连续情境推敲信息查看、报警与应急取用的交互顺序。')
image(p,'additional/page-05.jpg',42,145,758,325,crop=(.04,.13,.97,.88),bg=(1,1,1))
for i,t in enumerate(['识别警情','查看疏散信息','报警与应急取用','沿路线疏散']):
    text(p,f'0{i+1}',42+i*193,496,10,RED,'latin',width=30)
    text(p,t,72+i*193,493,10.5,INK,width=157)

# 14–17 — silver shuttle concept
opener('05','银龄智能\n接送车','交通工具概念 / 适老出行','从祖辈接送儿童的社区短途出行情境出发，探索上下车便利性、车内空间与预约交互的整合表达。','交通工具方案 · 造型、细节与界面表达','适老出行','概念方案','additional/silver-cover.jpg')
p=page('银龄智能接送车 / 草图推敲')
heading(p,'05 / FORM EXPLORATION','从使用情境出发，推敲整车形态。','围绕社区接送场景，探索车体体量、车门开合与乘坐空间的表达。')
image(p,'additional/page-09.jpg',42,140,758,336,crop=(.32,.14,.98,.91),bg=(1,1,1))
text(p,'设计关注  /  易于识别的外观、友好的上下车过程、适老乘坐体验',43,502,11,INK)
p=page('银龄智能接送车 / 细节方案')
heading(p,'05 / ACCESS & DETAILS','让上下车与车内操作，更易于理解。','以下为概念配置与交互意图的展示。')
image(p,'additional/page-10.jpg',42,145,430,345,crop=(.15,.14,.64,.91),bg=(1,1,1))
image(p,'additional/page-10.jpg',496,145,304,246,crop=(.67,.345,.915,.90),bg=(1,1,1))
bullet(p,'上下车辅助与车内操作','以扶手、踏板与操作屏布局，表达对出行便利性的设计考虑。',496,414,300)
p=page('银龄智能接送车 / 交互方案')
heading(p,'05 / INTERACTION DESIGN','连接预约、确认与到达的完整体验。','用界面方案梳理出行前后关键的信息与操作节点。')
image(p,'additional/page-11.jpg',42,140,758,333,crop=(.045,.15,.97,.90),bg=(1,1,1))
for i,(a,b) in enumerate([('引导与预约','确认目的地及车辆信息'),('车辆确认','通过扫描等方式完成确认'),('结束行程','呈现到达状态及行程提示')]):
    text(p,a,44+i*258,489,12,INK,'bold',width=238)
    text(p,b,44+i*258,514,9.5,MUTED,width=238)

# 18–19 — bamboo lamp
opener('06','竹 影灯','文创产品概念 / 材料与光影','以传统竹编为文化线索，探索外部框架、圆形灯罩与光影的组合，让传统材料语言进入现代生活情境。','产品方案 · 材料、造型与场景表达','材料与光','概念方案','additional/page-13.jpg',crop=(.36,.15,1,.91))
p=page('竹 影灯 / 材料与造型')
heading(p,'06 / MATERIAL & LIGHT','以框架组织秩序，以竹编呈现光影。','围绕方形外框、圆形灯罩和局部纹样，推敲整体与细节的层次。')
image(p,'additional/page-15.jpg',42,144,365,300,crop=(.28,.20,.58,.56))
image(p,'additional/page-15.jpg',429,144,371,300,crop=(.60,.20,.897,.56))
bullet(p,'框架与灯罩','外部框架与圆形灯罩形成几何对比，构建清晰的产品轮廓。',42,464,355)
bullet(p,'竹编与细节','用编织肌理、局部纹样和灯光关系，表达材料与文化的联系。',434,464,355)

# 20 — genuine software levels and awards, no borrowed tutorial images.
p=page('综合能力与学习成果')
heading(p,'CAPABILITIES / ACHIEVEMENTS','持续学习，以积累拓展可能。')
text(p,'方法与工具',42,127,16,INK,'bold',width=320)
skills=[('熟悉','SolidWorks / Creo / CATIA / UG / AutoCAD'),('了解','ANSYS / MATLAB / Origin'),('掌握','Python'),('实习应用','HTML 页面布局与基础交互'),('熟练使用','Office / Visio'),('基础应用','Photoshop / 剪映')]
for i,(level,tools) in enumerate(skills):
    y=169+i*44
    text(p,level,42,y,10,RED,width=76)
    para(p,tools,122,y,255,10,MUTED,35)
text(p,'语言与学习表现',42,456,14,INK,'bold',width=330)
para(p,'英语六级 CET-6\n硕士阶段：年级前 15%\n本科阶段：年级前 10%',42,486,320,10.5,MUTED,66)
text(p,'竞赛获奖',429,127,16,INK,'bold',width=350)
awards=[('2025 / 省级一等奖','第十八届全国三维数字化创新设计大赛'),('2024 / 省级三等奖','第十七届全国三维数字化创新设计大赛'),('2022 / 省级二等奖','第十届大学生机械创新设计大赛')]
for i,(a,b) in enumerate(awards):
    y=169+i*66
    text(p,a,429,y,10,RED,width=370)
    para(p,b,429,y+23,370,10.5,INK,35)
text(p,'奖学金与荣誉',429,382,14,INK,'bold',width=360)
para(p,'2025  成都理工大学二等奖学金\n2022  金陵科技学院二等奖学金\n2021  金陵科技学院一等奖学金\n2021  金陵科技学院优秀青年志愿者',429,418,367,10.8,MUTED,115)

# 21 — contact, self-contained for offline applications.
p=page('联系方式',True)
rect(p,42,57,36,3,RED)
text(p,'LET’S CONNECT',42,91,12,(.79,.68,.75),'latin')
text(p,'让下一个想法，',40,155,39,WHITE,'bold')
text(p,'有一个好的开始。',40,218,39,(1,.54,.62),'bold')
para(p,'期待设计、工程与数字化应用领域的新机会。\n愿以持续学习、稳定投入与团队协作，推进每一次实践。',45,306,680,14,(.82,.77,.81),70)
line(p,45,420,795,420,(.34,.27,.31))
text(p,'瞿林毅',45,447,21,WHITE,'bold',width=150)
text(p,'15949239044',256,448,17,WHITE,'latin',width=320)
text(p,'2350062875@qq.com',256,483,17,WHITE,'latin',width=490)
p.insert_link({'kind':fitz.LINK_URI,'from':fitz.Rect(255,447,510,477),'uri':'tel:15949239044'})
p.insert_link({'kind':fitz.LINK_URI,'from':fitz.Rect(255,484,780,516),'uri':'mailto:2350062875@qq.com'})
text(p,'中国 · 成都',45,499,11,(.72,.67,.71),width=160)

assert len(doc)==21, len(doc)
for page_num,area,dest in links:
    doc[page_num].insert_link({'kind':fitz.LINK_GOTO,'from':area,'page':dest})
doc.set_toc([[1,'作品目录',2],[1,'个人背景与实习',3]]+bookmarks+[[1,'综合能力与学习成果',20],[1,'联系方式',21]])
doc.set_metadata({'title':'瞿林毅｜设计与工程作品集','author':'瞿林毅','subject':'求职作品集 · 工业设计工程与车辆工程','keywords':'产品设计,工程实践,机器人,机构设计,瞿林毅','creator':'Qu Linyi Portfolio'})
OUTPUT.parent.mkdir(parents=True,exist_ok=True)
doc.save(OUTPUT,garbage=4,deflate=True)
print(json.dumps({'file':str(OUTPUT),'pages':len(doc),'bytes':OUTPUT.stat().st_size},ensure_ascii=False))
