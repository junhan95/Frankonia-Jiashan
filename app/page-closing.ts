import type { Lang } from "./site-config";

/**
 * The closing statement — the last band of every page.
 *
 * One sentence that says what the page came to say, set over a short primary
 * rule in the `.statement` treatment the head office reserves for a line it
 * wants read on its own. About carried the only one on the site ("The unique
 * and trustworthy partner for EMC solutions worldwide."); the August 2026
 * review asked for every page to end the same way, so `PageShell` draws the
 * band now and this table is what it draws.
 *
 * Keyed by path rather than written into each branch's own copy table, which is
 * the one place this site departs from keeping copy beside its section module.
 * The reason is the question the band exists to answer: *every* page ends this
 * way, and "does every page have one" has to be answerable by reading one file
 * rather than eleven. `tests/rendered-html.test.mjs` asserts the same thing
 * against the export, so a new route with no line here fails the test run
 * rather than shipping a page that stops mid-air.
 *
 * What a line is, and what it is not:
 *
 *  - It is the page's conclusion, not its summary. The intro under the h1
 *    already says what the page holds; repeating that at the foot would hand a
 *    reader the same sentence twice and a reason not to read the second.
 *  - It is one sentence. The type is 26–38px on a 900px measure, so two
 *    sentences here become a paragraph in display type.
 *  - It carries no figure a reader would want to check — no model counts, no
 *    dimensions. Those belong in the tables above, where they can be held
 *    against a drawing.
 *
 * English is written first and Korean against it, rather than translated word
 * for word: the two locales land the same point in the register each reads
 * naturally. Model designations, bands and standard numbers stay in their
 * published form in both, as everywhere else on this site.
 */
