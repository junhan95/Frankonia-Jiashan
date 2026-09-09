import { chambersPath, industryPath, topicPath, typePath } from "./chamber-sections";
import { sectionPath } from "./company-sections";
import {
  testProductPath,
  testSystemsPath,
} from "./test-system-sections";
import { contactPath } from "./contact-sections";
import { asset, localeRoute, type Lang } from "./site-config";
import ContactBand, { type BandCopy } from "./contact-band";
import { closingLine } from "./page-closing";
import SiteHeader, { type HeaderCopy } from "./site-header";
import SiteFooter, { type FooterCopy } from "./site-footer";
import StructuredData from "./structured-data";
import SiteLink from "./site-link";

/* All copy lives here, keyed by locale — the KO / EN pages render from the
   same tree. Chamber category order is fixed by the site map:
   Automotive → Military → Commercial → Powertrain → RVC → Shielded Room.

   The navigation labels are localised like everything else. Korean labels are
   far shorter than the English ones ("챔버" against "Anechoic Chambers"), so
   the bar is laid out to keep the same design in both: see the `.nav` rules in
   globals.css, which anchor the mark and the controls and centre the menu in
   whatever space is left rather than letting label width move them. */
const copy = {
  zh: {
    nav: { company: "关于我们", chamber: "电波暗室", equip: "EMC 测试系统", cyber: "CyberShield", contact: "联系我们", cta: "获取报价" },
    navSubs: {
      contact: { quote: "报价与技术咨询", catalog: "下载产品目录" },
    },
    a11y: {
      skip: "跳转到正文",
      primaryNav: "主导航",
      mobileNav: "移动导航",
      menuOpen: "打开菜单",
      menuClose: "关闭菜单",
    },
    heroTag: "EMC TEST SOLUTIONS · ENGINEERED IN GERMANY SINCE 1987",
    heroH1a: "全方位 EMC 测试，",
    heroH1b: "Frankonia",
    heroH1c: "与您同行",
    heroP: "自1987年以来，我们已向全球80多个国家提供EMC电波暗室和测试系统。从咨询设计到生产、施工、验证、售后支持，整个项目过程由一个团队负责。",
    heroB1: "查看解决方案",
    heroB2: "报价与技术咨询",
    /* "35+ 챔버 라인업" used to sit third. It came out for the same reason the
       category counts did: the number has to be rewritten every time the
       catalogue grows, and HQ's August 2026 review asked for chamber figures
       to come off the site — custom builds mean there are always more than the
       printed number, and printing one makes the portfolio look smaller than
       it is. 95% is `trP1`'s figure and does not move with the catalogue.

       The fourth cell counted the solution areas — "3" — and the row it stands
       on now carries six cards. A count of our own sections is the weakest of
       the four things this band can say anyway: it measures the site's
       navigation rather than the company. 120 dB is EN 50147-1 at 100–400 MHz
       and is the figure the shielded room's own copy prints further down the
       page; it belongs beside 1987, 80+ and 95% because none of the four moves
       when the catalogue does. */
    stats: [["1987", "Frankonia 成立"], ["80+", "供货国家"], ["95%", "内部设计和生产"], ["120dB", "最大屏蔽效能"]],
    solK: "OUR SOLUTIONS",
    solH: "EMC 屏蔽及配套测量设备",
    solP: "一个集团，两支工程团队。暗室和屏蔽室由 Frankonia Heideck 管理，测试系统由 Frankonia Forchheim 管理。同样的屏蔽技术也延伸到 EMC 实验室以外的数据中心。",
    c1h: "电波暗室",
    c1sub: "Anechoic & Reverberation Chambers",
    c1p: "从用于预认证的屏蔽室和紧凑室到3.0·5.0·10.0 m半电波暗室和全电波暗室系列、组件/驱动室和混响室——这不是单个产品的列表，而是一个单一的系统。",
    c1list: [
      "Frankosorb® 吸波材料 — 超过 35 年的无缺陷运行",
      "75mm螺栓紧固，无需焊接或胶合——可改建、扩建、搬迁",
      "ECE R10 · CISPR 25 · ISO 11452 · MIL-STD-461",
    ],
    c2h: "EMC 测试系统",
    c2sub: "EMC Test Systems",
    c2p: "我们提供发射和抗扰度测试所需的设备——EMI接收器、电场传感器、射频功率计以及在一个机箱中包含整个测试链的完整系统，例如照片中的CIT-100。",
    c2list: [
      "EMI 接收器 10 Hz 至 6 GHz — 完全符合 CISPR 16-1-1",
      "电场传感器10 kHz~26.5 GHz·射频功率计DC~12.4 GHz",
      "IEC/EN 61000-4-6 · ISO 11452-4 · MIL-STD-461 CS114",
    ],
    c3sub: "电磁波安全/屏蔽",
    c3p: "将与建设EMC实验室相同的屏蔽技术应用于AI数据中心和安全设施的周边。我们提供从设计到集成、安装和现场测量的单一系统。",
    c3list: [
      "非焊接螺栓连接——与作业设施平行施工",
      "无损坏地拆卸并重新用于扩建或搬迁",
      "安装后现场测量屏蔽性能——证据，而非猜测",
    ],
    c3go: "CyberShield详情",
    c4h: "吸波材料",
    c4sub: "Frankosorb® Absorbers",
    c4p: "决定暗室性能的不是墙壁，而是它与墙壁的附着物。 Frankosorb®纳米薄膜吸波体由Frankonia直接开发和生产——金字塔型、混合型和天线系列，覆盖范围从26 MHz到40 GHz。",
    c4list: [
      "长金字塔 P2000~P2400 单独 26MHz~40GHz — 无需铁氧体",
      "DIN EN 13501-1 A2 不易燃等级 — 不带喷水灭火系统",
      "自1991年第一代至今35年，无老化、性能下降",
    ],
    c5h: "搅拌器",
    c5sub: "Stirrer Systems",
    c5p: "这是一个创建混响室的装置。 Z 形折叠/盘/管搅拌器不断改变边界条件，以在一个周期内统计均衡电场——根据腔室尺寸，最多可组合三个。",
    c5list: [
      "Z型折叠 ø1.8~2.8m 最大60RPM · 大盘 ø9.0~12.0m",
      "角度精度 0.1° · 位置精度 ±0.1° · 0.8° 校准步长",
      "调谐2种·搅拌操作模式·Elektra接口·CE认证",
    ],
    c6h: "驱动系统测试系统",
    c6sub: "E-Drive Systems",
    c6p: "通过实际运行电动汽车传动系统进行测试。 EDTC-SA，将负载放置在腔室外部并将其连接在轴上；EDTC-AX，由两个 e 轴单元组成；EDTC-BB，将 4 象限移动负载 EMC-BlueBox 放置在腔室内部。",
    c6list: [
      "EDTC-SA·AX·BB——从单电机到电驱桥再到EMC-BlueBox",
      "外部负载高达2×250kW·4象限运行",
      "完全符合 CISPR 25 发射、ISO 11452 抗扰度",
    ],
    more: "查看详情",
    chH: "从一个零件到一辆车",
    chP: "需要哪个暗室由两个值决定——标准要求的测量距离，以及被测设备必须进入的静区的大小。从 1.0 m 组件室到 10.0 m 车辆室（带 ø6.0 m 静区），它们按行业和室类型组织。",
    chambers: [
      "零件沿着路径移动，直到被装载到车辆上。 1.0 m 距离的 ACTC 和超小型 UCC，3.0·5.0 m 的 AVTC，内置测功机的 10.0 m SAC-10V — ECE R10 · CISPR 25 · ISO 11452，长达 18.0 m 的车辆中等负载测试区域。",
      "MIL-STD 461·DO-160兼容系列。用于车辆和大型被测设备的 MIL-STD 测试室、满足商业和汽车测试场地需求的高级测试室以及组件级的紧凑型 MIL CHC — 30/80MHz 至 40GHz。",
      "四个行业组中最广泛的。从一间屏蔽室到 ø6.0 m 静区中的 10.0 m 半电波暗室 — 3.0·5.0·10.0 m SAC、自由空间 FAC、CHC 用于预认证。符合所有 CISPR 16-1-4 和 IEC 61000-4-3 标准。",
      "专用于传动系统部件以及混合动力、电动和燃料电池系统的测试场地。 EDTC-SA 具有 1 个固定轴外部负载，2 个 EDTC-AX 用于电子轴，EDTC-BB 具有室内 4 象限移动负载 — 高达 2 × 250 kW，完全符合 CISPR 25·ISO 11452。",
      "墙壁反射，无需吸收体，搅拌器使电场统计均匀。无需显着增加放大器输出即可实现高场强 — 从用于组件的 S 到用于重型车辆的 XXL，再到用于 ISM/多媒体的 e1·e2。 IEC/EN 61000-4-21·ISO 11452-11，LUF 80MHz 以上。",
      "整个阵容的起点。 2.0mm 镀锌钢 PAN 模块以 75mm 间距用螺栓固定在网状垫圈上，可提供任何尺寸 - 根据 EN 50147-1，10kHz 时为 90dB，100-400MHz 时为 120dB。该面板是 Frankosorb® 吸波器的基础，随后可转换为电波暗室。",
    ],
    eqH: "EMC 测试系统",
    eqP: "我们提供符合 IEC 61000-4、CISPR、ISO 11452 和 MIL-STD-461 的测量设备，从发射测量到传导/辐射抗扰度和磁场测试。以下是我司此次推出的产品线。集成测试系统是最短路径——不是将多台设备堆叠在机架中，而是由单个单元执行测试。",
    eq: [
      "10kHz~1GHz固态放大器（最大12kW）和500MHz~40GHz宽带WBA。",
      "宽带 ALX、堆叠对数周期 MAX、喇叭 HAX、加载 SAX 和环路 LAX — 9kHz 至 40GHz。",
      "CIT 系列在一个 19 英寸外壳中配备传导射频抗扰度测试链，ECU-6、PSG-300、MTS-800 用于辐射抗扰度。",
      "用于发射测量的宽带前置放大器。 9kHz~40GHz，增益28~35dB，噪声系数2dB起。",
      "射频功率计和继电器开关单元。 DC~12.4GHz，扩展至18/40GHz。",
      "一种通过光纤读取的电场强度计。 10kHz~26.5GHz，0.14~1500V/m。",
    ],
    stK: "MODULAR & PRE-FABRICATED SHIELDING STANDARDS",
    stH: "自 1987 年以来一直沿用的一种方法 – 无焊接或胶合",
    stP: "Frankonia的所有暗室和屏蔽室均按照相同的预制模块标准建造。墙壁、门、贯穿件和通风口被设计为一个单独的屏蔽壳，以确保接头处的性能无泄漏，并且所有接头均用螺栓固定，以便以后可以更换、延伸和移动。",
    st: [
      "将 2.0 毫米镀锌钢 PAN 模块从内部以 75 毫米的间隔并以指定的扭矩拧紧在高电导率网状垫圈上。由于该模块穿过常规建筑门，因此可以采用任何尺寸并靠近现有墙壁放置。",
      "屏蔽是自支撑的，不会对建筑物施加额外的负载。如果当地地震条件需要，可增加静力钢结构并反向安装，以保证内表面平整。",
      "单门型（SLD）、双门型（DLD）、平移门（SSD）、平移门（SG）。它配备手动、气动和电动闩锁，并按照任何尺寸的相同模块标准预先制造。",
      "外部可操作的配电盘、根据当地标准定制的接线、LED、应急、防爆照明。 AC/DC 滤波器、信号/数据滤波器、光学转换器、安全矩阵和上位 PLC – 符合机械指令 2006/42/EC 的 CE 合规性是标准配置。",
      "蜂窝和冷却/排气系统允许空气通过并阻挡射频。气体和烟雾采样网络、符合 ATEX 标准的分析仪、泄漏检测和喷水器等灭火解决方案均设计在屏蔽边界内。",
      "CISPR 25·MIL测试台（FGT）和CISPR 32透明测试台（FTT）配备固定和移动高清摄像头、声音和录音系统以及地平面。这些是您的测试室运行所需的东西。",
    ],
    stGo: "了解有关屏蔽和门的更多信息",
    abK: "FRANKOSORB® ABSORBERS",
    abH: "无碳、不燃烧、吸收体35年不老化",
    abP: "这是Frankonia与科隆大学和TU Braunschweig EMC研究所共同开发的纳米薄膜吸收体。自 1991 年第一代以来，没有出现任何故障、缺陷或性能下降，也无需更换或维护。该技术的目的不仅是满足吸收性能，还满足不燃性等级和清洁度。",
    ab: [
      "短金字塔P600·P900专门覆盖80MHz，长金字塔P2000·P2200·P2400专门覆盖26MHz至18/40GHz。这本身就节省了成本，因为不需要分离铁氧体。您可以将它们挂在导轨上，然后将它们一一移除。",
      "铁氧体片（30 MHz–1 GHz）与短锥形吸波材料组合，覆盖 30 MHz–18/40 GHz。600 × 600 mm 铁氧体面板在工厂预制，并用螺钉固定在支撑结构上。吸波材料长度较短，因此可减小暗室尺寸。",
      "A2不燃系列，专为天线、OTA暗室开发。楔形HFK600-A2覆盖400 MHz以上，长金字塔形P1400HF-A2覆盖70 MHz至40 GHz以上。根据 IEEE 1128，对频率低于 1 GHz 的同轴线进行测试，对于频率高于 1 GHz 的频率使用拱形方法以不同的入射角进行测试。",
      "DIN EN 13501-1 A2 - s1 d0 不易燃等级。它可以连续承受高达 1 kW/m²·600 V/m 的电压，瞬时承受高达 2.0 kW/m²·850 V/m 的电压。如果使用不燃吸波材料，则无需安装单独的喷水器或灭火设备。",
      "不老化、不下垂、不损失性能——经过35年以上的长期稳定性验证。制造工艺确保单元之间的性能相同，中空结构确保高吸收性能和快速散热。由于它具有白色表面，因此无需单独的盖子即可确保照明。",
      "加热时也不释放有毒气体，不产生粉尘或碳尘，不使用溶剂或粘合剂。 99% 可回收，不吸湿，符合 ISO 14644-1 洁净室等级 — 可用水清洁，表面抗病毒和细菌。",
    ],
    abGo: "Frankosorb®吸波器详情",
    auK: "AUTOMATION & STIRRERS",
    auH: "室内移动的一切都是我们自己设计的。",
    auP: "转盘和天线杆、自动门、混响室搅拌器——由Frankonia研发部门直接设计和生产。根据机械指令 2006/42/EC 进行的安全评估以及高速旋转的动态和静态负载计算均来自同一团队。",
    au: [
      "从ø1.2 m到ø12.0 m，最大80吨。嵌入凸起底部的导电接地环与腔室接地平面保持接触。拖链、数据、电力和流体的旋转接头、排气和冷却系统以及测功机被组装在一起。",
      "FAM是CISPR 16-1-4标准桅杆，FBM增加了ANSI C63.4一致倾斜——软件根据天线参考点和距离计算倾斜角度、测试物体尺寸，并监控测试过程。它由玻璃纤维和塑料制成，可减少反射。",
      "平移门的整个开启和关闭过程是通过气动闭锁自动完成的。我们设计自动坡道、无级入口平台，甚至根据场地条件定制入口解决方案，并具有屏蔽周边。",
      "混响室的核心设备。 ø1.8 m Z 形折叠搅拌器以高达 30 RPM 的速度连续改变边界条件，使内部电场在整个旋转过程中统计上均匀。这是RVC S·M和e1的标准配置。",
      "用于车辆测试。由于室内的车辆会显着干扰场的均匀性，因此搅拌器必须相应地快速。以高达 60 RPM、0.8° 步长旋转 ø2.8 m，每转获得 450 个位置 - 速度越快，统计不确定性越小。",
      "适用于大型车辆混响室。盘式在 120 RPM 时转动 ø4.0 m，管式在 240 RPM 转动 ø2.0 m，ø9.0~12.0 m 大盘降低了最低可用频率（LUF）。角度精度0.1°，位置精度±0.1°。",
    ],
    auGo: "自动化设备更多详情",
    trK: "WHY FRANKONIA",
    trH1: "自己做",
    trH2: "我们负责到底",
    trH3: "",
    trP1: "Frankonia 设计和生产了大约 95% 的组件和产品，这些组件和产品采用模块化预制方法制造 - 屏蔽板和门、Frankosorb® 吸波材料，甚至其中的测试设备。由于它不是从外部采购和组装的，因此质量是在单一标准下管理的，并且规格的更改结束于图纸而不是供应链。",
    trP2: "一个团队负责从需求定义和初步审查到工程、生产、安装、验收测试、校准和维护的所有工作。如果需要检查某件事，还有一个可以联系的地方。",
    trP3: "Frankosorb® 吸波材料是与科隆大学和 TU Braunschweig EMC 研究所共同开发的不燃薄膜技术。自 1991 年第一代以来，它一直运行完美。",
    trGo: "公司简介",
    badges: [["95%", "零部件和产品的内部设计和生产"], ["5", "全球基地"], ["1991", "自 Frankosorb® 第一代以来没有缺陷"], ["100%", "交钥匙——从设计到验收测试"]],
    /* The band used to read "견적 및 기술 상담 — 프로젝트 요구사항을 알려주시면
       최적의 솔루션을 제안해 드립니다", which is a sentence that could close any
       B2B page ever written: it named nothing the reader has to supply and
       nothing they get back. Its two buttons were a mail link and the German
       switchboard, and the switchboard was the only phone number a Korean
       reader was ever offered. Both are gone — the copy now states the three
       inputs the first reply actually needs, and the buttons lead to the
       contact page where all five offices are.

       The sentence that counted out those five offices has since gone too. It
       was the fourth line of a four-line paragraph, and that paragraph was
       144px of a 598px band the head office asked us to make smaller — the
       contact page the first button opens carries all five addresses anyway.
       Two lines is the budget here now; see `.band p` in globals.css. */
    ctK: "CONTACT",
    ctH: "让我们从您需要的开始。",
    ctP: "只需向我们发送三件事——必须通过的标准、被测设备的尺寸以及安全的安装空间——我们将回复适当的腔室类型和设备配置。",
    ctB1: "查看联系方式",
    ctB2: "直接邮件询问",
    ftDesc: "EMC 电波暗室、测试系统和屏蔽解决方案 — 自 1987 年以来遍布全球 80 多个国家",
    // Jiashan office address and telephone.
    // Three lines rather than one ` · `-joined string: as a single run it set
    // the width of the whole first footer column, which is what HQ flagged in
    // the August review ("address below the company name to have this column a
    // bit smaller"). Stacked, it sits under the wordmark in the same 340px the
    // description already holds to.
    ftAddr: ["Jiashan Frankonia EMC Co., Ltd.", "No.55, Hongqiao Rd, Zone 4, Jiashan, Zhejiang 314100, China", "T +86 573 8473 1555"],
    ftCompany: "关于我们",
    ftSol: "解决方案",
    ftL1: "电波暗室",
    ftL2: "EMC 测试系统",
    ftLink: "链接",
    ftHq: "Frankonia Group",
    ftContact: "报价与技术咨询",
    ftImprint: "法律声明",
    ftPriv: "隐私政策",
  },
  en: {
    nav: { company: "Company", chamber: "Anechoic Chambers", equip: "EMC Test Systems", cyber: "CyberShield", contact: "Contact", cta: "Get a Quote" },
    navSubs: {
      contact: { quote: "Quote & Technical Support", catalog: "Catalog Downloads" },
    },
    a11y: {
      skip: "Skip to content",
      primaryNav: "Primary navigation",
      mobileNav: "Mobile navigation",
      menuOpen: "Open menu",
      menuClose: "Close menu",
    },
    heroTag: "EMC TEST SOLUTIONS · ENGINEERED IN GERMANY SINCE 1987",
    heroH1a: "Everything for EMC testing,",
    heroH1b: "Frankonia",
    heroH1c: " at your side",
    heroP: "Since 1987 we have supplied EMC anechoic chambers and test systems to more than 80 countries. One team carries the project from consulting and design through manufacturing, installation, verification and after-sales service.",
    heroB1: "Explore Solutions",
    heroB2: "Request a Quote",
    stats: [["1987", "Frankonia founded"], ["80+", "Countries supplied"], ["95%", "Designed and built in-house"], ["120dB", "Peak shielding effectiveness"]],
    solK: "OUR SOLUTIONS",
    solH: "The EMC shielding and its instruments",
    solP: "One group, two engineering teams: Frankonia Heideck answers for the chambers and shielded rooms, Frankonia Forchheim for the test systems. The same shielding technology carries beyond the EMC laboratory to the data centre.",
    c1h: "Chambers",
    c1sub: "Anechoic & Reverberation Chambers",
    c1p: "From shielded rooms and compact pre-compliance chambers to the 3, 5 and 10 metre semi- and fully-anechoic families, component and e-drive chambers, and reverberation chambers — one system rather than a catalogue of separate products.",
    c1list: [
      "Frankosorb® absorber — 35+ years in service without a defect",
      "Bolted every 75 mm, never welded or glued — modify, extend, relocate",
      "ECE R10 · CISPR 25 · ISO 11452 · MIL-STD-461",
    ],
    c2h: "Test Systems",
    c2sub: "EMC Test Systems",
    c2p: "Instruments for emission and immunity testing — EMI receivers, field sensors, RF power meters, and complete systems such as the CIT-100 pictured here, which carries a whole test chain in one case.",
    c2list: [
      "EMI receivers 10 Hz–6 GHz — fully CISPR 16-1-1 compliant",
      "Field sensors 10 kHz–26.5 GHz · RF power meters DC–12.4 GHz",
      "IEC/EN 61000-4-6 · ISO 11452-4 · MIL-STD-461 CS114",
    ],
    c3sub: "Electromagnetic Security",
    c3p: "The same shielding technology that builds an EMC laboratory, applied to the boundary of AI data centres and secure facilities — engineered, integrated and measured on site as one system.",
    c3list: [
      "Bolted, no hot work — installed alongside live operations",
      "Dismantled without damage, reused when the room is extended or moved",
      "Shielding effectiveness measured on site after installation",
    ],
    c3go: "Explore CyberShield",
    c4h: "Absorbers",
    c4sub: "Frankosorb® Absorbers",
    c4p: "What decides a chamber's performance is not the wall but what is on it. Frankosorb® nano thin-film absorbers are developed and produced in-house — pyramid, hybrid and antenna series, covering 26 MHz to 40 GHz.",
    c4list: [
      "Long pyramids P2000–P2400 cover 26 MHz–40 GHz alone — no ferrite needed",
      "Non-combustible to DIN EN 13501-1 class A2 — no sprinkler system required",
      "35 years since the first generation, without ageing or loss of performance",
    ],
    c5h: "Stirrers",
    c5sub: "Stirrer Systems",
    c5p: "The instrument that makes a reverberation chamber work. Z-fold, disc and tube stirrers keep changing the boundary conditions until the field is statistically uniform over one turn — up to three of them, depending on the size of the chamber.",
    c5list: [
      "Z-fold ø1.8–2.8 m up to 60 RPM · large disc ø9.0–12.0 m",
      "Angle accuracy 0.1° · positioning ±0.1° · 0.8° calibration step",
      "Two tuned modes and a stirred mode · Elektra interface · CE marked",
    ],
    c6h: "E-Drive Systems",
    c6sub: "Powertrain Test Chambers",
    c6p: "Testing an electric drivetrain while it actually turns. EDTC-SA takes one external load machine on a fixed shaft, EDTC-AX two of them for an e-axle, and EDTC-BB brings the four-quadrant EMC-BlueBox mobile load machine inside the chamber.",
    c6list: [
      "EDTC-SA · AX · BB — single motor, e-axle, EMC-BlueBox",
      "External load machines up to 2 × 250 kW, four-quadrant",
      "Fully compliant to CISPR 25 emission and ISO 11452 immunity",
    ],
    more: "Learn more",
    chH: "From a single component to a whole vehicle",
    chP: "Which chamber you need comes down to two figures — the measurement distance the standard asks for, and the quiet zone the EUT has to sit in. From 1.0 m component chambers to a 10.0 m vehicle chamber with a ø6.0 m quiet zone, indexed by industry and by chamber form alike.",
    chambers: [
      "Follows a part from the bench into the vehicle: the ACTC at 1.0 m, the ultra-compact UCC, the AVTC at 3 and 5.0 m, and the SAC-10V with an integrated dynamometer at 10.0 m — ECE R10, CISPR 25 and ISO 11452, up to a heavy-load zone for 18.0 m vehicles.",
      "Chambers to MIL-STD 461 and DO-160 — the MIL-STD Chamber for vehicles and large EUTs, the Advanced version that also meets commercial and automotive test site requirements, and the compact MIL CHC at component level. 30/80 MHz to 40 GHz.",
      "The widest of the four, from a single shielded room to a 10.0 m semi-anechoic with a ø6.0 m quiet zone — SAC at 3, 5 and 10.0 m, free-space FAC, pre-compliance CHC. Fully compliant to CISPR 16-1-4 and IEC/EN 61000-4-3.",
      "Dedicated test sites for drivetrain components and hybrid, electric and fuel-cell systems. EDTC-SA for one external load machine on a fixed shaft, EDTC-AX for two in an e-axle setup, EDTC-BB bringing a four-quadrant mobile load machine inside — up to 2 × 250 kW, fully compliant to CISPR 25 and ISO 11452.",
      "No absorbers: the walls reflect and a stirrer keeps changing the boundary conditions until the field is statistically uniform — high field strength without a large amplifier, and no argument about antenna alignment. S to XXL and the e1 and e2, to IEC/EN 61000-4-21 and ISO 11452-11, from 80 MHz LUF.",
      "Where the whole line-up starts. 2.0 mm galvanized steel PAN modules bolted every 75 mm onto a mesh gasket, at any size the room has to be — 90 dB at 10 kHz and 120 dB at 100–400 MHz to EN 50147-1. The same panel carries Frankosorb® absorbers, so a shielded room can become an anechoic chamber later.",
    ],
    eqH: "EMC Test Systems",
    eqP: "Instruments for emission measurement and for conducted, radiated and magnetic field immunity, built into IEC 61000-4, CISPR, ISO 11452 and MIL-STD-461 setups. The families below are the ones the head office is leading with; the integrated systems among them are the shortest way in — one instrument that runs the test itself, rather than a rack assembled from several.",
    eq: [
      "Solid-state amplifiers from 10 kHz to 1 GHz, up to 12 kW, and the WBA wideband models from 500 MHz to 40 GHz.",
      "The broadband ALX, the stacked log-periodic MAX, the HAX horns, the SAX rod and the LAX loop — 9 kHz to 40 GHz.",
      "The CIT series — a whole conducted RF immunity chain in one 19″ case — with the ECU-6 for radiated immunity, the PSG-300 and the MTS-800.",
      "Broadband pre-amplifiers for emission measurement. 9 kHz to 40 GHz, 28 to 35 dB gain, noise figure from 2 dB.",
      "RF power meters and the relay switching unit. DC to 12.4 GHz, extendable to 18 or 40 GHz.",
      "Field strength read back over a fibre optic link. 10 kHz to 26.5 GHz, 0.14 to 1500 V/m.",
    ],
    stK: "MODULAR & PRE-FABRICATED SHIELDING STANDARDS",
    stH: "One standard since 1987 – nothing welded, nothing glued",
    stP: "Every Frankonia chamber and shielded room is built on the same prefabricated modular standard. Walls, doors, penetration and ventilation openings are engineered as one envelope so nothing is lost at the joints — and because every joint is bolted, the room can be modified, extended or moved later.",
    st: [
      "2.0 mm galvanized steel PAN modules, bolted from the inside every 75 mm to a defined torque onto a high-conductivity mesh gasket. The modules pass through a standard building door, so the shielding can be any size and can stand close to an existing wall.",
      "The shielding carries itself, so the parent building takes no additional structural load. A static steel structure is added where local seismic conditions ask for one, and reverse installation leaves a flat surface inside.",
      "Single-leaf (SLD), double-leaf (DLD), sliding doors (SSD) and sliding gates (SG), with manual, pneumatic or electrical latching support — prefabricated to the same modular standard at any size.",
      "A distribution unit reachable from outside, cabling to local standards, LED, emergency and explosion-protection lighting. AC and DC filters, signal and data filters, optic converters, a safety matrix and a higher-level PLC — CE conformity to Machinery Directive 2006/42/EC as standard.",
      "Honeycombs and the cooling and exhaust systems pass air but not RF. A gas and smoke air-sampling network, an ATEX-compliant analyser, liquid detection and extinguishing solutions such as sprinklers are all designed inside the shielding boundary.",
      "Fixed and mobile HD camera systems, audio and recording systems, CISPR 25 and MIL test tables (FGT) with a ground plane, and CISPR 32 transparent test tables (FTT) — what the laboratory needs to actually run.",
    ],
    stGo: "Shielding & Gates in detail",
    abK: "FRANKOSORB® ABSORBERS",
    abH: "Carbon-free, non-combustible, and no older after 35 years",
    abP: "Frankosorb® is a nano thin-film absorber developed with the University of Cologne and the EMC institute at TU Braunschweig. Since the first generation in 1991 it has run without malfunction, defect or loss of performance, and has never needed refurbishing. What sets it apart is not absorption alone but absorption together with a fire class and a cleanliness class.",
    ab: [
      "The short pyramids P600 and P900 start at 80 MHz and the long pyramids P2000, P2200 and P2400 at 26 MHz, each covering up to 18/40 GHz on its own. No ferrite is needed alongside them, which is a cost saver in itself. Everything hangs into rails and comes out piece by piece.",
      "Ferrite tiles (30 MHz to 1 GHz) under short pyramids cover 30 MHz to 18/40 GHz. The 600 × 600 mm ferrite panels are prefabricated in the factory and screwed onto a substructure, and because the absorber is shorter the chamber can be smaller.",
      "The A2 non-combustible family developed for antenna and OTA chambers. The HFK600-A2 wedge starts at 400 MHz and the P1400HF-A2 long pyramid at 70 MHz, both to beyond 40 GHz. Tested per IEEE 1128 — in a coaxial line below 1 GHz, in an arch above it, at several angles of incidence.",
      "Non-combustible to DIN EN 13501-1 class A2 - s1 d0, handling 1 kW/m² or 600 V/m continuous and 2.0 kW/m² or 850 V/m intermediate. With non-combustible absorbers no sprinkler or fire extinguishing system is necessary.",
      "No ageing, no drooping, no loss of performance — stability proven over more than 35 years. The manufacturing process guarantees identical performance from one absorber to the next, and the hollow body pairs high absorption with fast cooling. The white finish holds the illumination level without covers.",
      "No toxic gases if an absorber heats up, no dirt and no carbon dust, solvent-free and free of glue. Recyclable at 99%, non-hygroscopic, clean room classification to ISO 14644-1 — washable, with a virus and bacteria resistant surface.",
    ],
    abGo: "Frankosorb® absorbers in detail",
    auK: "AUTOMATION & STIRRERS",
    auH: "Everything that moves inside the chamber is our own design",
    auP: "Turntables, antenna masts, automatic gates and reverberation stirrers are designed and built in Frankonia's own R&D department — including the risk assessment under Machinery Directive 2006/42/EC and the dynamic and static calculations that fast stirring asks for.",
    au: [
      "From ø1.2 m to ø12.0 m, up to 80 tons. Integrated flush into the raised floor and surrounded by a conductivity grounding ring that keeps contact with the chamber's ground plane. Energy chains, rotary joints for data, electrics or fluids, exhaust and cooling systems and dynamometers go in with it.",
      "The FAM is the standard mast to CISPR 16-1-4; the FBM adds a tilt function compliant with ANSI C63.4, its software calculating the tilt angle from the antenna reference point, the distance and the size of the EUT while it monitors the test. Both are built from fibreglass and plastics to keep reflecting material to a minimum.",
      "A sliding gate opens and closes fully automatically with pneumatic latching support. Automatic ramps, platforms with a flush entrance and customised entrance solutions are designed together with the shielding boundary.",
      "The instrument that makes a reverberation chamber work. A ø1.8 m Z-fold stirrer at up to 30 RPM keeps changing the boundary conditions so that the field inside becomes statistically uniform over one turn — the standard fit for the RVC S, M and e1.",
      "For vehicle testing. A vehicle inside the working volume disturbs field uniformity badly, so the stirrer has to be that much faster: ø2.8 m at up to 60 RPM in 0.8° steps gives 450 positions per turn, and the faster it turns the lower the statistical uncertainty.",
      "For large vehicle reverberation chambers. Disc-style turns ø4.0 m at 120 RPM and tube-style ø2.0 m at 240 RPM, while a ø9.0 to 12.0 m large disc pulls the lowest usable frequency down. Angle accuracy 0.1°, positioning accuracy ±0.1°.",
    ],
    auGo: "Automation in detail",
    trK: "WHY FRANKONIA",
    trH1: "We make it,",
    trH2: "so we stand behind it",
    trH3: "",
    trP1: "Shielding panels and doors, Frankosorb® absorbers, and the instruments that go inside the room — around 95% of the components and products in a Frankonia project are designed and built in-house, in modular prefabricated construction. Nothing is bought in and assembled here, so quality is held to a single standard and a change to the specification ends at the drawing rather than in the supply chain.",
    trP2: "One team carries the project from requirements and pre-study through engineering, production, installation, acceptance testing, calibration and maintenance. When there is something to answer for, there is one place to call.",
    trP3: "Frankosorb® is a non-combustible thin-film absorber developed with the University of Cologne and the EMC institute at TU Braunschweig. Since the first generation in 1991 it has run without a defect.",
    trGo: "About Frankonia",
    badges: [["95%", "Components and products built in-house"], ["5", "Sites worldwide"], ["1991", "First Frankosorb® generation — no defect since"], ["100%", "Turnkey — design through acceptance testing"]],
    ctK: "CONTACT",
    ctH: "We start from what the test has to prove",
    ctP: "Send the standard, the size of the device under test and the space you have — we answer with the chamber form and the instruments that fit.",
    ctB1: "Contact us",
    ctB2: "Email us directly",
    ftDesc: "EMC anechoic chambers, test systems and shielding solutions — more than 80 countries since 1987",
    ftAddr: ["Jiashan Frankonia EMC Co., Ltd.", "No.55, Hongqiao Rd, Zone 4, Jiashan, Zhejiang 314100, China", "T +86 573 8473 1555"],
    ftCompany: "Company",
    ftSol: "Solutions",
    ftL1: "Chambers",
    ftL2: "EMC Test Systems",
    ftLink: "Links",
    ftHq: "Frankonia Group",
    ftContact: "Quote & Technical Support",
    ftImprint: "Imprint",
    ftPriv: "Privacy Policy",
  },
} as const;

