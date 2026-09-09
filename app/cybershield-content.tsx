import PageShell, { type HeadShot } from "./page-shell";
import { closingLine } from "./page-closing";
import StructuredData from "./structured-data";
import { CheckList } from "./page-parts";
import { contactPath } from "./contact-sections";
import { pageDescription } from "./site-metadata";
import SiteLink from "./site-link";
import { asset, cyberShieldUrl, localeRoute, type Lang } from "./site-config";

/* CyberShield, summarised.
 *
 * The head office asks this site for a short CyberShield page that hands the
 * reader over to the product site — www.frankonia-cybershield.com — rather
 * than for the product page itself. This route used to carry a full port of
 * that page (app/cybershield/, ~3,200 lines and its own stylesheet), which
 * kept a second copy of copy the product team owns and edits: every figure,
 * standard and price-shaped claim on it went stale the moment the product site
 * moved. The port is gone; what stays is a summary written in this site's own
 * bands, and a link out of every band that makes a claim the full site backs
 * up.
 *
 * The copy below is condensed from that product page rather than written
 * fresh, so the two read as one voice — the six product lines keep their
 * headings and their order, the attenuation figures and the standards list are
 * quoted as the product site states them, and nothing here says more than the
 * page it summarises. Which band condenses which section, and the figures that
 * have to be checked against the product site when it changes, are in
 * docs/source/cybershield.md — read the ledger before editing any copy here.
 *
 * The band order is the product site's argument, not a shorter list of its
 * topics (2026-08-12, head office: 원본 페이지의 이야기 흐름을 따른다; restated
 * 2026-09-04 and again 2026-09-07 against the product site as it stands now,
 * which had moved on both times). As of 2026-09-07 that page runs:
 *
 *   1  answer    — the short answer, before any of the argument for it. A
 *                  reader who never scrolls past the first screen should still
 *                  be able to say what CyberShield is.
 *   2  why       — the gap, in the reader's own terms (−120 dB against a
 *                  signal that never enters the network), and the three assets
 *                  that make it real.
 *   3  threat    — the four routes the exposure arrives by.
 *   4  audience  — who this is for: six environments in two categories now,
 *                  the industrial four and the two home-security ones the
 *                  product site added in September.
 *   5  cases     — three projects it has been built for.
 *   6  belief    — the practice we reject: shielding that is welded, fixed and
 *                  permanent. This spends the industry's own symbol of trust,
 *                  and is paid back straight away by
 *   7  verify    — the measurement, and the standards it is taken against.
 *   8  cover     — which rooms inside the facility the boundary encloses.
 *   9  system    — the room, what is in it, what is handed over with it.
 *  10  attenuation — the envelope it is guaranteed to hold.
 *
 * Ecosystem and the process follow, because they are what a reader who has
 * been persuaded reads next; the hand-over band closes.
 *
 * What moved on 2026-09-07, and why, is in docs/source/cybershield.md §0-1:
 * the product site moved `verify` back behind the threat cards, the audience
 * and the cases, and put belief directly in front of it; the four mission
 * profiles ("HOW THE ROOM IS CONFIGURED") came off the product site and so
 * came off this page; the audience grew from three environments to six.
 *
 * Every outbound link goes through `cyberShieldUrl`, which carries the reader's
 * locale — the product site serves English from its root and Korean from /zh/.
 *
 * They open in a new tab (2026-08-11, head office). The earlier renewal brief
 * asked for the opposite ("새 창에서 열리는 것이 아닌 현재 창에서"), which was
 * written when this route was the product page itself and leaving it meant
 * leaving nothing behind; now the reader has a summary worth coming back to, so
 * the summary stays open. `rel="noopener"` and no `noreferrer`, as on the
 * footer's head-office link and the two on the legal pages: the referrer is how
 * the product site sees that this page sends it traffic.
 * tests/rendered-html.test.mjs holds both halves.
 */