export const closingLines = {
  zh: {
    /* The landing page. What it closes on is the one thing no competitor on
       this market offers whole — the room, what goes inside it, and the
       standard both answer to, from a single supplier. */
    "/": "舱室，舱内的测试设备，甚至必须通过的标准——一个合作伙伴承担全部责任。",

    /* Company. About keeps the head office's own line, which is where this
       whole treatment came from. */
    "/company/about": "全球EMC解决方案唯一可靠的合作伙伴。",
    "/company/publications": "研究并没有在论文中结束——结果现在作为吸波器矗立在暗室的墙壁上。",
    "/company/events": "了解暗室的最快方法就是站在它前面。",

    /* Contact. The page's whole argument is that an enquiry does not have to be
       complete before it is worth sending. */
    "/contact": "请告诉我们两件事：标准和被测设备，我们一起缩小剩下的范围。",

    /* CyberShield, on the three verbs the page makes its case with: adapts,
       assembles alongside live operations, is proven by measurement. */
    "/cybershield": "根据设施配置、不停工施工、并经现场测量验证的电磁边界。",

    "/downloads": "目录和证书位于一处 — 如果此处没有您需要的信息，请告知我们。",
    "/mychamber": "问两到三个问题后，会显示所需暗室的名称。",
    "/myenquiry": "一份清单，一份询问——在您发送之前，它不会离开此浏览器。",

    /* The two legal pages. Neither is read for pleasure and both are read for
       one specific thing; the line names that thing. */
    "/imprint": "运营本网站的公司及其责任已公开。",
    "/privacy": "没有cookie，没有跟踪，没有外部请求——除了您发送给我们的信息之外，我们没有任何信息。",

    /* Anechoic Chambers — the overview, the four industries, the six chamber
       types, the five technology pages, then one line per model page. */
    "/chambers": "一种渗透所有腔室的吸波材料技术——可用于工业和腔室形式。",

    "/chambers/industry/automotive": "从单个ECU到整车，汽车EMC标准测试都是在一个系列的室中进行的。",
    "/chambers/industry/military": "从零件单元到车辆，都是按照防御程序必须证明的条件建造的。",
    "/chambers/industry/commercial": "无论什么产品或测量距离，该系列都有适合的腔体。",
    "/chambers/industry/powertrain": "负载、车轴，甚至被测传动系统 — 在单个屏蔽边界内一起旋转。",

    "/chambers/type/sac": "在标准规定的测量距离上，在地平面上进行官方认证的发射和抗扰度测试。",
    "/chambers/type/fac": "无接地层的自由空间条件 — 对于最初不在接地层上使用的产品。",
    "/chambers/type/chc": "如何在现在安全的区域内开始，而不放弃正式的认证抗扰度测试。",
    "/chambers/type/component": "被测设备在箱内，测量仪器和负载在箱外。",
    "/chambers/type/rvc": "在没有吸波材料的情况下产生的统计电磁场——场强更高，驱动功率更小。",
    "/chambers/type/shielded-room": "可拆卸、可移动、可重建的屏蔽——每次都能保证屏蔽性能。",

    "/chambers/frankosorb": "吸波器不是购买的零件，而是直接设计、测试、制造的产品。",
    "/chambers/shielding-gates": "屏蔽性能最终由必须在墙上开的开口决定。",
    "/chambers/automation": "转台、桅杆和控制器——将腔室转化为实际测量结果的设备。",
    "/chambers/stirrers": "即使在没有吸波材料的暗室中也能产生电场的是连续旋转的金属板。",
    "/chambers/services": "该试验室只是检测实验室的一部分。我们将一起设计其余的部分。",
    "/chambers/references": "世界各地的暗室，以及每天运营暗室的客户。",

    "/chambers/model/sac-3-plus": "3.0 m 腔室在磁性等级方面最受选择 - 所有四种尺寸均经过全面认证。",
    "/chambers/model/sac-3-square": "传统的方形 3.0 m 腔室 — 适合大型转盘和移动测功机。",
    "/chambers/model/sac-5-plus": "一个圆顶内的两个测量距离——3.0m和5.0m一起使用，无需修改。",
    "/chambers/model/sac-5-square": "方形 5.0 m 腔室 — 静区延伸至 ø4.0 m。",
    "/chambers/model/sac-10-plus": "Frankonia 制造的最紧凑外壳中的完整 10.0 m 测试场地。",
    "/chambers/model/sac-10-plus-triton": "一个外壳中的三个测试轴——它们之间不需要移动任何东西。",
    "/chambers/model/sac-10-h-hybrid": "Frankosorb® 混合衬里，以及专为您实际需要的静区域量身定制的外壳。",
    "/chambers/model/sac-10-p-pyramid": "前长金字塔衬砌——同样的10.0m性能，更低的施工成本。",
    "/chambers/model/sac-10-v": "测功机不是后来引进的设备，而是暗室的一部分。",
    "/chambers/model/avtc": "零部件、车辆，甚至商业产品——在三管齐下的标准测试室中。",
    "/chambers/model/actc": "CISPR 25 组件测试距离为 1.0 m，可达 L 配置的车辆。",
    "/chambers/model/ucc": "安装面积相当于GTEM室大小，满足腔室的测量条件。",
    "/chambers/model/ctc": "1个元件测试室满足5个电阻标准。",
    "/chambers/model/chc": "在暗室不会进入的位置进行预认证发射和正式认证抗扰度测试。",
    "/chambers/model/chc-plus": "在同一紧凑室中，官方认证的 1 GHz 以上发射测量。",
    "/chambers/model/fac-3": "桌面产品的自由空间条件——无地平面，有正式认证。",
    "/chambers/model/fac-3-l": "相同的自由空间条件已扩展到包括固定产品和高度扫描。",
    "/chambers/model/sac-3-fac-3-transformer": "在一个空间内进行两个腔室的测试——每种配置的性能单独保证。",
    "/chambers/model/rvc": "从单个部件到大型车辆，七种尺寸的统计电磁场相同。",
    "/chambers/model/mil-chc": "在紧凑型混合外壳中进行 MIL-STD 461 · DO-160 组件测试。",
    "/chambers/model/mil-std-chamber": "完全符合程序所需的尺寸——在 1.0 m 距离处符合 MIL-STD 461。",
    "/chambers/model/mil-std-chamber-advanced": "同时满足军用标准和商业测试场地要求的单室。",
    "/chambers/model/edtc-sa": "被测电机在室内，负载在室外，轴穿过屏蔽罩。",
    "/chambers/model/edtc-ax": "具有两个装载机、一个电驱桥和通过护罩的专利配置。",
    "/chambers/model/edtc-bb": "负载与驱动系统一起进入腔室——四象限操作，移动式。",
    "/chambers/model/shielded-room": "高达 120 dB，无尺寸限制 — 并且可以拆卸并在其他地方重新安装。",

    /* EMC Test Systems — the overview, the eight product families, the four
       disciplines and the standards index. */
    "/test-systems": "实际进行测量的设备，与放置该设备的空间相同。",

    "/test-systems/product/amplifier": "输出为所有抗扰度测试供电 — 固态 12 kW，宽带高达 40 GHz。",
    "/test-systems/product/antenna": "无论发射还是接收，一个系列涵盖了从9kHz到40GHz的测试两侧。",
    "/test-systems/product/efs": "用光纤测量被测设备实际接收到的电场——使得测量行为不会震动电场。",
    "/test-systems/product/preamp": "信号和本底噪声之间的余量是在接收器的前部产生的。",
    "/test-systems/product/meter": "渐进功率和反射功率，以及它们之间的射频路径——股票换算，无需猜测。",
    "/test-systems/product/system": "一台机架完成测试——发生器、放大器、耦合网络和控制在一台设备中。",
    "/test-systems/product/emission": "CISPR 16-1-1 Ed 3.1 官方认证测量，FFT 硬件为标准配置。",
    "/test-systems/product/coupling": "从电缆携带干扰波并再次将其消除的设备——传导抗扰度测试的开始和结束。",

    "/test-systems/test/emission": "构成双管齐下发射测量配置的所有设备，辐射和传导 - 从 9 kHz 到 40 GHz。",
    "/test-systems/test/conducted": "干扰波通过电缆传播——因此测试配置以电缆为中心。",
    "/test-systems/test/radiated": "建立、验证和维持 20 MHz 至 18 GHz 的场强。",
    "/test-systems/test/magnetic": "直流至 250 kHz，高达 1000 A/m — 天线无法到达的频段。",

    "/test-systems/standards": "从必须通过的标准开始，所需设备清单如下。",
  },
  en: {
    "/": "One partner for the chamber, for the instruments inside it, and for the standard both answer to.",

    "/company/about": "The unique and trustworthy partner for EMC solutions worldwide.",
    "/company/publications": "Research that did not stay on paper — it is standing in the chambers, as absorber walls.",
    "/company/events": "The quickest way to understand a chamber is to stand in front of one.",

    "/contact": "Tell us the standard and the EUT; the rest we narrow down together.",

    "/cybershield": "A boundary that adapts to the facility, is built without stopping it, and is proven by measurement on site.",

    "/downloads": "The catalogues and the certificates in one place — and if what you need is not here, say so.",
    "/mychamber": "Two to five questions, and the chamber you need has a name.",
    "/myenquiry": "One list, one enquiry — and nothing leaves this browser until you send it.",

    "/imprint": "Who operates this site, and who answers for it.",
    "/privacy": "No cookies, no tracking, no third-party requests — what you send us is all we hold.",

    "/chambers": "One absorber technology behind every chamber — reached by industry or by chamber type.",

    "/chambers/industry/automotive": "From a single ECU to a complete vehicle, inside one family of chambers.",
    "/chambers/industry/military": "Component level up to the vehicle, built to what the programme has to prove.",
    "/chambers/industry/commercial": "Whatever the product and whatever the measuring distance, this range is sized for it.",
    "/chambers/industry/powertrain": "The load machine, the shaft and the drive under test, running inside one shielded boundary.",

    "/chambers/type/sac": "Full compliant emission and immunity over a ground plane, at the distance the standard names.",
    "/chambers/type/fac": "Free-space conditions without a ground plane — for products that never sit on one.",
    "/chambers/type/chc": "A way to start in the floor area you already have, without giving up compliant immunity.",
    "/chambers/type/component": "The test object inside the chamber; the instruments and the load outside it.",
    "/chambers/type/rvc": "A statistical field made without absorbers — far higher field strength for far less drive power.",
    "/chambers/type/shielded-room": "Shielding you can dismantle, move and put up again, with the attenuation guaranteed each time.",

    "/chambers/frankosorb": "The absorber is not bought in. It is designed, tested and made here.",
    "/chambers/shielding-gates": "A shield is only ever as good as the openings that had to be cut into it.",
    "/chambers/automation": "The turntable, the mast and the controller — what turns a chamber into a measurement.",
    "/chambers/stirrers": "In a room with no absorbers, what evens the field out is a sheet of steel that never stops turning.",
    "/chambers/services": "The chamber is one part of a laboratory. We plan the rest of it with you.",
    "/chambers/references": "Chambers standing on every continent, and the customers who run them daily.",

    "/chambers/model/sac-3-plus": "The most selected chamber in its class — four sizes, every one of them full compliant.",
    "/chambers/model/sac-3-square": "The traditional square 3.0 m chamber, with room for a large turntable or a mobile dynamometer.",
    "/chambers/model/sac-5-plus": "Two measuring distances in one dome — 3.0 m and 5.0 m, with nothing rebuilt in between.",
    "/chambers/model/sac-5-square": "The square 5.0 m chamber, opening out to a ø4.0 m quiet zone.",
    "/chambers/model/sac-10-plus": "A full 10.0 m test site in the most compact shell Frankonia builds.",
    "/chambers/model/sac-10-plus-triton": "Three test axes in one shell — and nothing to move between them.",
    "/chambers/model/sac-10-h-hybrid": "Frankosorb® hybrid lining, in a shell sized to the quiet zone you actually need.",
    "/chambers/model/sac-10-p-pyramid": "Long-pyramid lining throughout — the same 10.0 m performance at a lower build cost.",
    "/chambers/model/sac-10-v": "The dynamometer is not wheeled in afterwards. It is part of the chamber.",
    "/chambers/model/avtc": "Components, vehicles and commercial products — three standards worth of testing in one chamber.",
    "/chambers/model/actc": "CISPR 25 component testing at 1.0 m, and in the L configuration the vehicle as well.",
    "/chambers/model/ucc": "The footprint of a GTEM cell, the measuring conditions of a chamber.",
    "/chambers/model/ctc": "One component chamber, answering five immunity standards.",
    "/chambers/model/chc": "Pre-compliance emission and full compliant immunity, where a chamber would not fit before.",
    "/chambers/model/chc-plus": "The same compact chamber, now measuring emission compliantly above 1 GHz.",
    "/chambers/model/fac-3": "Free-space conditions for table-top products — no ground plane, and full compliant.",
    "/chambers/model/fac-3-l": "The same free-space conditions, widened to floor-standing products and a height scan.",
    "/chambers/model/sac-3-fac-3-transformer": "Two chambers worth of testing in one room, each configuration guaranteed on its own.",
    "/chambers/model/rvc": "From a single component to a large vehicle — the same statistical field, in seven sizes.",
    "/chambers/model/mil-chc": "MIL-STD 461 and DO-160 component testing, in the compact hybrid shell.",
    "/chambers/model/mil-std-chamber": "Built to the size the programme needs, to MIL-STD 461 at 1.0 m.",
    "/chambers/model/mil-std-chamber-advanced": "One chamber that satisfies the defence standard and the commercial test site alike.",
    "/chambers/model/edtc-sa": "The motor under test inside, the load machine outside, the shaft through the shield.",
    "/chambers/model/edtc-ax": "Two load machines, one e-axle, and a patented way through the wall.",
    "/chambers/model/edtc-bb": "The load machine comes into the chamber with the drive — four-quadrant, and mobile.",
    "/chambers/model/shielded-room": "Any size, up to 120 dB — and it can be taken down and rebuilt somewhere else.",

    "/test-systems": "The instruments that take the measurement, from the same place as the room around them.",

    "/test-systems/product/amplifier": "The drive behind every immunity test — solid-state to 12 kW, wideband to 40 GHz.",
    "/test-systems/product/antenna": "Transmit or receive, 9 kHz to 40 GHz — one range covering both halves of the test.",
    "/test-systems/product/efs": "What the EUT actually sees, read out over fibre so that measuring does not disturb the field.",
    "/test-systems/product/preamp": "The margin between a signal and the noise floor is made ahead of the receiver.",
    "/test-systems/product/meter": "Forward power, reflected power and the RF paths between — measured and switched, not estimated.",
    "/test-systems/product/system": "A whole test in one rack — generator, amplifier, coupling and control under a single cover.",
    "/test-systems/product/emission": "Full compliance to CISPR 16-1-1 Ed 3.1, with the FFT hardware fitted as standard.",
    "/test-systems/product/coupling": "What puts the disturbance on the cable and takes it back off — both ends of a conducted test.",

    "/test-systems/test/emission": "Everything a radiated or conducted emission setup is built from, 9 kHz to 40 GHz.",
    "/test-systems/test/conducted": "The disturbance arrives on the cable, so the setup is built around the cable.",
    "/test-systems/test/radiated": "Field strength you set, verify and hold, from 20 MHz to 18 GHz.",
    "/test-systems/test/magnetic": "DC to 250 kHz and up to 1000 A/m — the band no antenna reaches.",

    "/test-systems/standards": "Start from the standard you have to pass, and the equipment list follows.",
  },
} as const satisfies Record<Lang, Record<string, string>>;

/** The closing line for one page, by the same path its breadcrumb and its
 *  sitemap entry use. `undefined` where a route is not a page a reader is meant
 *  to read to the end — the `/mycart` redirect is the only one of those. */
export const closingLine = (lang: Lang, path: string): string | undefined =>
  (closingLines[lang] as Record<string, string | undefined>)[path];