/* The picture at the head of each solution card. These were three line icons
   on flat colour tiles — a drawn chamber, a drawn instrument, a drawn shield.
   The chamber and test-system rows further down this page had already made the
   opposite argument: a photograph of the thing is a stronger claim than a
   drawing of it. These three now follow.

   The first two are the branch's own lead image, so the card and the page it
   opens show the same thing: the chambers overview's figure and the CIT-100
   that heads the integrated-systems family. `kind` picks the fitting rule, as
   it does on the chamber cards — the two photographs fill the band, and the
   CIT-100 is a product render on white that has to be fitted whole. Cropping
   it to the band's ratio would cut through the front panel that is the only
   reason to show it.

   The third card carried the PAN panel wall until the CyberShield band below
   took the product page's six lines and their six photographs with it; that
   wall is the Structure card's picture now, and one photograph twice on one
   page reads as an oversight. It then carried `facility-aerial.webp`, the
   data-centre campus the CyberShield page opens its system section on — but
   that image is a render, and on a row where the two cards beside it are
   photographs of real rooms a rendered building is the weakest of the three
   claims. What stands there now is the shielded boundary itself: the control
   cabinets and the filter bank that carry power and signal across it, and the
   bolted shielded door beside them. Everything that enters the room is in the
   frame, which is the argument CyberShield makes about a data centre — the
   envelope is only as good as its penetrations.

   The same photograph, cropped tighter, is the Electrical & Filters card in
   the shielding band further down. That is deliberate rather than the
   oversight described above: this crop opens out to the full bay and the one
   below closes on the cabinet line, and the head office's website library has
   no second photograph of a service boundary. Replace this one first if a
   picture of a delivered installation seen from outside ever arrives — every
   card in this row is an interior now, so "the shielding leaves the
   laboratory" rests on the copy alone.

   The row is six cards since the head office widened it: chambers, CyberShield
   and absorbers above, stirrers, e-drive systems and test systems below. The
   three that came with it follow the rule the first two already did — each
   takes the lead image of the page it opens, so the card and its destination
   show the same thing: the Frankosorb® page header, the reverberation hall
   with its large disc turning under the ceiling, and the powertrain rig on its
   turntable. Two of those photographs appear once more further down the page,
   the stirrer in the automation band and the EDTC in the hero rotation, which
   is the same trade the CyberShield frame makes above: the library has one
   photograph of each and a card without a picture is the weaker loss.

   Keyed by name rather than by index because display order is no longer the
   order the copy is written in — CyberShield is second in the grid and third
   in `copy`. */