const copy = {
  zh: {
    eyebrow: "CYBERSHIELD",
    title: "零泄漏。零干扰。可测量的电磁边界。",
    intro:
      "作为一个系统进行设计、集成和验证。 Cyber​​Shield 将人工智能和数据工作负载、主权基础设施和个人安全空间与市场上最灵活、高防护的系统结合起来，部署在运营设施中并提供经过测量的证据。",

    openSite: "打开 Cyber​​Shield 网站",
    talk: "咨询询价",

    beliefKicker: "我们对屏蔽的看法",
    beliefTitle: "到目前为止，建筑物必须安装在屏蔽室中。",
    beliefLabels: ["传统方式", "我们的观点"],
    beliefStatusQuo:
      "只要屏蔽室存在，设施就必须适应屏蔽。现有屏蔽在设计阶段就已焊接到位，从施工之日起就保持不变。该建筑是围绕那个暗室规划的，并且由于那个暗室而停止施工。当机架配置发生变化、功率密度增加或设施达到极限时，暗室就无法跟上。在变化最快的基础设施中，防护设备仍然是最不可移动的部分。",
    beliefBelief:
      "我们认为应该反过来。设施不应该适合暗室，但暗室应该适合设施。因此，Cyber​​Shield 由预制钢板模块制成，可通过标准入口门。内部组装，靠近现有墙壁安装并用螺栓固定在一起。没有焊接、没有胶合、没有不可逆的工作。您可以扩展它、重新配置它、将其移动到另一个站点并再次测量。性能保持不变，但仅移除了永久固定。",

    audienceKicker: "该网站受CYBERSHIELD保护",
    audienceTitle: "必须维持屏蔽边界的六种环境。",
    audienceBody:
      "从全球计算集群到安全会议室和个人安全空间，相同的主权级屏蔽技术可在性能至关重要的任何地方提供可测量且经过认证的安全性。",
    deliverableLabel: "核心提供范围",
    audienceGroups: [
      { name: "工业应用", sub: "基础设施、AI云、数据中心", items: [
        ["01.1", "超大规模云与人工智能数据中心", "保护人工智能计算集群、量子硬件和核心可用区免受射频操纵和高功率电磁威胁。", "射频密封空调/冷却穿透、量子态无漂移信号隔离、高功率定向能（HPEM）保护。"],
        ["01.2", "托管/企业数据中心", "我们为具有严格治理要求的企业客户提供具有可衡量的高级安全等级的经过认证的屏蔽螺栓。", "通过 IEEE 299 认证的模块化螺栓系统和可改装屏蔽笼，满足 NIS2、HIPAA、SOC 2 物理安全要求。"],
        ["01.3", "国防、政府、金融机构", "支持主权云、指挥控制中心、高频交易平台等机密性不能离开家的环境。", "NATO/NSA TEMPEST 级信号封锁、无辐射周界以及防欺骗和干扰的传输安全。"],
        ["01.4", "无人机防御/签名隐藏", "反无人机屏蔽，避免公共监视，保护视觉和电子隐私不能留在家中的疏散设施。", "多光谱信号减弱、周界反无人机信号阻挡、快速部署射频屏蔽场外壳。"],
      ] },
      { name: "家庭安防应用领域", sub: "预防防护与个人应用", items: [
        ["02.1", "住宅屏蔽和家庭保护", "主权级备灾，保护私人家庭掩体、住宅安全室，人身安全和完全保密不能交给家庭。", "MIL-STD-188-125 EMP 硬化电源集线器，多层结构法拉第屏蔽，CBRN 空气过滤，气隙安全数据螺栓。"],
        ["02.2", "防窃听/安全会议室", "隔音、防监控屏蔽，打造安全会议室，将敏感对话和个人信息留在家中。", "经过认证的宽带射频屏蔽大于 100 dB、具有周边声音掩蔽的高噪声隔离 (STC) 墙、电源线滤波。"],
      ] },
    ],

    whyKicker: "性能至关重要的应用",
    whyTitle: "人工智能数据中心的安全并不仅仅限于软件。",
    whyBody:
      "防火墙、加密和零信任可防止来自网络的威胁。然而，随着AI数据中心资产价值的增加，不通过网络而通过物理空间和电磁组合的访问路径也受到审视。软件安全和物理安全现在必须一起设计。",
    whyMetric: "−120 dB",
    whyMetricLabel: "Cyber​​Shield 对不通过网络的信号提供的衰减量 — 最大屏蔽效能，根据 EN 50147-1 在现场测量。",
    assets: [
      ["国家战略资产", "人工智能计算能力已经被视为国家竞争力的基础。模型权重、训练数据和主权工作负载都是企业资产并受到国家保护，这就是它们成为目标的原因。"],
      ["易受 EMC 和 EMP 影响的结构", "高密度GPU机架配有数十千瓦的开关电子设备，400G·800G互连以毫伏的噪声容限运行。随着功率密度的增加，辐射变得更强，抗扰度下降。按照标准计算机房标准设计的保护无法涵盖这种情况。"],
      ["外部无线电波保护", "数据中心通常建在工业区、传输设施和交通基础设施附近。周围的无线电环境不受控制，而且日益拥挤。故意电磁干扰设备可以用现成的组件构建，因此 IEC 61000-4-36 作为单独的测试标准存在。"],
    ],

    threatKicker: "暴露路径",
    threatTitle: "通向同一资产的四个路径。没有任何东西可以通过防火墙。",
    threatBody:
      "它们都是通过物理空间或电磁耦合到达计算硬件。所有设施的周边都被封锁。",
    impactLabel: "潜在影响",
    threats: [
      ["电磁信息辐射", "操作辐射。 2026 年，仅使用墙外 6 m 距离的 GPU 辐射来重建神经网络架构，并直接从 NVIDIA Tensor Core 中提取模型参数。两次攻击都没有触及网络。", "机密曝光"],
      ["故意电磁干扰", "局部高功率射频或电磁能会干扰电子设备、控制和通信。", "服务中断"],
      ["EMP/HEMP 暴露", "辐射和传导脉冲效应可能威胁关键系统和业务连续性系统。 E1 脉冲仅在 2.5 ns 内上升——然后基于闪电的浪涌保护器就会做出反应。", "业务连续性风险"],
      ["边界组件漏洞", "门、通风、电力、数据、冷却和设备穿透可能是通往防护罩周边的最薄弱路径。", "防护性能恶化"],
    ],

    coverKicker: "屏蔽边界覆盖的区域",
    coverTitle: "屏蔽边界必须覆盖的四件事。",
    cover: [
      "高性能计算基础设施——核心计算区和高密度加速服务器机架",
      "加密和管理资产——密钥管理系统、加密基础设施、特权访问控制设施",
      "网络互连点——网络入口设施、会议室、交叉连接节点",
      "关键电力和辅助基础设施 — 配电集线器、UPS 管道以及周边的所有过滤器穿透。",
    ],

    nowTitle: "为何现在体现在规格中",
    now: [
      ["国家情报部门安全工作基本方针第九十五条", "公共机构、公有云大功率电磁安全要求"],
      ["国防军事设施电磁脉冲防护设施设计标准", "屏蔽板、屏蔽门、蜂窝通风口、贯穿件、过滤器——国防实践标准100 dB"],
      ["数据中心灾难管理义务，2023 年 7 月生效", "加强实物保护措施要求的趋势——尚未包括EMP和IEMI"],
      ["IEEE 299 / MIL-STD-188-125 因子 SE 测量", "国内认可（KOLAS）报告重新证明验收验证的可靠性"],
    ],
    evidenceNote:
      "本页的数字和威胁定义为 NDSS 2026、arXiv 2603.02891 (Kraken)、IEC 61000-2-9 · IEC 61000-4-36、NCSC、SL5 标准 v0.1、RAND RRA2849-1、NIST SP 800-53、CISA EMP 指南 v2.2，引用来自 EN 50600。CyberShield 网站的支持材料部分按项目列出了引用的文章。",
    verifyGo: "查看保证的屏蔽性能",

    caseKicker: "如何使用CYBERSHIELD",
    caseTitle: "我们反复面临的三种情况。",
    cases: [
      ["政府/主权云", "操作设施内的机密处理区域", "政府云计划需要在现有数据中心内为机密工作负载提供一个安全区域。在维持运行的同时，屏蔽螺栓无需焊接即可施工并进行现场验证，并在不停止周边设施的情况下完成验收测试。"],
      ["人工智能研究院/超大规模运营商", "资产周围的可测量边界", "一家人工智能公司希望保护其模型权重和学习集群免受旁道辐射和外部干扰。我们建造了专用的隔离室，集成了高密度机架的冷却、供电和监控功能，确保在我们最有价值的 IP 周围建立经过测量和记录的安全边界。"],
      ["托管/国防/金融/电信", "高级安全，无需重建", "托管运营商希望在不重建设施的情况下为受监管行业客户提供优质服务。通过在现有的上表面添加模块化螺栓，我们将其包装为经过验证的产品，并创建了难以模仿的安全级别作为收入来源。"],
    ],
    caseNote: "这是一个基于一般项目类型的示例。",
    caseGo: "查看Frankonia项目参考",

    attKicker: "保证屏蔽性能",
    attTitle: "一个屏蔽外壳，在 10 kHz 至 40 GHz 范围内进行验证。",
    attBody:
      "领先的行业标准，PAN 型模块系统的屏蔽性能根据 EN 50147-1 和 IEEE 299 进行测量。构成周边的所有门、过滤器、蜂窝通风口和贯穿件均设计为提供相同的屏蔽性能。",
    envelope: [
      ["10 kHz", "≥90dB·磁场"],
      ["100 kHz", "≥100dB·磁场"],
      ["1 MHz", "≥110dB·磁场"],
      ["100 MHz", "≥120dB·平面波"],
      ["400 MHz", "≥120dB·平面波"],
      ["1 GHz", "≥110dB·平面波"],
      ["18 GHz", "≥100分贝·微波"],
      ["40 GHz", "≥100分贝·微波"],
    ],

    processKicker: "FRANKONIA 端到端解决方案",
    processTitle: "从第一次接触到经过验证的保护。",
    process: [
      ["01", "初步咨询", "专家一起审查您的目标、场地条件和限制。您无需任何所需文件即可开始。"],
      ["02", "危险/现场诊断", "评估资产、威胁场景、周围射频环境和设施状况，共同定义防护需求。"],
      ["03", "概念设计/3D工程", "我们提供概念设计方案、基于CAD/BIM的集成建筑方案以及透明的估算。"],
      ["04", "精密制造", "PAN 模块、射频门、电源/数据滤波器和蜂窝通风口均在 Frankonia 自己的生产设施中制造。"],
      ["05", "构建/验证", "经过认证的施工团队使用无焊接方法进行组装，并在交付时测量并记录屏蔽性能和泄漏。"],
      ["06", "操作/维护", "预防性维护、定期重新测试、安全重新认证持续保持防护性能。"],
    ],

    answerKicker: "简答",
    answerTitle: "单一边界，从设计到施工、测量都有一个责任。",
    answerBody:
      "屏蔽结构、门、过滤器、通风波导和所有贯穿件均设计为一个连续边界，以非焊接方式构建，不间断运行，然后根据 EN 50147-1 / IEEE 299 进行现场测量并以文件形式交付。最后留下的是衡量标准，而不是承诺。",
    metrics: [
      ["现场测量验证", "安装后现场测量屏蔽性能——证据，而非猜测"],
      ["非焊接模块组装", "螺栓紧固无需动火——与作业设施并行施工"],
      ["可扩展、转移", "无损拆除，扩建、改造、搬迁再利用"],
    ],

    systemKicker: "性能屏蔽",
    systemTitle: "根据设施实际情况设计的安全空间。",
    systemBody:
      "预制PAN模块可以通过标准建筑门引入，在内部组装，并安装在现有墙壁附近。无需胶水或焊接即可进行扩展和搬迁。",
    features: [
      ["01", "精密装配", "以规定的扭矩以75毫米的间隔拧紧面板，并用导电网垫密封接头。"],
      ["02", "建筑一体化", "它是一个可双面使用的模块，确保内部平整，并将双层地板、机架、消防、照明、冷却和访问控制纳入设计中。"],
      ["03", "可扩展结构", "可无损坏地拆卸并重复使用以进行扩展、改装或完全转移。"],
      ["04", "完整的防护周界", "将屏蔽结构、门、过滤器、蜂窝和波导构建为一个系统。"],
    ],
    handoverTitle: "交货时提供什么",
    handover: [
      "整个指定频段的现场屏蔽性能测量",
      "门、过滤器、蜂窝和所有渗透物的泄漏检测扫描",
      "已出具空白收购报告",
      "定期重新测试和安全重新认证作为服务提供",
    ],
    cutawayAlt: "CyberShield屏蔽数据大厅横截面，包括结构、门、过滤器、管道和电源室",
    cutawayCaption:
      "所有单独的解决方案形成屏蔽边界。通过在 Cyber​​Shield 网站上选择一个项目，您可以看到每个角色和需求是什么。",

    verifyKicker: "下一代屏蔽标准",
    verifyTitle: "性能通过测量而非承诺来证明。",
    verifyBody: [
      "所有 Cyber​​Shield 项目均围绕客户设施进行设计，并通过测量证明完成。根据国际标准对屏蔽性能进行现场测试，并连同舱位一起交付包含详细性能结果的验收文件。",
    ],
    standardsTitle: "适用标准",
    standards: [
      ["EN 50147-1", "屏蔽效能测量标准"],
      ["IEEE 299", "作为项目选项提供"],
      ["BSI TL-03305 / 03306", "防窃听室、IT屏蔽室标准"],
      ["NATO SDIP-27 Level A", "TEMPEST 设计/批准，符合 NSA 94-106 标准"],
      ["MIL-STD-188-125-1 / -2", "HEMP·IEMI防护，项目验证"],
      ["ISO/IEC 27001", "物理和环境安全控制项目支持"],
    ],
    attenuationNote:
      "这是标准PAN型系统的保证性能范围。项目适用范围通过规范和现场验收测试确定。",

    ecoKicker: "屏蔽元件及配件",
    ecoTitle: "六大产品系列，一处无泄漏屏蔽周边。",
    ecoBody:
      "Frankonia 自 1987 年以来一直遵循最高质量和高效的预制/模块标准。没有焊接或胶合，所有组件均设计为同一屏蔽外壳的一部分，因此接缝、门或穿透处的性能不会损失。",
    eco: [
      "2.0毫米镀锌钢板PAN模块系统构成墙壁、天花板和地板。",
      "高承载滑动/铰链射频门、高屏蔽射频窗、门禁监控联动。",
      "高性能电力线滤波器、光缆波导穿透件和射频信号抑制装置。",
      "蜂窝通风板、吸音板（ISO 354）、液冷/设备用屏蔽波导。",
      "EN 50147-1 / IEEE 299 屏蔽性能测量、泄漏检测、SE 测试和规范文档。",
      "预防性维护、重新校准和定期重新认证服务。",
    ],
    ecoGo: "在 CyberShield 网站上查看整个产品线",

    fullKicker: "CYBERSHIELD专用网站",
    fullTitle: "本页为摘要。完整的详细信息请参见专门网站。",
    fullBody:
      "Cyber​​Shield 有一个单独的产品网站。下面的链接将以您当前查看的语言在新选项卡中打开。此摘要页面将保持原样。",
    fullList: [
      "屏蔽室剖面图——逐项查看图中形成边界的21种方案",
      "六种应用环境的重点领域——从人工智能和量子基础设施中的信号隔离到家庭中的电磁弹性",
      "所有10个引用的支持材料——包括每个项目的发布机构和引用的条款",
      "PAN屏蔽环境的特点和屏蔽标准，以及从门和大门到视频和音响系统的互补产品线",
      "供货范围分类表——Frankonia涵盖范围、合作伙伴及客户范围",
      "Frankonia公司从产品和客户角度的优势介绍与总结",
      "5 个常见问题和 CyberShield 手册 PDF",
      "项目咨询表将发送至同一位负责人",
    ],
  },
  en: {
    eyebrow: "CYBERSHIELD",
    title: "Zero leakage. Zero interference. A measurable electromagnetic boundary.",
    intro:
      "Engineered, integrated and verified as one system. CyberShield wraps AI and data workloads, sovereign infrastructure and private safe rooms in the market's most flexible high-attenuation shielding — installed around live operations and handed over with measured evidence.",

    openSite: "Open the CyberShield site",
    talk: "Talk to a specialist",

    beliefKicker: "HOW WE THINK ABOUT SHIELDING",
    beliefTitle: "For decades, the building has had to serve the shield.",
    beliefLabels: ["The status quo", "What we believe"],
    beliefStatusQuo:
      "For as long as shielded rooms have existed, the facility has had to accommodate the shield. Conventional shielding is welded into place, fixed at design stage and permanent from the day it is finished. The building is planned around it. Construction stops for it. And when racks change, power density rises or the site outgrows itself, the room cannot follow. Protection ends up being the least flexible part of the fastest-moving infrastructure there is.",
    beliefBelief:
      "We believe it should be the other way around: the room adapts to the facility, not the facility to the room. So we build ours from prefabricated steel modules that pass through a standard building door, assemble from the inside, sit close to existing walls and bolt together — no welding, no glue, nothing irreversible. The room can be extended, reconfigured or relocated entirely, then measured again. Full protection, none of the permanence.",

    audienceKicker: "WHO CYBERSHIELD IS BUILT FOR",
    audienceTitle: "Six environments where the boundary has to hold.",
    audienceBody:
      "From global compute clusters to secure meeting chambers and private safe rooms, the same sovereign-grade shielding delivers measurable, certified security wherever performance is mandatory.",
    deliverableLabel: "Core deliverable",
    audienceGroups: [
      { name: "Industrial applications", sub: "Infrastructure, AI cloud and data centres", items: [
        ["01.1", "Hyperscale cloud & AI centres", "Core AI compute clusters, quantum hardware and critical availability zones, shielded against RF tampering and high-power electromagnetic threats.", "RF-sealed airflow and cooling pass-throughs, zero-drift signal isolation for quantum states and high-power directed-energy (HPEM) mitigation."],
        ["01.2", "Colocation & enterprise data centres", "A certified shielded vault offered as a premium, measurable security tier for enterprise customers under strict governance requirements.", "IEEE 299 certified modular vault systems and retrofittable shielded cages, satisfying the physical-security requirements of NIS2, HIPAA and SOC 2."],
        ["01.3", "Defence, government & financial institutions", "Sovereign cloud deployments, command centres and high-frequency trading platforms where confidentiality cannot be left to assumption.", "NATO/NSA TEMPEST-grade signal containment, zero-emanation perimeters and transmission security against spoofing and jamming."],
        ["01.4", "Drone defence & signature concealment", "Anti-drone shielding, aerial surveillance evasion and shelters where visual and electronic privacy cannot be left to assumption.", "Multispectral signature reduction, counter-UAS perimeter signal blocking and rapidly deployable RF-shielded field enclosures."],
      ] },
      { name: "Home security applications", sub: "Preventive protection and private applications", items: [
        ["02.1", "Home shielding & family protection", "Sovereign-grade disaster preparation, private family bunkers and residential safe rooms where personal security and total confidentiality cannot be left to assumption.", "MIL-STD-188-125 EMP-hardened power hubs, multi-layered structural Faraday shielding, CBRN air filtration and air-gapped safe-haven data vaults."],
        ["02.2", "Eavesdropping prevention & secure chambers", "Acoustic isolation, counter-surveillance shielding and secure meeting chambers where sensitive conversations and private intelligence cannot be left to assumption.", "100 dB+ certified broadband RF attenuation, high-STC acoustic walls with perimeter sound masking and power-line filtering."],
      ] },
    ],

    whyKicker: "APPLICATIONS THAT REQUIRE PERFORMANCE",
    whyTitle: "AI data centre security no longer ends at the software layer.",
    whyBody:
      "Firewalls, encryption and zero trust stop what arrives over the network. As the value held inside an AI data centre grows, the paths that never touch the network — through physical space and through electromagnetic coupling — have become a real part of the assessment. Software security and physical security now have to be designed together.",
    whyMetric: "−120 dB",
    whyMetricLabel: "The attenuation CyberShield provides against a signal that never enters the network — peak shielding effectiveness, measured on site to EN 50147-1.",
    assets: [
      ["A national strategic asset", "AI compute is already treated as national capability. Model weights, training data and sovereign workloads are corporate property and a matter of state interest at once — which is exactly what makes them worth targeting."],
      ["EMC and EMP exposed by design", "Dense GPU racks take tens of kilowatts through switching electronics, and 400G/800G interconnects work to noise budgets measured in millivolts. As power density rises, emission goes up and immunity headroom comes down. Protection sized for a conventional server room does not cover this."],
      ["Protection from what is outside", "Data centres sit near industry, transmitters and transport infrastructure. The ambient RF environment is not yours to control and only gets busier. Intentional interference can be assembled from commercially available parts — which is why IEC 61000-4-36 exists as a test standard in its own right."],
    ],

    threatKicker: "HOW THE EXPOSURE ARRIVES",
    threatTitle: "Four routes to the same asset – none of them across a firewall.",
    threatBody:
      "Each one reaches processing hardware through physical space or through electromagnetic coupling. Each one is closed at the facility boundary.",
    impactLabel: "Potential impact",
    threats: [
      ["Compromising emanations", "Processing activity radiates. In 2026 a neural network's architecture was reconstructed from GPU emissions 6 m away through a wall, and model parameters were read directly from NVIDIA Tensor Cores. Neither attack touched the network.", "Confidentiality exposed"],
      ["Intentional interference", "Localized high-power RF or electromagnetic energy can disrupt electronics, controls and communications.", "Service interruption"],
      ["EMP / HEMP exposure", "Radiated and conducted pulse effects can challenge critical systems and continuity architectures. The E1 pulse rises in 2.5 ns — before surge protection rated for lightning has reacted.", "Mission continuity risk"],
      ["Boundary vulnerabilities", "Doors, ventilation, power, data, cooling and utility penetrations can become the weakest path through the shield.", "Protection degraded"],
    ],

    coverKicker: "WHAT THE BOUNDARY ENCLOSES",
    coverTitle: "Four things the boundary has to enclose.",
    cover: [
      "High-performance compute infrastructure — core compute zones and high-density, accelerated server racks",
      "Cryptographic & administration assets — key management systems, cryptographic infrastructure and privileged access control facilities",
      "Network interconnection points — network entrance facilities, meet-me rooms and cross-connect nodes",
      "Critical power & auxiliary infrastructure — power distribution hubs, UPS corridors and all filtered service penetrations crossing the perimeter",
    ],

    nowTitle: "Why it is being specified now",
    now: [
      ["ICD 705, 2025 revision", "RF shielding must be integrated into walls, ceilings and doors — existing SCIFs become retrofit candidates"],
      ["CISA EMP Guidelines v2.2, Level 4", "MIL-STD-188-125-1 protection at 1–5 % of new-build cost"],
      ["SL5 Standard, Section 3.9 SA-4", "Shielded rack enclosures in the AI weight enclave — not law, but written by the frontier labs themselves"],
      ["EO 13865 / NDAA CIPA", "EMP resilience duties across 16 critical-infrastructure sectors"],
    ],
    evidenceNote:
      "Figures and threat definitions on this page are read from NDSS 2026, arXiv 2603.02891 (Kraken), IEC 61000-2-9 and IEC 61000-4-36, NCSC, SL5 Standard v0.1, RAND RRA2849-1, NIST SP 800-53, CISA EMP Guidelines v2.2 and EN 50600. The clause each statement comes from is named entry by entry in the evidence base on the CyberShield site.",
    verifyGo: "See the guaranteed envelope",

    caseKicker: "HOW CYBERSHIELD IS USED",
    caseTitle: "Three situations we see again and again.",
    cases: [
      ["Government & sovereign cloud", "A classified zone inside a live facility", "A government cloud programme needed a secure processing zone for classified workloads inside an existing data centre. The vault was engineered around live operations, installed without welding and verified on site — delivered and acceptance-tested without interrupting the surrounding facility."],
      ["AI labs & hyperscale operations", "A measurable boundary around the assets", "An AI firm sought to safeguard its proprietary model weights and training clusters from side-channel emanations and external interference. A dedicated shielded room with integrated cooling, power and monitoring for high-density racks put a measured, documented boundary around the company's most valuable IP."],
      ["Colocation, defence, finance & communications", "Premium security without rebuilding", "A colocation operator wanted a premium tier for regulated customers without rebuilding the site. A modular vault was added inside existing white space and packaged as a verified product — a high-margin revenue stream from a security tier that is hard to replicate."],
    ],
    caseNote: "Representative scenarios based on typical project profiles.",
    caseGo: "See Frankonia project references",

    attKicker: "GUARANTEED ATTENUATION PERFORMANCE",
    attTitle: "One shielding envelope, verified from 10 kHz to 40 GHz.",
    attBody:
      "Standard-setting PAN type module engineering, measured in accordance with EN 50147-1 and IEEE 299. The same attenuation is engineered into every door, filter, honeycomb vent and feed-through in the boundary.",
    envelope: [
      ["10 kHz", "≥ 90 dB · Magnetic field"],
      ["100 kHz", "≥ 100 dB · Magnetic field"],
      ["1 MHz", "≥ 110 dB · Magnetic field"],
      ["100 MHz", "≥ 120 dB · Plane wave"],
      ["400 MHz", "≥ 120 dB · Plane wave"],
      ["1 GHz", "≥ 110 dB · Plane wave"],
      ["18 GHz", "≥ 100 dB · Microwave"],
      ["40 GHz", "≥ 100 dB · Microwave"],
    ],

    processKicker: "END-TO-END FRANKONIA SOLUTIONS",
    processTitle: "From first contact to verified protection.",
    process: [
      ["01", "Initial consultation", "A specialist reviews your goals, site and constraints. No documentation is required to start."],
      ["02", "Risk & site assessment", "Assets, threat scenarios, ambient RF conditions and facility constraints are assessed; protection requirements are defined together."],
      ["03", "Concept & 3D engineering", "You receive a concept design, CAD/BIM architectural integration and a transparent quotation."],
      ["04", "Precision manufacturing", "PAN modules, RF doors, power and data filters and honeycomb vents are produced in Frankonia's own facilities."],
      ["05", "Installation & verification", "Certified teams assemble the modules without welding; shielding effectiveness and leak detection are measured and documented at handover."],
      ["06", "Operation & support", "Preventive maintenance, periodic re-testing and security re-certification keep the boundary effective over time."],
    ],

    answerKicker: "THE SHORT ANSWER",
    answerTitle: "One boundary – designed, built and measured under a single responsibility.",
    answerBody:
      "Shielding structure, doors, filters, ventilation waveguides and every penetration are engineered as one continuous boundary, assembled weld-free alongside live operations, then measured on site to EN 50147-1 / IEEE 299 and handed over as documented evidence. What you keep at the end is a measurement, not an assurance.",
    metrics: [
      ["Verified on site", "Shielding performance is measured after installation — not assumed"],
      ["Weld-free assembly", "Bolted modules installed alongside live operations, no hot work"],
      ["Built to change", "Dismount, expand or relocate the room without damage"],
    ],

    systemKicker: "PERFORMANCE SHIELDING",
    systemTitle: "A secure room engineered around the reality of your facility.",
    systemBody:
      "Prefabricated PAN modules pass through standard building doors, assemble from the inside and can be installed close to existing walls. No glue. No welding. No irreversible commitment.",
    features: [
      ["01", "Precision assembly", "Panels are bolted every 75 mm with predefined torque and conductive mesh gaskets."],
      ["02", "Architectural integration", "Reversible modules leave flat interior surfaces for finishing walls, ceilings and racks, designed around raised floors, fire systems, lighting, cooling and access control."],
      ["03", "Adaptable by design", "Dismountable without damage for expansion, modification or complete relocation."],
      ["04", "Complete boundary", "Shielding structure, doors, filters, honeycombs and waveguides are treated as one system."],
    ],
    handoverTitle: "What you receive at handover",
    handover: [
      "On-site shielding effectiveness measurement across the specified frequency range",
      "Leak detection sweep of doors, filters, honeycombs and every feed-through",
      "Documented acceptance report issued with the room",
      "Periodic re-testing and security re-certification as a service",
    ],
    cutawayAlt: "Cutaway view of a CyberShield shielded data hall with its structure, doors, filters, ducts and power room",
    cutawayCaption:
      "Every engineered solution that makes up the shielding boundary. Pick any one on the CyberShield site to see what it does and why it is there.",

    verifyKicker: "NEXT-GEN SHIELDING STANDARD",
    verifyTitle: "Proven performance you don't have to take on faith.",
    verifyBody: [
      "Every CyberShield project is engineered around your facility and ends with measured evidence. Shielding effectiveness is tested on site according to international standards, and documented acceptance with detailed performance results is handed over with the room.",
    ],
    standardsTitle: "Measured and validated against",
    standards: [
      ["EN 50147-1", "Shielding effectiveness measurement"],
      ["IEEE 299", "Available as a project option"],
      ["BSI TL-03305 / 03306", "Eavesdropping-protected rooms & IT enclosures"],
      ["NATO SDIP-27 Level A", "TEMPEST design & approval, aligned with NSA 94-106"],
      ["MIL-STD-188-125-1 / -2", "HEMP and IEMI protection, project-specific validation"],
      ["ISO/IEC 27001", "Supports the physical and environmental security controls"],
    ],
    attenuationNote:
      "Values describe the guaranteed performance envelope of the standard PAN type system. The scope that applies to your project is confirmed in the specification and by on-site acceptance testing.",

    ecoKicker: "SHIELDING COMPONENTS & ACCESSORIES",
    ecoTitle: "Six product lines. One zero-leak boundary.",
    ecoBody:
      "Since 1987, Frankonia has followed a prefabrication and modular standard at the highest quality and efficiency. Nothing is welded, nothing is glued, and every component is engineered as part of the same shielding envelope — so performance is not lost at the joints, the doors or the penetrations.",
    eco: [
      "Prefabricated 2.0 mm galvanized steel PAN module system for walls, ceilings and floors.",
      "Heavy-duty sliding and hinged RF doors, high-attenuation RF windows and integrated access monitoring.",
      "High-performance power line filters, fibre-optic waveguide penetrations and RF signal suppressors.",
      "Honeycomb ventilation panels, acoustic panels (ISO 354) and shielded waveguides for liquid cooling and utilities.",
      "EN 50147-1 / IEEE 299 shielding measurement, leak detection, SE testing and compliance documentation.",
      "Preventive maintenance, recalibration and periodic re-certification services.",
    ],
    ecoGo: "See every product line on the CyberShield site",

    fullKicker: "THE COMPLETE CYBERSHIELD SITE",
    fullTitle: "This page is a summary. The full account continues on the product site.",
    fullBody:
      "CyberShield keeps a site of its own. The link below opens in a new tab, in the language you are reading now — this summary stays where it is.",
    fullList: [
      "The room in cutaway — all twenty-one engineered solutions, picked off the render where they sit",
      "The focus areas behind the six environments — from signal isolation for AI and quantum infrastructure to electromagnetic resiliency at home",
      "The full evidence base: ten publications, each with the issuing body and the clause cited",
      "The PAN shielded environment in full — its features and shielding standards, and the complementary lines from doors and gates to video and audio systems",
      "The scope table — what Frankonia delivers, and where partners and the customer take over",
      "Frankonia at a glance, with the product advantages and customer benefits in full",
      "Five common project questions, and the CyberShield brochure as a PDF",
      "A project enquiry form addressed to the same specialists",
    ],
  },
} as const;

