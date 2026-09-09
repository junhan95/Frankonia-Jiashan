import { CheckColumn } from "./page-parts";
import PageShell, { type HeadShot } from "./page-shell";
import StructuredData from "./structured-data";
import { sectionMeta, sectionPath, type CompanySection } from "./company-sections";
import { closingLine } from "./page-closing";
import { asset, contactEmail, type Lang } from "./site-config";

/* Every section here is carried over from the head office site section by
   section: the English is its own wording, the Korean a translation of it.
   The original text and the asset provenance are recorded per page in
   docs/source/company-*.md — read the ledger before editing any copy below.

   Nothing is invented to fill a gap. Where the head office publishes no data
   — the events calendar is empty today — the page says so through
   `EmptyState`, and the list fills in without a layout change. */
const copy = {
  zh: {
    /* Philosophy and History are one page. Their two copy blocks are one
       object, in the order the page renders them: the philosophy head and its
       two bands, then the history narrative, the group timeline and the
       milestones. The closing line the page ends on is in page-closing.ts with
       every other page's, and `PageShell` draws it. Nothing is rewritten for the
       merge — the only line dropped is History's own intro, which repeated the
       last paragraph of `storyClose` word for word and would now sit two
       screens above it. */
    about: {
      eyebrow: "ABOUT",
      title: "未来在全世界都有效的解决方案",
      intro:
        "Frankonia 是汽车和工业领域电磁兼容性 (EMC) 测试的电波暗室和测试系统领域公认的高度专业化的技术公司。",
      approachKicker: "COMPLETE SOLUTIONS",
      approachTitle: "项目各阶段的专业性",
      approachBody: [
        "基于专业知识、灵活性、质量和高技术水平，我们在世界各地创建面向未来的解决方案。",
        "在建设 EMC 测试设施方面，Frankonia 是完整解决方案的首选提供商。我们与客户一起规划、协调和定义满足当今标准以及未来标准的定制解决方案。我们秉承将 EMC 实验室视为一个整体的政策，在项目的每个阶段提供卓越的专业知识。",
        "Frankonia的项目业务由自己的项目管理、工程和生产、领先的研究以及自己的安装和服务团队完成。因此我们可以保证高水平的技术和质量。",
      ],
      figureAlt: "印有 Frankonia 标记的 Frankosorb® 金字塔形吸收体特写照片",
      figureCaption: "Frankosorb® — 通过内部工程和生产创建的吸波材料技术。",
      commitKicker: "OUR COMMITMENT",
      commitTitle: "一切都在一处",
      standsFor: {
        head: ["Frankonia ", "追求"],
        items: [
          "定制设计的电波暗室",
          "独立设计的EMC测试系统",
          "顶级品质",
          "最新技术",
          "可靠性",
          "独特的吸收体",
          "面向未来的解决方案",
        ],
      },
      provides: {
        head: ["Frankonia ", "我们提供什么"],
        items: [
          "电波暗室及测试系统",
          "交钥匙解决方案",
          "项目各个阶段的专业知识",
          "单一来源提供的一切",
          "内部工程和生产",
          "全球网络和世界各地的活动",
        ],
      },
      historyKicker: "HISTORY",
      historyTitle: "1987年……成功故事的开始",
      // 원문 8문단. 6번째(95%)는 callout으로, 나머지는 순서 그대로.
      storyLead: [
        "Frankonia 最初成立是为了生产和贸易各行业的化学和电化学产品。从一开始，在 Wolfgang Opitz 的指导下，自己的实验室和深入研究就成为公司的固有组成部分。从早期阶段开始，产品范围迅速扩展到电磁脉冲室和掩体，如今已成为电波暗室和屏蔽室电磁屏蔽的基本标准。",
        "早期，科隆大学的 Nimtz 教授对具有吸收性能的替代表面的研究为开发独特的 Frankosorb® 吸波材料技术提供了起点。经过在 Heideck 单独开发的测试设备一年多的研究后，Nimtz 和 Enders 教授（布伦瑞克工业大学 EMC 研究所）开发出了 Frankonia 的第一代 Frankosorb® 金字塔吸波器。工业与科学之间的合作利用专有的纳米薄膜技术实现了不燃吸波材料的工业化生产。",
        "当时投放市场的全新吸波技术至今仍具有出色且无与伦比的性能。",
      ],
      storyRest: [
        "20世纪90年代中期EMC实验室验证标准的变化，使Frankonia的生产资源、Frankosorb®吸波材料的性能及其不燃的特殊性能得到了全面的优势。这样，Frankonia 对吸波材料的研发为公司的成功做出了本质贡献。",
        "Frankonia波兰有限公司1990年在波兰Dzierzoniow成立，以扩大产能。 z o.o.成立。除了电波暗室业务外，该公司还于 1992 年通过 EMC 测试系统扩展了产品组合，目前是德国福希海姆 Frankonia EMC Test-Systems GmbH 的股东。随着20世纪90年代末亚洲市场份额的增长，公司于2003年在上海附近的嘉善成立了嘉善FrankoniaEMC有限公司，以增加产能。",
      ],
      storyClose: [
        "Frankonia 在复杂电磁世界的 EMC 测试实验室中的未来重点是单个产品和完整解决方案的优化和易用性。我们自己实验室中现有材料的研究和开发仍然是 Frankonia 的核心。此外，客户对单独电磁测量以及车辆电气化和物联网等最新和未来技术的特定需求需要安全、合规的实施。因此，使产品、测试系统和整个测试实验室适应多学科需求是一项值得欢迎的挑战。我们很高兴与我们的专家团队一起完成这项工作。",
        "Frankonia将其成就归功于“德国制造”的品质和技术以及不断的研发。以下是 Frankonia 在过去几十年提供定制解决方案过程中的一些值得注意的里程碑。",
      ],
      callout:
        "如今，Frankonia 集团利用自己的生产能力，采用模块化预制方法设计和生产了大约 95% 的零件和产品。这确保了一致的质量和最大的灵活性，以及​​不断适应最新的科学技术水平。",
      earlyFigureAlt:
        "初始屏蔽结构数据照片——通道和金字塔吸波体清晰可见",
      earlyFigureCaption: "初始屏蔽结构。这是印刷材料照片的重拍。",
      archFigureAlt:
        "天线室内部——拱形定位器下方的蓝色和黑色金字塔吸波器",
      archFigureCaption: "当前一代天线室。拱形定位器和 Frankosorb® 吸波材料。",
      groupKicker: "FRANKONIA GROUP",
      groupTitle: "公司历史",
      groupFacts: [
        ["1987", "成立"],
        ["5", "基地"],
        ["80+", "供货国家"],
        ["100%", "交钥匙解决方案"],
      ],
      groupEntries: [
        ["1987", "Frankonia GmbH 成立，总部位于德国海德格"],
        ["1990", "Frankonia波兰有限公司z o.o.成立（波兰）"],
        ["1992", "Frankonia EMC Test-Systems GmbH 在德国福希海姆成立"],
        ["1998", "收购SIDT欧洲"],
        ["2003", "嘉善Frankonia电磁兼容有限公司成立（中国）"],
        ["2009", "改制为Frankonia Group International"],
        ["2013", "Frankonia泰国销售法人成立（中亚）"],
        ["2015", "Frankonia惠泽销售公司成立（中国）"],
        ["2017", "Frankonia India EMC Solutions Pvt.有限公司成立（印度）"],
        ["2017", "Frankonia 德国 EMC Solution GmbH 成立 30 周年暨 Frankonia EMC Test-Systems GmbH 成立 25 周年"],
      ],
      milestonesKicker: "MILESTONES",
      milestonesTitle: "产品/技术里程碑",
      milestones: [
        ["1991", "PAN-TYPE模块化预制EMC屏蔽"],
        ["1991", "首创薄膜吸收技术"],
        ["1992", "利用 EMC 测试系统扩大产品范围"],
        ["1993", "首个不可燃Frankosorb®吸收塔项目"],
        ["1995", "成为EMC测试设备解决方案提供商的第一步"],
        ["1998", "新一代10.0m暗室采用长金字塔吸波器和混合吸波器"],
        ["2003", "新型定位装置（如转盘）"],
        ["2003", "在中国设立生产销售基地"],
        ["2007", "新一代暗室SAC-3 Plus，采用圆顶形天花板设计"],
        ["2007", "A2级Frankosorb®混合吸波材料"],
        ["2011", "新一代屏蔽门及平台"],
        ["2012", "新一代暗室FAC-3"],
        ["2012", "军用减震器更新"],
        ["2014", "动力总成部件全新测试解决方案——电驱动测试室（EDTC）"],
        ["2014", "新一代转盘/控制器/驱动单元"],
        ["2015", "新一代EMC暗室SAC-10 Plus Triton，可进行多轴测试"],
        ["2015", "门系统和灯更新"],
        ["2016", "SAC-5 Plus – 熟悉的圆顶天花板设计的扩展解决方案"],
        ["2016", "BlueBox移动负载装置"],
        ["2016", "新型定位装置（如视轴天线杆、移动转台）"],
        ["2016", "用于EMI/EMS测试的地板吸波板"],
        ["2017", "A2级混合Frankosorb®新一代吸波材料"],
        ["2018", "电驱动液压加载装置"],
        ["2020", "用于天线室的新型吸波器 – A2 级 P1400HF-A2 Frankosorb® 吸波器"],
        ["2021", "全新混合减振器系列推出——A2级Frankosorb® H1300涡轮减振器"],
      ],
    },
    publications: {
      eyebrow: "PUBLICATIONS",
      title: "关于吸收体和电波暗室的论文",
      intro:
        "这些是 Frankonia 的研究人员和合作大学发表的论文和贡献。标题和参考书目遵循出版时的注释，以便您搜索原文。",
      listKicker: "BIBLIOGRAPHY",
      listTitle: "论文列表",
      printKicker: "IN PRINT",
      printTitle: "论文中的Frankonia",
      printAlts: [
        "一张从报纸页面拍摄的照片——其中包括一张放置在电波暗室内的车辆的照片。",
        "该论文的两份单独副本的照片",
        "照片取自行业杂志页面 — Frankonia 广告",
      ],
      printCaptions: [
        "当地报纸页面——“Mit Pyramiden auf Strahlen…”，一篇关于希德克的Frankonia建造吸收大厅的文章。",
        "该论文的两份单独副本——上面列表中的编号 2 和 8。",
        "日本行业杂志刊登Frankonia广告。",
      ],
    },
    events: {
      eyebrow: "EVENTS",
      title: "参加展览和研讨会",
      intro:
        "为了介绍产品和解决方案并扩大与世界各地客户和未来客户的关系，Frankonia 定期参加展览和研讨会等活动。",
      meetKicker: "MEET US",
      meetTitle: "在活动中遇见Frankonia",
      meetBody:
        "如果您对我们的解决方案感兴趣并希望了解有关 Frankonia 的更多信息，我们希望在以下日期之一与您会面。",
      figureAlt: "展厅Frankonia展位——红色拱门、标志墙、白色展台上的EMC仪器",
      figureCaption: "展厅内的Frankonia展位。",
      listKicker: "SCHEDULE",
      listTitle: "计划行程",
      entries: [] as readonly (readonly [string, string])[],
      pendingTitle: "目前没有公布预定的活动。",
      pendingBody:
        "下次赛程一经确定，将在此公告。如果您想提前确认您的参与计划，请通过电子邮件与我们联系。",
      cta: "行程查询",
    },
  },
  en: {
    about: {
      eyebrow: "ABOUT",
      title: "Future-proof solutions on a global scale",
      intro:
        "Frankonia is recognized as a highly specialized technology corporation for EMC anechoic chambers and test systems within the automotive and industrial sector for testing of electromagnetic compatibility.",
      approachKicker: "COMPLETE SOLUTIONS",
      approachTitle: "Expertise in every phase of a project",
      approachBody: [
        "With our expertise, flexibility, quality and a high degree of technology, we generate future-proof solutions on a global scale.",
        "Frankonia is the preferred supplier for complete solutions when it comes to the implementation of EMC test facilities. We plan, coordinate, and define customized solutions with and for our customers that meet today’s and future standards. Because of our commitment to provide holistic EMC lab solutions we offer outstanding expertise in every phase of a project.",
        "Frankonia’s project business convinces with its own project management, engineering and production, a trend-setting research, as well as an own installation and service team. So, we make sure to provide a high level of technology and quality.",
      ],
      figureAlt: "Close-up of a Frankosorb® pyramidal absorber, embossed with the Frankonia mark",
      figureCaption: "Frankosorb® — absorber technology engineered and produced in-house.",
      commitKicker: "OUR COMMITMENT",
      commitTitle: "Everything from one source",
      standsFor: {
        head: ["Frankonia ", "stands for"],
        items: [
          "Customized anechoic chambers",
          "Individual EMC test systems",
          "Highest quality",
          "Latest technology",
          "Reliability",
          "Unique absorbers",
          "Future-proof solutions",
        ],
      },
      provides: {
        head: ["Frankonia ", "provides"],
        items: [
          "Anechoic Chambers and Test Systems",
          "Turnkey solutions",
          "Expertise in every stage of a project",
          "Everything from one source",
          "Own engineering and manufacturing",
          "Global presence and worldwide activity",
        ],
      },
      historyKicker: "HISTORY",
      historyTitle: "1987 … the start of a success story",
      // The source's eight paragraphs. The sixth (the 95% figure) is lifted
      // into the callout; the rest keep their order. Wording is the head
      // office's own, including `In the late early,` and `a continuously
      // research` — see docs/source/company-history.md §2.1.
      storyLead: [
        "Originally, the company Frankonia has been established for the production and trading with chemical and electrochemical products for different industries. From the beginning and under the guidance of Wolfgang Opitz, an own laboratory and the intensive research has been an inherent part of Frankonia. In an early stage, the product range quickly expanded for EMP protected rooms and bunkers, which is the fundamental standard of today’s electromagnetic shielding for anechoic chambers and shielded rooms.",
        "In the late early, Prof. Nimtz from the University of Cologne with his research on alternative surfaces with absorbent characteristics gave the initial idea to develop the unique Frankosorb® absorber technology. Having a special developed test facility in Heideck to research for more than one year, Prof. Nimtz and Prof. Enders (Institute for EMC at TU Braunschweig) made it possible to develop the first generation of Frankonia’s Frankosorb® pyramid absorbers. The cooperation of industry with science successfully realized an industrial manufacturing of non-combustible absorbers using the unique nano-thinfilm technology.",
        "At that time, a completely new absorber technology has been brought to the market that offers still today outstanding and unique attributes.",
      ],
      storyRest: [
        "Normative changes for the verification of EMC laboratories in the mid-nineties led to considerable advantages that overall benefited Frankonia’s resources in manufacturing, the performance of Frankosorb® absorbers, and the special non-combustible characteristic. Thus, Frankonia’s research and development on absorbers has essentially contributed to the success of the company.",
        "To expand the manufacturing capacities, the Frankonia Poland Sp. z o.o. located in Dzierżoniów (Poland) has been established in 1990. In addition to the anechoic chamber business, Frankonia expanded in 1992 its product portfolio with EMC test systems and is today shareholder of the Frankonia EMC Test-Systems GmbH located in Forchheim (Germany). With the growing market share in Asia in the late nineties and to increase manufacturing capacities, Frankonia established in 2003 the Jiashan Frankonia EMC Co., Ltd. located in Jiashan near Shanghai (China).",
      ],
      storyClose: [
        "The future of Frankonia in the complex electromagnetic world of EMC test laboratories focuses on the optimization and easier usability of individual products as well as complete solutions. The research and development of existing materials in the own laboratory remains intense part of Frankonia. Furthermore, specific requirements of our customers for their individual electromagnetic measurements, as well as latest and future technologies, for instance, the electrification of vehicles or IoT, require a safe and compliant implementation. So, the adaptation of products, test systems, and complete laboratories to multidisciplinary requirements is a welcome challenge. With our professional team, we gladly look forward to that.",
        "Frankonia contributes its success to quality and technology along the classification of ‘Made in Germany’, paired with a continuously research and development. Over the past decades, Frankonia’s ambitions to provide customized solutions, some milestones are worth mentioning.",
      ],
      callout:
        "Today, the Frankonia Group engineers and manufactures approximately 95% of all components and products in a modular and prefabricated construction technique using its own manufacturing capabilities. Herewith, Frankonia guarantees consistent quality, maximum flexibility paired with a continuous adaptation to the current state-of-the-art of science and technology.",
      earlyFigureAlt:
        "Archive photograph of an early shielded structure, with a walkway and pyramidal absorbers",
      earlyFigureCaption: "An early shielded structure, photographed from a print.",
      archFigureAlt:
        "Inside an antenna chamber — blue and black pyramidal absorbers under an arch positioner",
      archFigureCaption:
        "A current-generation antenna chamber, with an arch positioner and Frankosorb® absorbers.",
      groupKicker: "FRANKONIA GROUP",
      groupTitle: "Company timeline",
      groupFacts: [
        ["1987", "Founded"],
        ["5", "Locations"],
        ["80+", "Countries"],
        ["100%", "Turnkey solutions"],
      ],
      groupEntries: [
        ["1987", "Company foundation of Frankonia GmbH headquartered in Heideck (GERMANY)"],
        ["1990", "Company foundation of Frankonia Poland Sp. z o.o. (POLAND)"],
        ["1992", "Company foundation of Frankonia EMC Test-Systems GmbH in Forchheim (GERMANY)"],
        ["1998", "Acquisition of SIDT Europe"],
        ["2003", "Company foundation of Jiashan Frankonia EMC Co. Ltd. (CHINA)"],
        ["2009", "Transformation into Frankonia Group International"],
        ["2013", "Company foundation of Frankonia Thailand – Sales Unit (CENTRAL ASIA)"],
        ["2015", "Company foundation of Frankonia Huize – Sales Unit (CHINA)"],
        ["2017", "Company foundation of Frankonia India EMC Solutions Pvt. Ltd. (INDIA)"],
        ["2017", "30-Year Anniversary of Frankonia Germany EMC Solution GmbH & 25-Year Anniversary of Frankonia EMC Test-Systems GmbH"],
      ],
      milestonesKicker: "MILESTONES",
      milestonesTitle: "Product and technology milestones",
      milestones: [
        ["1991", "PAN-TYPE modular and prefabricated EMC shielding"],
        ["1991", "First thin-film absorber technology"],
        ["1992", "Enlarge product scope with EMC test systems"],
        ["1993", "First non-combustible Frankosorb® absorber project"],
        ["1995", "First step as solution provider including EMC testing equipment"],
        ["1998", "New generation of 10.0 m chambers with long-pyramid absorbers and hybrid absorbers"],
        ["2003", "New positioning devices (e.g. turntables)"],
        ["2003", "Setup Frankonia manufacturing and sales in China"],
        ["2007", "New chamber generation SAC-3 Plus with dome shape roof design"],
        ["2007", "Frankosorb® hybrid absorbers in A2"],
        ["2011", "New generation of shielded doors and platforms"],
        ["2012", "New chamber generation FAC-3"],
        ["2012", "Update on MIL absorbers"],
        ["2014", "New testing solutions for powertrain components – E-Drive Testing Chamber (EDTC)"],
        ["2014", "New generation of turntables, controller and drive units"],
        ["2015", "New generation of EMC chamber: SAC-10 Plus Triton with multiple test axes"],
        ["2015", "Update door systems and ramps"],
        ["2016", "SAC-5 Plus – extended solution of the well-known dome shape roof design"],
        ["2016", "BlueBox Mobile Load Machine"],
        ["2016", "New positioning devices (e.g. Boresight antenna mast, mobile turntables)"],
        ["2016", "Floor-absorberboard for EMI/EMS testing"],
        ["2017", "New generation of hybrid Frankosorb® absorbers in A2"],
        ["2018", "E-Drive Hydraulic Load Machine"],
        ["2020", "New absorbers for Antenna Chambers, the P1400HF-A2 Frankosorb® absorber in A2"],
        ["2021", "New hybrid absorbers series launched, the Frankosorb® H1300 Turbine absorber in A2"],
      ],
    },
    publications: {
      eyebrow: "PUBLICATIONS",
      title: "Published research on absorbers and anechoic chambers",
      intro:
        "Papers and articles published by Frankonia’s researchers and their university partners. Titles and citations follow the published form, so each one stays findable.",
      listKicker: "BIBLIOGRAPHY",
      listTitle: "Papers and articles",
      printKicker: "IN PRINT",
      printTitle: "Frankonia in print",
      printAlts: [
        "A photograph of a newspaper page, carrying a picture of a vehicle inside an anechoic chamber",
        "A photograph of two paper offprints",
        "A photograph of a trade magazine page carrying a Frankonia advertisement",
      ],
      printCaptions: [
        "A local newspaper page — “Mit Pyramiden auf Strahlen…”, on Frankonia of Heideck building absorber halls.",
        "Two offprints — papers 2 and 8 in the list above.",
        "A Frankonia advertisement in a Japanese trade magazine.",
      ],
    },
    events: {
      eyebrow: "EVENTS",
      title: "We regularly take part in exhibitions and seminars",
      intro:
        "To introduce you our products and solutions, and to improve the relationship with our customers and future customers all over the world, we regularly participate on events like exhibitions and seminars.",
      meetKicker: "MEET US",
      meetTitle: "Visit us at one of our events",
      meetBody:
        "If you are interested in our solutions and want to learn more about Frankonia’s, please visit us at one of the following events.",
      figureAlt:
        "A Frankonia stand at a trade fair — a red arch gate and logo wall, EMC instruments on white plinths",
      figureCaption: "The Frankonia stand at a trade fair.",
      listKicker: "SCHEDULE",
      listTitle: "Upcoming",
      entries: [] as readonly (readonly [string, string])[],
      pendingTitle: "No events are currently announced",
      pendingBody:
        "Dates are announced here as soon as they are confirmed. In the meantime, ask by email if you want to know where we will be.",
      cta: "Ask about dates",
    },
  },
} as const;