const solutionShots = {
  chambers: { src: "/chambers/images/overview-lineup.webp", w: 1600, h: 989, kind: "photo" },
  cybershield: { src: "/cybershield/images/shielding-boundary.webp", w: 1600, h: 847, kind: "photo" },
  absorbers: { src: "/chambers/images/topic-frankosorb.webp", w: 1280, h: 533, kind: "photo" },
  stirrers: { src: "/chambers/images/type-rvc-stirrer.webp", w: 1122, h: 591, kind: "photo" },
  edrive: { src: "/chambers/images/ind-powertrain-edtc.webp", w: 1600, h: 1095, kind: "photo" },
  testSystems: { src: "/test-systems/images/system-cit-100.webp", w: 1600, h: 609, kind: "render" },
} as const;

/* The six cards the site map fixes the order of, each pointing at the page that
   carries its models. Four are industries and two are chamber forms — that is
   the mix the site map asks for, and the chamber branch indexes both axes, so
   each card can reach its own list without flattening the two into one. The
   cards already lifted and turned their heading red on hover; they were simply
   not links, which is a promise a page should not make twice.

   The sixth slot was Others — special-purpose and custom chambers — and it had
   no page and no photograph, so the row ran five cards against a three-column
   grid and left a hole. Shielded Room takes it: it is the product the whole
   range is built on (every chamber on these pages is a shielded room with an
   absorber lining), it has a type page of its own, and the head office
   photographs it. Custom sizing is not lost with Others — it is what the
   shielded room's own copy says.

   `shot` is the card's picture. Every one is a photograph of a real chamber,
   taken from the 2026 catalogue and photobook — Automotive, Military and
   Commercial were cutaway renders until those arrived, and a drawing of a
   chamber is a weaker argument than the chamber. `kind` stays because the
   fitting rule differs: photographs fill the frame, renders would have to be
   fitted whole against white, and the site may take renders again for a model
   that has no photograph.

   `models` is model names and standards, which read the same in both locales —
   Commercial carried "SAC 시리즈 · FAC 시리즈" until now, and that Korean ran
   untranslated through the English page. */