/**
 * The six product lines, in the order the product site introduces them.
 *
 * `spec` is the same figure-and-standard line the landing page's CyberShield
 * band carries, so a reader meets the identical six headings and figures on the
 * way in; it reads the same in both locales and stays out of the copy table.
 * `shot` names the photograph the product site uses for that line.
 */
const lines = [
  { name: "Structure", spec: "2.0 mm DX 52 D+Z · 75 mm bolt pitch", shot: "structure" },
  { name: "Access", spec: "Sliding · Hinged · RF Window", shot: "access" },
  { name: "Connectivity", spec: "Power · Signal · Data · DN200", shot: "connectivity" },
  { name: "Air & Waveguides", spec: "Honeycomb · ISO 354 αw 0.65", shot: "air" },
  { name: "Validation", spec: "EN 50147-1 · IEEE 299", shot: "validation" },
  { name: "Lifecycle", spec: "Maintenance · Re-certification", shot: "lifecycle" },
] as const;

/** What every link to the product site carries, so all five sites of it agree.
 *  Spread rather than repeated: a card row that opened in this window while the
 *  button above it opened a tab would be the kind of inconsistency nobody
 *  notices in review. */
const outbound = { target: "_blank", rel: "noopener" } as const;

/* Two in-page anchors, `verify` and `attenuation`, named after the product
   site's own (#verification, #attenuation) so a deep link written against
   either page lands in the same place. The verify band links down to the
   attenuation band, which is the one cross-link the product site makes between
   the two — the standards are what the measurement is taken against, and the
   envelope is what it comes back with. */