/**
 * The bibliography from the head office's Publications page. Not part of
 * `copy`, because it is not translated: a citation has to stay findable, so
 * both locales show the title and the reference exactly as published — the
 * German quotation marks included.
 */
const citations = [
  ["„Elektromagnetische Absorber aus mesoskopischen Metallschichten”", "G. Nimtz und A. Enders, Physik in unserer Zeit, 27, 1996, pp. 38 – 40"],
  ["„Real Performance of Semi-Anechoic Chambers Depending on Absorber Technology”", "A. Enders, Transactions/Journal: 1996 IEEE Int’l Symposium on Electromagnetic Compatibility Santa Clara, CA, August 19-23, 1996, Vol. 1 Issue:1, pp. 146 – 150"],
  ["„Advancements in Anechoic Chambers”", "A. Enders, ITEM 1996, The International Journal of EMC (by Robar Industries, Inc.; R&B Enterprise Division), pp. 154 – 158 and 244 – 248"],
  ["„Freespace-Korrelation im Frequenzbereich 1-18 GHz”", "R. Schaller, U. Panten, K. Ruffing, EMC Kompendium 1998, pp. 178 – 180"],
  ["„Reproduzierbarkeiten bei gestrahlten EMV-Messungen”", "A. Enders, J. Leopold, U. Panten, Elektromagnetische Verträglichkeit/EMV 98, 6. Int. Fachmesse und Kongreß für Elektromagnetische Verträglichkeit, Düsseldorf; Hrsg. A. Schwab, vde-Verlag, 1998, pp. 681-686"],
  ["„Correlation of free space attenuation in anechoic chambers at 1-18GHz”", "R. Schaller, U. Panten, K. Ruffing, EMC Engineering Europe June/July 1999, pp. 9 – 13"],
  ["„Störstrahlung verlässlich bestimmen”", "C. Römer, E&E September 2008, pp. 62 – 64"],
  ["„Broad band electromagnetic wave absorbers designed with nano-metal films”", "G. Nimtz and U. Panten, Ann. Physik (Berlin) Vol. 19, 2010, pp. 53 – 59"],
  ["„Novel broad band electromagnetic wave absorber designed with nano-metal films”", "G. Nimtz and U. Panten, Conference Proceedings, INCEMIC 2010, Bangalore, India, pp. 181 – 184"],
  ["„Effective Lösungen für moderne Absorberhallen”", "U. Panten, E&E, Kompendium 2011, pp. 266 – 268"],
  ["„Novel broad band electromagnetic wave absorber designed with nano-metal films”", "G. Nimtz and U. Panten, Electronic Environment #1.2011, Sweden, pp. 20 – 22"],
] as const;