const chamberCards = [
  { name: "Automotive", models: "ACTC · UCC · AVTC · SAC-10V", path: industryPath("automotive"),
    shot: { src: "/chambers/images/industry-automotive.webp", w: 900, h: 578, kind: "photo" } },
  { name: "Military", models: "MIL-STD Chamber · Advanced · MIL CHC", path: industryPath("military"),
    shot: { src: "/chambers/images/industry-military.webp", w: 744, h: 591, kind: "photo" } },
  { name: "Commercial", models: "SAC · FAC · CHC · CTC", path: industryPath("commercial"),
    shot: { src: "/chambers/images/industry-commercial.webp", w: 900, h: 636, kind: "photo" } },
  { name: "Powertrain", models: "EDTC-SA · EDTC-AX · EDTC-BB", path: industryPath("powertrain"),
    shot: { src: "/chambers/images/industry-powertrain-edtc.webp", w: 900, h: 600, kind: "photo" } },
  { name: "RVC", models: "RVC e1 · e2 · S · M · L · XL · XXL", path: typePath("rvc"),
    shot: { src: "/chambers/images/type-rvc-reverberation.webp", w: 900, h: 600, kind: "photo" } },
  { name: "Shielded Room", models: "PAN Module · EN 50147-1 / IEEE 299", path: typePath("shielded-room"),
    shot: { src: "/chambers/images/type-shielded-room-pan.webp", w: 1122, h: 591, kind: "photo" } },
] as const;