/* The head band. CyberShield is one page, so its first page is its only one.
   The aerial of the data centre — the building this whole page is about, and
   the only frame of it that is not a cutaway render on white. It is a square
   1024, so the band takes a horizontal strip out of the middle: the hall and
   its roof, framed just above centre to keep the approach road out. */
const shieldShot: HeadShot = {
  src: "/cybershield/images/facility-aerial.webp", w: 1024, h: 1024, at: "50% 44%",
};

export default function CyberShieldPage({ lang }: { lang: Lang }) {
  const t = copy[lang];
  /* One value, read in five places below: the locale-aware product site URL. */
  const site = cyberShieldUrl(lang);

  return (
    <>
      <StructuredData lang={lang} page="cybershield" description={pageDescription(lang, "cybershield")} />

      <PageShell
        lang={lang}
        eyebrow={t.eyebrow}
        title={t.title}
        intro={t.intro}
        shot={shieldShot}
        closing={closingLine(lang, "/cybershield")}
      >
        {/* The way out to the product site, above everything a reader would
            have to scroll past to find it.
            The product site's four-credential proof strip used to sit under
            these buttons; taken out on 2026-08-12 (head office). The credits
            are on the company pages and in the footer, and four boxes between
            the head and the argument delayed act 1 without adding to it.
            Buttons only now, so the band takes a shorter top padding than the
            120px every argument band below it keeps — otherwise two buttons
            sit in 196px of air under the head. */}
        <section style={{ paddingTop: "56px" }}>
          <div className="wrap">
            <div className="btns">
              <a className="btn btn-red" href={site} {...outbound}>
                {t.openSite}<span aria-hidden="true">↗</span>
              </a>
              <SiteLink className="btn btn-outline" href={localeRoute(lang, contactPath)}>
                {t.talk}<span aria-hidden="true">→</span>
              </SiteLink>
            </div>
          </div>
        </section>

        {/* 1 — the short answer, before any of the argument for it. The
            product site opens on this band and it is the right way round: a
            reader who never scrolls past the first screen should still be able
            to say what CyberShield is. The three chips under it are the
            product site's own hero strip, which is where the reader meets them
            over there. */}
        <section>
          <div className="wrap">
            <div className="sec-head">
              <span className="kicker">{t.answerKicker}</span>
              <h2>{t.answerTitle}</h2>
              <p>{t.answerBody}</p>
            </div>
            <div className="badges badges-wide">
              {t.metrics.map(([b, s]) => (
                <div className="bd" key={b}>
                  <b>{b}</b>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 2 — the gap, stated in the reader's own terms. The −120 dB badge
            is the number the whole page turns on, and it is the product site's
            own framing: the attenuation against the signal that never enters
            the network. It used to read `0 dB` here — what a firewall provides
            against that signal — which was this site's inversion of the same
            point and left the page quoting a figure the product site does not
            print. */}
        <section className="alt">
          <div className="wrap trust">
            <div>
              <span className="kicker">{t.whyKicker}</span>
              <h2>{t.whyTitle}</h2>
              <p>{t.whyBody}</p>
            </div>
            <div className="badges badges-one">
              <div className="bd">
                <b>{t.whyMetric}</b>
                <span>{t.whyMetricLabel}</span>
              </div>
            </div>
          </div>
          <div className="wrap" style={{ marginTop: "72px" }}>
            <div className="line-grid three">
              {t.assets.map(([name, body], i) => (
                <div className="num-col" key={name}>
                  <span className="num">{String(i + 1).padStart(2, "0")}</span>
                  <h4>{name}</h4>
                  <p>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3 — the four routes. The red index slot carries the impact rather
            than a number: which of four exposures a card describes is the
            useful thing to read there, and the cards have no order. */}
        <section>
          <div className="wrap">
            <div className="sec-head">
              <span className="kicker">{t.threatKicker}</span>
              <h2>{t.threatTitle}</h2>
              <p>{t.threatBody}</p>
            </div>
            <div className="line-grid">
              {t.threats.map(([name, body, impact]) => (
                <div className="num-col" key={name}>
                  <span className="num">{t.impactLabel} · {impact}</span>
                  <h4>{name}</h4>
                  <p>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4 — self-identification. Six environments in two categories since
            September: the industrial four the page always had, and two
            home-security ones the product site added. Each keeps its core
            deliverable — that line is what separates 01.2 from 01.3 for a
            reader who fits both — under the same red slot the threat cards
            use for their impact. The product site sets a focus list under each
            category as well; those stay over there and the hand-over band
            says so. */}
        <section className="alt">
          <div className="wrap">
            <div className="sec-head">
              <span className="kicker">{t.audienceKicker}</span>
              <h2>{t.audienceTitle}</h2>
              <p>{t.audienceBody}</p>
            </div>
            {t.audienceGroups.map((group, g) => (
              <div key={group.name} style={g > 0 ? { marginTop: "56px" } : undefined}>
                <h3 className="sub-head"><b>{group.name}</b> · {group.sub}</h3>
                {/* Four across for the industrial group, two across for the
                    home group — a two-item row in a four-column grid is half
                    empty, and the empty half reads as something missing. */}
                <div className={group.items.length > 2 ? "line-grid" : "line-grid two"}>
                  {group.items.map(([no, name, body, deliverable]) => (
                    <div className="num-col" key={no}>
                      <span className="num">{no}</span>
                      <h4>{name}</h4>
                      <p>{body}</p>
                      {/* `.cs-note` is written for a line under a whole band
                          and keeps 30px above it; under a card's own paragraph
                          that reads as a gap, not a footnote. */}
                      <p className="cs-note" style={{ marginTop: "14px" }}><b>{t.deliverableLabel}</b> — {deliverable}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5 — three projects. The product site sets each one out as
            challenge, approach and outcome; here the three are one paragraph,
            because a summary that keeps the three headings keeps the section
            rather than summarising it. The index slot carries the segment, as
            the threat cards carry their impact; the heading is the product
            site's own one-line title for the case. The way on is the product
            site's too — it points its readers at Frankonia's references, which
            are this site's, so the link stays inside. */}
        <section>
          <div className="wrap">
            <div className="sec-head">
              <span className="kicker">{t.caseKicker}</span>
              <h2>{t.caseTitle}</h2>
            </div>
            <div className="line-grid three">
              {t.cases.map(([segment, name, body]) => (
                <div className="num-col" key={name}>
                  <span className="num">{segment}</span>
                  <h4>{name}</h4>
                  <p>{body}</p>
                </div>
              ))}
            </div>
            <p className="cs-note">{t.caseNote}</p>
            <SiteLink className="go sec-go" href={localeRoute(lang, "/chambers/references")}>
              {t.caseGo}<span aria-hidden="true">→</span>
            </SiteLink>
          </div>
        </section>

        {/* 6 — the practice we reject. The layout is the argument: on the
            left under a grey rule, what we build instead on the right under a
            primary one. Nothing here explains that it is a reversal — it is
            read rather than announced. It spends the industry's own symbol of
            trust (welds), and the band straight after pays it back. */}
        <section className="alt">
          <div className="wrap">
            <div className="sec-head">
              <span className="kicker">{t.beliefKicker}</span>
              <h2>{t.beliefTitle}</h2>
            </div>
            <div className="belief">
              <div>
                <h3>{t.beliefLabels[0]}</h3>
                <p>{t.beliefStatusQuo}</p>
              </div>
              <div>
                <h3>{t.beliefLabels[1]}</h3>
                <p>{t.beliefBelief}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 7 — the measurement, and the standards it is taken against. It
            sits straight after belief because that is where the product site
            puts it now (2026-09-07): welds were traded away for bolts one
            band up, and this is the evidence offered in their place.

            No two-column `trust` layout: the attenuation figures that used to
            fill its right side are a band of their own further down, where
            the product site also keeps them, and the regulations that take
            their place here are a list rather than a figure. */}
        <section id="verify">
          <div className="wrap">
            <div className="sec-head">
              <span className="kicker">{t.verifyKicker}</span>
              <h2>{t.verifyTitle}</h2>
              {t.verifyBody.map((p) => <p key={p}>{p}</p>)}
            </div>
            <h3 className="sub-head"><b>{t.standardsTitle}</b></h3>
            <div className="hairline-list">
              {/* `--name`: these are document designations with slashes and
                  hyphens in them, far longer than the short labels the row's
                  nowrap default is written for. */}
              {t.standards.map(([name, note]) => (
                <div className="hl-row hl-row--name" key={name}>
                  <b>{name}</b>
                  <span className="hl-desc">{note}</span>
                </div>
              ))}
            </div>
            {/* Per locale, and not a translation of each other: the product
                site names Korean instruments on its Korean page and US and
                NATO ones on its English page, because what makes a reader
                specify a shielded room this year is written by their own
                regulator. Translating one list would put the wrong regulator
                in front of the reader. */}
            <h3 className="sub-head" style={{ marginTop: "56px" }}><b>{t.nowTitle}</b></h3>
            <div className="hairline-list">
              {t.now.map(([name, note]) => (
                <div className="hl-row hl-row--name" key={name}>
                  <b>{name}</b>
                  <span className="hl-desc">{note}</span>
                </div>
              ))}
            </div>
            {/* The product site lists ten publications with the clause each
                statement is drawn from. A summary that repeated the list would
                be the list; what it owes the reader is the names and the way
                to the clauses. */}
            <p className="cs-note">{t.evidenceNote}</p>
            <a className="go sec-go" href="#attenuation">
              {t.verifyGo}<span aria-hidden="true">↓</span>
            </a>
          </div>
        </section>

        {/* 8 — which rooms. Four lines and no cards: this is a checklist a
            reader runs down their own floor plan, not four things to compare.
            Each line is the product site's heading and its one-line gloss. */}
        <section className="alt">
          <div className="wrap">
            <div className="sec-head">
              <span className="kicker">{t.coverKicker}</span>
              <h2>{t.coverTitle}</h2>
            </div>
            <CheckList items={t.cover} />
          </div>
        </section>

        {/* 9 — what is built, and what comes with it at handover. The cutaway
            is the product site's own render; the interactive version of it is
            one of the reasons to follow the link, so the caption says where it
            lives rather than leaving a picture that looks clickable and is
            not. */}
        <section>
          <div className="wrap">
            <div className="sec-head">
              <span className="kicker">{t.systemKicker}</span>
              <h2>{t.systemTitle}</h2>
              <p>{t.systemBody}</p>
            </div>
            <div className="line-grid">
              {t.features.map(([no, name, body]) => (
                <div className="num-col" key={no}>
                  <span className="num">{no}</span>
                  <h4>{name}</h4>
                  <p>{body}</p>
                </div>
              ))}
            </div>
            <h3 className="sub-head" style={{ marginTop: "56px" }}><b>{t.handoverTitle}</b></h3>
            <CheckList items={t.handover} />
            <figure className="figure figure-wide" style={{ maxWidth: 1000 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset("/cybershield/images/cutaway.webp")}
                alt={t.cutawayAlt}
                width={1800}
                height={1009}
                loading="lazy"
                decoding="async"
              />
              <figcaption>{t.cutawayCaption}</figcaption>
            </figure>
          </div>
        </section>

        {/* 10 — the guaranteed envelope, and the band the verify link above
            lands on. Eight rows rather than the four badges this page used to
            carry: the four were a reading of the table, and a reader checking
            whether their own frequency of concern is covered needs the row for
            it. The same eight are on the shielded room's page — one shielding
            system, stated once. */}
        <section className="alt" id="attenuation">
          <div className="wrap">
            <div className="sec-head">
              <span className="kicker">{t.attKicker}</span>
              <h2>{t.attTitle}</h2>
              <p>{t.attBody}</p>
            </div>
            <div className="hairline-list">
              {t.envelope.map(([band, value]) => (
                <div className="hl-row" key={band}>
                  <b>{band}</b>
                  <span className="hl-desc">{value}</span>
                </div>
              ))}
            </div>
            <p className="cs-note">{t.attenuationNote}</p>
          </div>
        </section>

        {/* The six lines. Cards, and links — the landing page's CyberShield
            band is built the same way and lands here; these carry on to the
            product site, where each line has its own section. */}
        <section>
          <div className="wrap">
            <div className="sec-head">
              <span className="kicker">{t.ecoKicker}</span>
              <h2>{t.ecoTitle}</h2>
              <p>{t.ecoBody}</p>
            </div>
            <div className="line-grid three">
              {lines.map((line, i) => (
                <a className="lc" key={line.name} href={site} {...outbound}>
                  <div className="lc-shot lc-shot--photo">
                    {/* Decorative, as on the landing's card rows: the heading
                        beside it names the line, and the product site
                        describes the same photograph for a screen reader. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={asset(`/cybershield/images/ecosystem/${line.shot}.webp`)}
                      alt=""
                      width={1000}
                      height={667}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <h4>{line.name}</h4>
                  <p>{t.eco[i]}</p>
                  <div className="models">{line.spec}</div>
                </a>
              ))}
            </div>
            <a className="go sec-go" href={site} {...outbound}>
              {t.ecoGo}<span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>

        {/* What happens after the enquiry. Last of the argument bands and the
            one a reader reaches with the decision already half made: it answers
            "what am I committing to by writing" rather than "why should I". Six
            numbered steps in the same column layout as the four system
            features, because they are the same kind of list. */}
        <section className="alt">
          <div className="wrap">
            <div className="sec-head">
              <span className="kicker">{t.processKicker}</span>
              <h2>{t.processTitle}</h2>
            </div>
            <div className="line-grid">
              {t.process.map(([no, name, body]) => (
                <div className="num-col" key={no}>
                  <span className="num">{no}</span>
                  <h4>{name}</h4>
                  <p>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The hand-over. A summary that does not say what it left out asks the
            reader to guess whether following the link is worth it. */}
        <section>
          <div className="wrap">
            <div className="sec-head">
              <span className="kicker">{t.fullKicker}</span>
              <h2>{t.fullTitle}</h2>
              <p>{t.fullBody}</p>
            </div>
            <CheckList items={t.fullList} />
            <div className="btns" style={{ marginTop: "44px" }}>
              <a className="btn btn-red" href={site} {...outbound}>
                {t.openSite}<span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>
      </PageShell>
    </>
  );
}