/** Section head: red eyebrow over a Light heading (design reference §4.2-1). */
function SectionHead({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="sec-head">
      <span className="kicker">{kicker}</span>
      <h2>{title}</h2>
    </div>
  );
}

/** A run of body paragraphs where the source gives no other structure. */
function Prose({ paras }: { paras: readonly string[] }) {
  return (
    <div className="prose">
      {paras.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </div>
  );
}

/** A photograph carried over from the head office site, with its caption. */
function Figure({
  src,
  alt,
  caption,
  width,
  height,
  className = "figure",
}: {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  className?: string;
}) {
  return (
    <figure className={className}>
      {/* Raw <img>, as everywhere else on the site: the static export runs with
          images.unoptimized, so next/image would emit this same tag with more
          machinery around it — and a raw tag does not get basePath rewriting,
          hence asset(). */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset(src)} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

/** Index, heading, and an optional meta line — a year and its milestone, or a
 *  citation, or a vacancy with its two links. */
function EntryList({
  entries,
}: {
  entries: readonly (readonly [string, string])[];
}) {
  return (
    <div className="entry-list">
      {entries.map(([index, text], i) => (
        <div className="entry" key={`${index}-${i}`}>
          <span className="entry-idx">{index}</span>
          <h4>{text}</h4>
        </div>
      ))}
    </div>
  );
}

/** Shown wherever a list is real but not yet populated, so the page reads as
 *  deliberately empty rather than broken. */
function EmptyState({
  title,
  body,
  cta,
  subject,
}: {
  title: string;
  body: string;
  cta: string;
  subject: string;
}) {
  return (
    <div className="empty">
      <h4>{title}</h4>
      <p>{body}</p>
      <a className="btn btn-red" href={`mailto:${contactEmail}?subject=${encodeURIComponent(subject)}`}>
        {cta}
      </a>
    </div>
  );
}

export default function CompanyPage({
  lang,
  section,
}: {
  lang: Lang;
  section: CompanySection;
}) {
  return (
    <>
      <StructuredData
        lang={lang}
        page="company"
        section={section}
        description={sectionMeta[lang][section].description}
      />
      <CompanyBody lang={lang} section={section} />
    </>
  );
}

/* The head band of About, which is where the Company menu opens.
   The drone shot of Großenseebach: five buildings, the solar roofs and the
   village behind them. The page's own subject is what the company is rather
   than what it makes, and this is the only photograph on the site that shows
   that. Framed a shade above centre: the entrance and the solar roofs take the
   half of the band the scrim clears, and the village holds the top edge. */
const aboutShot: HeadShot = {
  src: "/company/images/hq-aerial.webp", w: 1513, h: 553, at: "50% 48%",
};

function CompanyBody({ lang, section }: { lang: Lang; section: CompanySection }) {
  const t = copy[lang];
  /* One per section, and About's is the head office's own line — the sentence
     this band was built around before every page had one. It used to be
     `copy[lang].about.statement`, written into a section of its own at the
     foot of this file; it is in page-closing.ts with the other sixty-odd now,
     and `PageShell` draws the band. */
  const closing = closingLine(lang, sectionPath(section));

  /* About: the former Philosophy page, then the former History page, on one
     spine. The order is what the company is → what it stands for and provides
     → how it got there → the group and the products it built, and the closing
     line lands at the end of all of it rather than halfway down. The tinted
     `.alt` bands still alternate: commitment, then the group timeline. */
  if (section === "about") {
    const a = t.about;
    return (
      <PageShell lang={lang} eyebrow={a.eyebrow} title={a.title} intro={a.intro} shot={aboutShot} closing={closing}>
        {/* Copy left, photograph right — the source page's own two-column
            opening, on this site's existing `.trust` split. */}
        <section>
          <div className="wrap trust">
            <div>
              <span className="kicker">{a.approachKicker}</span>
              <h2>{a.approachTitle}</h2>
              {a.approachBody.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>
            <Figure
              src="/company/images/frankosorb-absorber.webp"
              alt={a.figureAlt}
              caption={a.figureCaption}
              width={720}
              height={480}
            />
          </div>
        </section>

        <section className="alt">
          <div className="wrap">
            <SectionHead kicker={a.commitKicker} title={a.commitTitle} />
            <div className="check-cols">
              <CheckColumn head={a.standsFor.head} items={a.standsFor.items} />
              <CheckColumn head={a.provides.head} items={a.provides.items} />
            </div>
          </div>
        </section>

        {/* The history narrative, in the source's own order, with the two
            photographs where they sit on that page: the archive print beside
            the opening, the current chamber after the 95% figure. It opens
            under a section head now rather than a page head — that is the one
            structural change the merge makes to it. */}
        <section>
          <div className="wrap">
            <SectionHead kicker={a.historyKicker} title={a.historyTitle} />
            <div className="trust">
              <Prose paras={a.storyLead} />
              <Figure
                src="/company/images/history-early-shielded-line.webp"
                alt={a.earlyFigureAlt}
                caption={a.earlyFigureCaption}
                width={1200}
                height={808}
              />
            </div>
            <Prose paras={a.storyRest} />
            <div className="callout">{a.callout}</div>
            <Figure
              src="/company/images/history-antenna-chamber-arch.webp"
              alt={a.archFigureAlt}
              caption={a.archFigureCaption}
              width={1600}
              height={991}
              className="figure figure-wide"
            />
            <Prose paras={a.storyClose} />
          </div>
        </section>

        <section className="alt">
          <div className="wrap">
            <SectionHead kicker={a.groupKicker} title={a.groupTitle} />
            <div className="badges badges-four">
              {a.groupFacts.map(([value, label]) => (
                <div className="bd" key={label}>
                  <b>{value}</b>
                  <span>{label}</span>
                </div>
              ))}
            </div>
            <div className="sec-go">
              <EntryList entries={a.groupEntries} />
            </div>
          </div>
        </section>

        <section>
          <div className="wrap">
            <SectionHead kicker={a.milestonesKicker} title={a.milestonesTitle} />
            <EntryList entries={a.milestones} />
          </div>
        </section>
      </PageShell>
    );
  }

  if (section === "publications") {
    const p = t.publications;
    return (
      <PageShell lang={lang} eyebrow={p.eyebrow} title={p.title} intro={p.intro} closing={closing}>
        <section>
          <div className="wrap">
            <SectionHead kicker={p.listKicker} title={p.listTitle} />
            <div className="entry-list">
              {citations.map(([title, reference], i) => (
                <div className="entry" key={`${title}-${i}`}>
                  <span className="entry-idx">{String(i + 1).padStart(2, "0")}</span>
                  <h4>{title}</h4>
                  <p>{reference}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="alt">
          <div className="wrap">
            <SectionHead kicker={p.printKicker} title={p.printTitle} />
            <div className="figure-row">
              {[
                "/company/images/publications-press-clipping.webp",
                "/company/images/publications-papers.webp",
                "/company/images/publications-trade-magazine.webp",
              ].map((src, i) => (
                <Figure
                  key={src}
                  src={src}
                  /* Alt says what the photograph is; the caption says what it
                     means. Both describe only what is legible — the source
                     gives no captions, and the mastheads and dates cannot be
                     read off these scans. */
                  alt={p.printAlts[i]}
                  caption={p.printCaptions[i]}
                  width={500}
                  height={289}
                />
              ))}
            </div>
          </div>
        </section>
      </PageShell>
    );
  }

  const e = t.events;
  return (
    <PageShell lang={lang} eyebrow={e.eyebrow} title={e.title} intro={e.intro} closing={closing}>
      <section>
        <div className="wrap trust">
          <div>
            <span className="kicker">{e.meetKicker}</span>
            <h2>{e.meetTitle}</h2>
            <p>{e.meetBody}</p>
          </div>
          <Figure
            src="/company/images/events-trade-fair-booth.webp"
            alt={e.figureAlt}
            caption={e.figureCaption}
            width={1600}
            height={1200}
          />
        </div>
      </section>

      {/* The head office announces no dates at the moment, so the list is
          deliberately empty rather than filled with invented ones. `entries`
          takes rows without a layout change once there are any. */}
      <section className="alt">
        <div className="wrap">
          <SectionHead kicker={e.listKicker} title={e.listTitle} />
          {e.entries.length > 0 ? (
            <EntryList entries={e.entries} />
          ) : (
            <EmptyState
              title={e.pendingTitle}
              body={e.pendingBody}
              cta={e.cta}
              subject="[Frankonia] Event schedule"
            />
          )}
        </div>
      </section>
    </PageShell>
  );
}