/* The row is now the branch's own six product families. They stood in the order
   the dropdown and the overview list them until the three on show were put in
   the order the band's lead argues for instead — Integrated Systems first,
   because `eqP` calls it the shortest way in, then Meters & Switching and
   Field Strength Meters. The three hidden between them keep their catalogue
   places, which is where they would come back. The three cards it replaces predated the
   branch and did not line up with it: the branch carries no EMI receiver at
   all, so "ERX-6 · ERC-6" named two models this site has no page for, and
   "Accessories" was one tile standing in for four families. Every card here
   reaches the family page that holds its models, and the model line names
   models that page actually prints.

   `shot` is the card's picture, in place of the line icons the row used to
   carry. Five come from the branch's own asset ledger — the same photographs
   that head those family pages, so the card and the page it opens show the
   same instrument. Amplifiers had no picture anywhere on the site (the head
   office publishes that family as a matrix of band against model name and
   nothing else), so the rack shot was cut from p.18 of the 2019 Amplifier
   Selection Book; see the asset ledger.

   `kind` picks the fitting rule, as on the chamber cards. Everything except
   the amplifier rack is a product cut-out on white with its own margins, and
   cropping one to 3:2 would take the horn off an antenna or the connector off
   a probe — those are fitted whole. The rack is a photograph and fills its
   band.

   `show` is which of the six the row prints, and the answer is the families
   that hold the instruments the head office's August 2026 mail asks to have
   promoted: Integrated Systems (CIT, ECU-6, PSG-300, MTS-800), Meters &
   Switching (PMS, RSU) and Field Strength Meters (EFS). The amplifiers, the
   antennas and the pre-amplifiers are the parts a laboratory adds around
   those, and the mail does not ask for them. They stay declared, with their
   picture, their model line and their paragraph in both locales, so putting
   one back is one word per card. They are not deleted and not stranded: every
   family still has its page and its sitemap entry.

   Two families on show have no card in this row: Emission Measuring Systems,
   because the row predates that page, and Coupling & Decoupling, which the
   head office's follow-up put on show ("for the CIT please also list
   CDNs/EMCL and BCI probes") and which the branch has no photograph of — the
   head office does not photograph a coupling network. Both are on
   `/test-systems/` and in the header dropdown, which is where the cards here
   lead anyway. See the note on `shownTestProducts` in test-system-sections.ts.

   `eqP`, the band's lead, names no count. It used to — "Six product families,
   ninety-nine models" — and that figure was out of date the month it was
   written; `testModels` holds far more now, and a landing band is the last
   place a number should have to be kept in step with a data file. It states
   the range the branch covers instead, which is what the standards line was
   always doing. */
const equipCards = [
  { name: "RF Power Amplifiers", models: "FLL · VLL · VLC · FLH · WBA", path: testProductPath("amplifier"),
    show: false,
    shot: { src: "/test-systems/images/amplifier-rack.webp", w: 900, h: 600, kind: "photo" } },
  /* The HAX horn rather than the ALX that heads the antenna page: the ALX is
     thin silver rod against a transparent ground and all but disappears at
     card size, while the horn holds its shape. */
  { name: "Antennas", models: "ALX · MAX · HAX · SAX-10 · LAX-10", path: testProductPath("antenna"),
    show: false,
    shot: { src: "/test-systems/images/antenna-hax-18.webp", w: 1200, h: 900, kind: "plate" } },
  /* The CIT-100's own plate. The MTS-800 stood here once and went back to the
     magnetic field page when this family was cut to the CIT series; the family
     is four products again, and the CIT is still the one the caption leads
     with, so the plate stays where it is. */
  { name: "Integrated Systems", models: "CIT-100 · CIT-1000 · ECU-6 · PSG-300 · MTS-800", path: testProductPath("system"),
    show: true,
    shot: { src: "/test-systems/images/system-cit-100.webp", w: 1600, h: 609, kind: "plate" } },
  { name: "Pre-Amplifiers", models: "FPA-2 · 6A · 6B · 18 · 26 · 40", path: testProductPath("preamp"),
    show: false,
    shot: { src: "/test-systems/images/preamp-fpa.webp", w: 1200, h: 920, kind: "plate" } },
  { name: "Meters & Switching", models: "PMS 1084 · 1084 B · RSU", path: testProductPath("meter"),
    show: true,
    shot: { src: "/test-systems/images/meter-rsu.webp", w: 1400, h: 481, kind: "plate" } },
  { name: "Field Strength Meters", models: "EFS-10 · 100 · 300 · 500 · 18", path: testProductPath("efs"),
    show: true,
    shot: { src: "/test-systems/images/efs-probe.webp", w: 360, h: 595, kind: "plate" } },
] as const;

/* Three bands stand below the test-system line-up, and together they are the
   part of the company the two rows above do not reach: how the room is built,
   what lines it, and what moves inside it.

   The first replaces the CyberShield band that used to sit here. That band
   named the six CyberShield product lines — Structure, Access, Connectivity,
   Air & Waveguides, Validation, Lifecycle — and sent all six cards to
   /cybershield. On a data-centre page that is the right cut; on this one it
   put a sub-brand's catalogue in the middle of the corporate site while the
   thing the sub-brand is an application of — the prefabricated modular
   standard every chamber on these pages is built on — appeared nowhere. The
   head office calls that standard "Modular and prefabricated standards" in its
   own Trusted Solutions list, and the cards are the six groups of
   /chambers/shielding-gates, so a visitor who follows one meets the same six
   headings on the page it opens. CyberShield keeps its card in the solutions
   row at the top of this page, which is where a sub-brand belongs.

   Absorbers and stirrers had the same problem in a worse form: Frankosorb® is
   the company's oldest differentiator and appeared on this page as one bullet
   in a chamber card, and /chambers/frankosorb, /chambers/automation and the
   RVC stirrer table were reachable only from the header dropdown. These two
   bands are the landing page's first link to any of them.

   `path` is per card rather than per band because the six do not all live on
   one page — the gate card belongs to shielding-gates and the three stirrer
   cards to the stirrers page, and sending a reader to the automation page for
   a stirrer would be the "re-map six onto four" problem again. Those three
   pointed at the RVC type index until the stirrer had a page of its own; that
   index answers "which reverberation chamber", not "which stirrer".

   `shot` is each card's photograph, as on the chamber and equipment rows
   above. The six the shielding band uses are the ones the CyberShield band
   left behind, copied under `std-` names because a path reading /cybershield/
   under a section that is explicitly not CyberShield would be a lie in the
   markup. The seven that came out of the head office deck are in the asset
   ledger. `models` stays in figures and standards, which read the same in both
   locales. */
const standardCards = [
  { name: "PAN Modules", models: "2.0 mm DX 52 D+Z · 75 mm bolt pitch",
    shot: "std-pan-modules", w: 1000, h: 667, path: typePath("shielded-room") },
  { name: "Steel Structure", models: "Self-supporting · Seismic",
    shot: "std-steel-structure", w: 1000, h: 667, path: typePath("shielded-room") },
  { name: "Doors & Gates", models: "SLD · DLD · SSD · SG",
    shot: "std-doors-gates", w: 1000, h: 667, path: topicPath("shielding-gates") },
  { name: "Electrical & Filters", models: "AC/DC · Signal · Data · PLC",
    shot: "std-electrical", w: 1000, h: 667, path: topicPath("shielding-gates") },
  { name: "Ventilation & Detection", models: "Honeycomb · ATEX · Sprinkler",
    shot: "std-ventilation", w: 1000, h: 667, path: topicPath("shielding-gates") },
  { name: "Laboratory Fit-out", models: "HD camera · FGT · FTT",
    shot: "std-fitout", w: 1000, h: 667, path: topicPath("shielding-gates") },
] as const;

const absorberCards = [
  { name: "Pyramid (P) Series", models: "P600 · P900 · P2000 · P2200 · P2400",
    shot: "topic-frankosorb", w: 1280, h: 533 },
  { name: "Hybrid (H) Series", models: "H450 · H600 · H1000 · H1300 Turbine",
    shot: "absorber-hybrid", w: 1265, h: 578 },
  { name: "Antenna (HF) Series", models: "HFK600-A2 · P1070HF-A2 · P1400HF-A2",
    shot: "absorber-hf", w: 1600, h: 1200 },
  { name: "Non-combustible A2", models: "DIN EN 13501-1 A2 - s1 d0 · 2.0 kW/m²",
    shot: "absorber-a2", w: 1600, h: 861 },
  { name: "No Ageing", models: "35+ years · identical performance",
    shot: "overview-absorber", w: 900, h: 556 },
  { name: "Clean & Safe", models: "Carbon-free · 99% recyclable · ISO 14644-1",
    shot: "absorber-clean", w: 1265, h: 577 },
] as const;

const automationCards = [
  { name: "Turntables – FTM", models: "ø1.2–12.0 m · up to 80 t",
    shot: "topic-automation", w: 1600, h: 1067, path: topicPath("automation") },
  { name: "Antenna Masts – FAM · FBM · FSM", models: "CISPR 16-1-4 · ANSI C63.4",
    shot: "automation-mast", w: 1600, h: 860, path: topicPath("automation") },
  { name: "Gates & Access", models: "Automatic ramps · Flush platforms",
    shot: "overview-shielding", w: 900, h: 556, path: topicPath("shielding-gates") },
  { name: "Z-Fold Stirrer", models: "ø1.8 m · up to 30 RPM",
    shot: "stirrer-zfold", w: 1600, h: 1200, path: topicPath("stirrers") },
  { name: "High-speed Z-Fold", models: "ø2.8 m · up to 60 RPM · 0.8° step",
    shot: "stirrer-zfold-highspeed", w: 901, h: 1201, path: topicPath("stirrers") },
  { name: "Disc & Tube Stirrers", models: "ø4.0 m 120 RPM · ø2.0 m 240 RPM",
    shot: "type-rvc-stirrer", w: 1122, h: 591, path: topicPath("stirrers") },
] as const;

/** The chrome slice of the copy object, shared with every other page, so the
 *  header, footer and contact band read the same strings as the landing. */
export const headerCopy = (lang: Lang): HeaderCopy & FooterCopy & BandCopy =>
  copy[lang];

/** The hero backdrop, in the order it plays.
 *
 *  The first frame is the one the band has always opened on and stays the LCP
 *  image — it loads at high priority and is what a visitor sees at t=0. The
 *  three behind it are already in the repository (they carry the chamber
 *  pages) and were picked so each is a different room at a different
 *  exposure: an empty chamber, a powertrain rig under test, a domed SAC, a
 *  fully anechoic room. The cut between them then reads as a change of scene
 *  rather than a change of crop.
 *
 *  The fifth is the reverberation hall, and it is the only one of the five
 *  with a vehicle in it. Four rooms photographed empty say what the company
 *  builds; none of them says what the room is for, and a car on the turntable
 *  under the stirrer does that in one frame. It is also the only image here
 *  that is not already carrying a chamber page — see the note on the WebP in
 *  public/chambers/images.
 *
 *  Subject placement used to decide the shortlist as much as subject did: the
 *  scrim was opaque ink to 42% of the band and only cleared past 78%, so a
 *  frame was only worth adding if what it showed sat right of centre. That
 *  constraint is gone — the wash is translucent the whole way across now (see
 *  `.hero::after`) and a subject at 40% is visible rather than buried, which is
 *  what let the reverberation frame in with its car at mid-frame. What matters
 *  instead is exposure: the wash lightens whatever is under it, so a frame that
 *  is already dark in its left half loses the copy's contrast for everyone.
 *  All five are bright rooms. */
const heroSlides = [
  { src: "/chambers/images/hero-anechoic-chamber.webp", w: 2000, h: 1415 },
  { src: "/chambers/images/ind-powertrain-edtc.webp", w: 1600, h: 1095 },
  { src: "/chambers/images/type-sac-dome.webp", w: 1600, h: 1095 },
  { src: "/chambers/images/type-fac-freespace.webp", w: 1600, h: 1095 },
  { src: "/chambers/images/hero-rvc-vehicle.webp", w: 1533, h: 882 },
];

/** One mark per metric cell, in the order `stats` is written — both locales
 *  carry the same four figures in the same order, so the index is the key.
 *
 *  They exist because the cover is white: on the ink band the four numbers had
 *  a dark field of their own and read as a band without help, and on paper they
 *  are hairlines on white. The head office's own white cover puts a mark in
 *  each cell for the same reason.
 *
 *  Drawn to the site's existing icon grammar rather than a new one — 24-unit
 *  box, stroked, no fill, the weight `.chk` and the accordion caret already
 *  use. What each one shows is the figure beside it: a calendar for the year,
 *  a globe for the countries, a four-pane panel for the share built in-house
 *  (the PAN module every chamber on this site is assembled from), and three
 *  stacked plates for the three solution areas. */
const statMarks: readonly (readonly string[])[] = [
  ["M4.5 6.5h15v13h-15z", "M8.5 3.5v5", "M15.5 3.5v5", "M4.5 11h15"],
  [
    "M12 3.2a8.8 8.8 0 1 0 0 17.6 8.8 8.8 0 0 0 0-17.6z",
    "M3.2 12h17.6",
    "M12 3.2c2.5 2.4 3.9 5.5 3.9 8.8s-1.4 6.4-3.9 8.8c-2.5-2.4-3.9-5.5-3.9-8.8s1.4-6.4 3.9-8.8z",
  ],
  ["M4.5 4.5h15v15h-15z", "M4.5 12h15", "M12 4.5v15"],
  ["M12 3.6 20.6 8 12 12.4 3.4 8z", "M3.4 12 12 16.4l8.6-4.4", "M3.4 16 12 20.4l8.6-4.4"],
];

/* The three bands below the equipment row are the same object — a section
   head, six linked cards three across, and one link out to the branch page —
   so they are one component rather than three copies of the markup that would
   then drift apart. Three across is what makes six read as two full rows;
   four across would strand the last two in a half-empty one.
 *
 *  `path` on a card wins over `goPath`, which is the band's own destination
 *  and the fallback for cards that do not name one. */
type BandCard = {
  readonly name: string;
  readonly models: string;
  readonly shot: string;
  readonly w: number;
  readonly h: number;
  readonly path?: string;
};

function CardBand({
  lang, id, alt, kicker, title, body, cards, bodies, go, goPath,
}: {
  lang: Lang;
  id: string;
  alt?: boolean;
  kicker: string;
  title: string;
  body: string;
  cards: readonly BandCard[];
  bodies: readonly string[];
  go: string;
  goPath: string;
}) {
  return (
    <section className={alt ? "alt" : undefined} id={id}>
      <div className="wrap">
        <div className="sec-head">
          <span className="kicker">{kicker}</span>
          <h2>{title}</h2>
          <p>{body}</p>
        </div>
        <div className="line-grid three">
          {cards.map((c, i) => (
            <SiteLink className="lc" key={c.name} href={localeRoute(lang, c.path ?? goPath)}>
              {/* Decorative, as on the chamber and equipment rows: the h4
                  under the band names the card, and the page it opens
                  describes the same photograph for a screen reader. */}
              <div className="lc-shot lc-shot--photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(`/chambers/images/${c.shot}.webp`)} alt="" width={c.w} height={c.h} loading="lazy" decoding="async" />
              </div>
              <h4>{c.name}</h4>
              <p>{bodies[i]}</p>
              <div className="models">{c.models}</div>
            </SiteLink>
          ))}
        </div>
        <SiteLink className="go sec-go" href={localeRoute(lang, goPath)}>{go}<span aria-hidden="true">→</span></SiteLink>
      </div>
    </section>
  );
}

export default function Landing({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const cs = localeRoute(lang, "/cybershield");
  /* The solutions row, in the order the site map fixes it: chambers,
     CyberShield and absorbers on the first line, stirrers, e-drive systems and
     test systems on the second. The grid is three columns wide (see
     `.sol-grid`), so the two lines are the two halves of this list and nothing
     in the CSS had to change to hold them.

     It is a list rather than six written-out cards because every one of them
     is the same card — the same picture band, heading, sub-label, paragraph
     and three-line list. Six copies of that markup is six places to keep in
     step, which is what the chamber and equipment rows below already avoid.

     The type annotation is here rather than `as const` because the entries are
     not the same shape: only CyberShield carries an `id` (the nav links to
     #cybershield) and only it needs no `aria` — its link already names where it
     goes, where the other five say "자세히 보기" and have to name the card. An
     inferred union would make `c.id` unreachable on the five that lack it. */
  const solutionCards: {
    h: string; sub: string; p: string; list: readonly string[];
    shot: { src: string; w: number; h: number; kind: string };
    href: string; go: string; aria?: string; id?: string;
  }[] = [
    { h: t.c1h, sub: t.c1sub, p: t.c1p, list: t.c1list, shot: solutionShots.chambers,
      href: localeRoute(lang, chambersPath), go: t.more, aria: `${t.c1h} — ${t.more}` },
    { h: "CyberShield", sub: t.c3sub, p: t.c3p, list: t.c3list, shot: solutionShots.cybershield,
      href: cs, go: t.c3go, id: "cybershield" },
    { h: t.c4h, sub: t.c4sub, p: t.c4p, list: t.c4list, shot: solutionShots.absorbers,
      href: localeRoute(lang, topicPath("frankosorb")), go: t.more, aria: `${t.c4h} — ${t.more}` },
    { h: t.c5h, sub: t.c5sub, p: t.c5p, list: t.c5list, shot: solutionShots.stirrers,
      href: localeRoute(lang, topicPath("stirrers")), go: t.more, aria: `${t.c5h} — ${t.more}` },
    { h: t.c6h, sub: t.c6sub, p: t.c6p, list: t.c6list, shot: solutionShots.edrive,
      href: localeRoute(lang, industryPath("powertrain")), go: t.more, aria: `${t.c6h} — ${t.more}` },
    { h: t.c2h, sub: t.c2sub, p: t.c2p, list: t.c2list, shot: solutionShots.testSystems,
      href: localeRoute(lang, testSystemsPath), go: t.more, aria: `${t.c2h} — ${t.more}` },
  ];
  return (
    <>
      {/* Standards below are the ones the chamber and equipment cards name
          further down this page — the markup restates them, it does not add
          claims. */}
      <StructuredData
        lang={lang}
        page="landing"
        description={t.heroP}
        productLines={[
          {
            id: "anechoic-chambers",
            name: "Frankonia Anechoic Chambers",
            description: t.c1p,
            standards: [
              "ECE R10", "CISPR 25", "ISO 11452", "MIL-STD-461", "DO-160",
              "CISPR 16-1-4", "IEC/EN 61000-4-3", "IEC/EN 61000-4-21", "EN 50147-1",
            ],
          },
          {
            id: "emc-test-systems",
            name: "Frankonia EMC Test Systems",
            description: t.c2p,
            standards: ["CISPR 16-1-1", "IEC/EN 61000-4-6", "ISO 11452-4", "MIL-STD-461"],
          },
        ]}
      />
      <SiteHeader lang={lang} t={t} />

      <main id="main">
      <div className="hero" id="top">
        {/* The chambers behind the headline. Decorative — the h1 says what the
            company does and these say what that looks like; naming them in alt
            would only put a caption in front of the sentence they illustrate.
            <img> rather than CSS backgrounds so the first frame is in the HTML
            the browser parses first: it is the largest thing on the page and
            wants to start downloading before the stylesheet resolves.

            The other three are 610 KB between them and nobody sees any of it
            for seven seconds — each slide holds for nine (see `hero-cycle` in
            globals.css), and until its turn comes it waits underneath this one,
            fully covered. So they are marked low *and* lazy: `low` orders them
            behind the frame that is actually on screen, and `lazy` keeps them
            out of the preload scanner's first batch, where they were competing
            with the largest paint on the page, the stylesheet and the fonts for
            the same few connections. Lazy does not risk a blank slide — they
            are in the viewport, so the first layout starts them, which is six
            seconds of headroom.

            The wrapper is what keeps the scrim on top. The slides carry
            z-index to order the cross-dissolve (see `.hero-media` in
            globals.css); without a stacking context of their own they would
            also climb over `.hero::after`, and the headline would lose the
            contrast that overlay exists to guarantee. */}
        <div className="hero-media">
          {heroSlides.map((slide, i) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={slide.src}
              className="hero-shot"
              src={asset(slide.src)}
              alt=""
              width={slide.w}
              height={slide.h}
              fetchPriority={i === 0 ? "high" : "low"}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
            />
          ))}
        </div>
        <div className="wrap hero-in">
          <span className="tag">{t.heroTag}</span>
          <h1>
            {t.heroH1a}
            <br />
            <em>{t.heroH1b}</em>
            {t.heroH1c}
          </h1>
          <p>{t.heroP}</p>
          <div className="btns">
            <a className="btn btn-red" href="#solutions">{t.heroB1}</a>
            {/* The contact page rather than the band at the foot of this one:
                the reader who presses "견적·기술 상담" in the hero is asking who
                to write to, and scrolling them past six sections to a mail
                link was the long way round to a worse answer.

                `btn-outline`, not `btn-ghost`: the ghost pill's border is white
                and the cover is white now. Same geometry, same weight, a border
                that exists. */}
            <SiteLink className="btn btn-outline" href={localeRoute(lang, contactPath)}>{t.heroB2}</SiteLink>
          </div>
        </div>
        <div className="wrap hero-stats">
          {t.stats.map(([num, label], i) => (
            <div className="st" key={label}>
              <div className="st-top">
                {/* Decorative: the number and its caption already say what the
                    cell is, and a glyph named in the accessibility tree would
                    only put "calendar" in front of "1987". */}
                <svg className="st-ico" viewBox="0 0 24 24" aria-hidden="true">
                  {statMarks[i].map((d) => <path key={d} d={d} />)}
                </svg>
                <b>{num}</b>
              </div>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <section id="solutions">
        <div className="wrap">
          <div className="sec-head">
            <span className="kicker">{t.solK}</span>
            <h2>{t.solH}</h2>
            <p>{t.solP}</p>
          </div>
          <div className="sol-grid">
            {solutionCards.map((c) => (
              <div className="sol" key={c.h} id={c.id}>
                {/* Decorative, on the same reasoning as the chamber cards' band:
                    the h3 under it names the category, and a screen reader
                    reading a description of the chamber before the word "챔버"
                    puts a caption in front of the sentence it illustrates. The
                    pictures are described where they carry their own page. */}
                <div className={`thumb thumb--${c.shot.kind}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset(c.shot.src)} alt="" width={c.shot.w} height={c.shot.h} loading="lazy" decoding="async" />
                </div>
                <div className="body">
                  <h3>{c.h} <span className="sub-label">{c.sub}</span></h3>
                  <p>{c.p}</p>
                  <ul>{c.list.map((li) => <li key={li}>{li}</li>)}</ul>
                  {/* The trailing glyph is its own element so it can lean out of
                      the link on hover, as it does on the reference page. */}
                  {/* Each card opens the branch overview, not this page's own
                      band further down. The bands below are previews of the
                      branches; "read more" should leave the landing page, not
                      scroll it. */}
                  {/* `go--card` stretches this link's hit area over the whole
                      card (see globals.css). The card was already promising a
                      click — it lifts and turns its heading red on hover — but
                      only these two words took one. The label names the
                      destination because the link is now the card: "자세히 보기"
                      on its own tells a screen-reader user nothing about which
                      of the six cards they are on. CyberShield passes no label:
                      its link already says where it goes. */}
                  <SiteLink className="go go--card" href={c.href} aria-label={c.aria}>{c.go}<span aria-hidden="true">→</span></SiteLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="alt" id="chambers">
        <div className="wrap">
          <div className="sec-head">
            <span className="kicker">CHAMBERS</span>
            <h2>{t.chH}</h2>
            <p>{t.chP}</p>
          </div>
          <div className="line-grid three">
            {chamberCards.map((c, i) => (
              <SiteLink className="lc" key={c.name} href={localeRoute(lang, c.path)}>
                <div className={`lc-shot lc-shot--${c.shot.kind}`}>
                  {/* Decorative: the heading beside it already names the
                      category, and a screen reader repeating "cutaway of an
                      automotive chamber" under the word Automotive is noise.
                      The pictures are described in the asset ledger. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset(c.shot.src)} alt="" width={c.shot.w} height={c.shot.h} loading="lazy" decoding="async" />
                </div>
                <h4>{c.name}</h4>
                <p>{t.chambers[i]}</p>
                <div className="models">{c.models}</div>
              </SiteLink>
            ))}
          </div>
        </div>
      </section>

      <section id="equipment">
        <div className="wrap">
          <div className="sec-head">
            <span className="kicker">TEST SYSTEMS</span>
            <h2>{t.eqH}</h2>
            <p>{t.eqP}</p>
          </div>
          <div className="line-grid three">
            {/* Paired with its index before the filter, not after: `t.eq` is
                written against the full six and a card that moved up when the
                one above it was hidden would take the paragraph of a family it
                is not. See the note on `show` in `equipCards`. */}
            {equipCards
              .map((c, i) => ({ c, i }))
              .filter(({ c }) => c.show)
              .map(({ c, i }) => (
                <SiteLink className="lc" key={c.name} href={localeRoute(lang, c.path)}>
                  {/* Decorative, as on the chamber row above: the h4 under the
                      band names the family, and a screen reader reading "a horn
                      antenna on a mounting tube" before the word Antennas puts a
                      caption in front of the sentence it illustrates. The
                      instruments are described where they carry their own page,
                      and in the asset ledger. */}
                  <div className={`lc-shot lc-shot--${c.shot.kind}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={asset(c.shot.src)} alt="" width={c.shot.w} height={c.shot.h} loading="lazy" decoding="async" />
                  </div>
                  <h4>{c.name}</h4>
                  <p>{t.eq[i]}</p>
                  <div className="models">{c.models}</div>
                </SiteLink>
              ))}
          </div>
        </div>
      </section>

      <CardBand
        lang={lang} id="shielding" alt
        kicker={t.stK} title={t.stH} body={t.stP}
        cards={standardCards} bodies={t.st}
        go={t.stGo} goPath={topicPath("shielding-gates")}
      />

      <CardBand
        lang={lang} id="absorbers"
        kicker={t.abK} title={t.abH} body={t.abP}
        cards={absorberCards} bodies={t.ab}
        go={t.abGo} goPath={topicPath("frankosorb")}
      />

      <CardBand
        lang={lang} id="automation" alt
        kicker={t.auK} title={t.auH} body={t.auP}
        cards={automationCards} bodies={t.au}
        go={t.auGo} goPath={topicPath("automation")}
      />

      <section id="why">
        <div className="wrap">
          <div className="trust">
            <div>
              <span className="kicker">{t.trK}</span>
              <h2>
                {t.trH1}
                <br />
                <em>{t.trH2}</em>
                {t.trH3}
              </h2>
              <p>{t.trP1}</p>
              <p>{t.trP2}</p>
              <p>{t.trP3}</p>
              {/* The band makes a claim about the company and then left the
                  reader with nowhere to check it. About is where the Company
                  section opens. */}
              <SiteLink className="go" href={localeRoute(lang, sectionPath("about"))}>
                {t.trGo}<span aria-hidden="true">→</span>
              </SiteLink>
            </div>
            <div className="badges">
              {t.badges.map(([b, s]) => (
                <div className="bd" key={s}>
                  <b>{b}</b>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The closing statement, the same band every sub-page ends on — the
          landing page builds its own chrome instead of going through
          `PageShell`, so it draws the band itself. The sentence is in
          page-closing.ts under "/" with the other sixty-odd. */}
      <section className="closing">
        <div className="wrap">
          <div className="statement">
            <p>{closingLine(lang, "/")}</p>
          </div>
        </div>
      </section>

      <ContactBand lang={lang} t={t} />
      </main>

      <SiteFooter lang={lang} t={t} />
    </>
  );
}
