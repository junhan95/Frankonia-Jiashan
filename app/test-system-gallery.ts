import type { Plate } from "./page-body";
import type { Lang } from "./site-config";

/**
 * The photograph a model row opens onto, per model.
 *
 * Same split as chamber-gallery, and for the same reason: `frames` carries what
 * is true of the file — where it is and how big — and is written once; `alt`
 * carries what a reader is told, and is written per locale. A single per-locale
 * table would have meant two copies of every width and height, and the pair
 * that drifts apart is the pair that puts a page into layout shift.
 *
 * Usually one frame per model, not two or three. The chamber branch has a page
 * per model and three photographs behind each; the head office photographs an
 * instrument once, against a studio backdrop, and that one cutout is normally
 * all there is. The gallery's stepper only appears above more than one frame,
 * so a list of singles renders as a plain plate — which is what most of these
 * are. The RSU is the exception, and its own note says why.
 *
 * Keyed by `TestModel.name`, because that is what the model list is keyed by:
 * these products have no slug, having no page of their own.
 *
 * **A model missing from this table is not an omission.** Most of the
 * instruments here are not photographed by the head office — the four EFS
 * probes share one picture of a probe, the PSG-300A and the PMS 1084 B share
 * their sibling's enclosure, and the seventy amplifiers have no photograph at
 * all (test-systems-assets.md). A row with no frame still opens: its panel is
 * the figures alone, which is the half of the panel the source actually
 * supports.
 */

type Frame = Pick<Plate, "src" | "w" | "h">;

const p = (file: string, w: number, h: number): Frame =>
  ({ src: `/test-systems/images/${file}`, w, h });

const frames: Record<string, readonly Frame[]> = {
  "ALX-4000E": [p("antenna-alx-4000.webp", 1600, 1200)],
  "MAX-9": [p("antenna-max-9.webp", 1200, 900)],
  "MAX-18": [p("antenna-max-18.webp", 1024, 768)],
  "HAX-6": [p("antenna-hax-6.webp", 1600, 1200)],
  "HAX-18": [p("antenna-hax-18.webp", 1200, 900)],
  "HAX-40": [p("antenna-hax-40.webp", 1200, 900)],
  "LAX-10": [p("antenna-lax-10.webp", 859, 1021)],
  "FPA-18": [p("preamp-fpa-18.webp", 850, 567)],
  "FPA-40": [p("preamp-fpa-40.webp", 1006, 249)],
  "PMS 1084": [p("meter-pms-1084.webp", 1600, 249)],
  // The one row with two frames. The head office's August 2026 mail sent the
  // RSU's new front twice — once in perspective and once flat on — and the two
  // answer different questions: the perspective one is what the instrument
  // looks like, the flat one is what the display actually reads during a test.
  RSU: [p("meter-rsu.webp", 1400, 481), p("meter-rsu-front.webp", 1400, 387)],
  "CIT-100": [p("system-cit-100.webp", 1600, 609)],
  "CIT-1000": [p("system-cit-1000.webp", 1200, 897)],
  "ERX-6": [p("emission-erx-6.webp", 1400, 1003)],
  "ECU-6": [p("system-ecu-6.webp", 1032, 519)],
  "PSG-300": [p("system-psg-300.webp", 1400, 531)],
  "MTS-800": [p("system-mts-800.webp", 1400, 782)],
  "EFS-18": [p("efs-18.webp", 1200, 921)],

  // The coupling family, out of the datasheets themselves rather than off a
  // product page — the head office has no web page for most of these, and the
  // sheets carry both a photograph of the enclosure and the simplified circuit
  // for each type. Both are worth showing and they answer different questions:
  // the photograph is which box arrives, the diagram is what is inside it and
  // which of AE, EUT and RF-in goes where. So most of these rows carry two
  // frames, photograph first.
  //
  // Four rows are a diagram alone. The head office photographs the CDN-S,
  // CDN-CAN and the IEC/EN 61000-4-16 networks nowhere in the five sheets it
  // sent, and inventing a stand-in from a neighbouring type would be showing a
  // reader the wrong enclosure. `CDN-USB / HDMI / Firewire / RJ45-S` has
  // neither and stays a row of figures — see the note on `modelShots`.
  "CDN-AF2 … AF8": [p("coupling-cdn-af.webp", 766, 700), p("coupling-cdn-af-circuit.webp", 866, 738)],
  "CDN-M1 … M5": [p("coupling-cdn-m.webp", 648, 618), p("coupling-cdn-m-circuit.webp", 900, 517)],
  "CDN-T2 / T4 / T8": [p("coupling-cdn-t.webp", 588, 512), p("coupling-cdn-t-circuit.webp", 530, 698)],
  "CDN-RJ45": [p("coupling-cdn-rj45.webp", 632, 554), p("coupling-cdn-rj45-circuit.webp", 900, 503)],
  "CDN-CAN-L4 / L5": [p("coupling-cdn-can-circuit.webp", 694, 563)],
  "CDN-S1 … S25": [p("coupling-cdn-s-circuit.webp", 900, 843)],
  "CN AF2 / AF4 / AF8": [p("coupling-cn.webp", 1024, 667), p("coupling-cn-af-circuit.webp", 715, 434)],
  "CN M2 / M3 / M4 / M5": [p("coupling-cn-m-circuit.webp", 715, 434)],
  "CN T2 / T4 / T8": [p("coupling-cn-t-circuit.webp", 715, 434)],
  "CN RJ45": [p("coupling-cn-rj45-circuit.webp", 688, 403)],
  "IT-6 / IT-16 / IT-20": [p("coupling-it.webp", 1024, 669), p("coupling-it-three-phase.webp", 452, 440)],
  // One photograph for two clamps, because the two datasheets print the same
  // one: the EMCL-20 and the EMCL-35 differ in the cable they close over and
  // in nothing a photograph of the open clamp shows. The alt says what is in
  // the picture and does not claim a size — the figures do that.
  "EMCL-20": [p("coupling-emcl.webp", 1400, 685), p("coupling-emcl-calibration.webp", 934, 509)],
  "EMCL-35": [p("coupling-emcl.webp", 1400, 685)],
  "BCI probe": [p("coupling-bci.webp", 900, 675), p("coupling-bci-jig.webp", 605, 609)],
};

/**
 * What is in each frame, per locale.
 *
 * These say what is visible and nothing else — the ledger's rule for every alt
 * on the site. Seven of them are the wording the same file already carries as
 * the page's own plate, repeated verbatim rather than paraphrased: it is the
 * same photograph, and a second description of it would only be a second
 * chance to describe it differently.
 *
 * There is no caption rule to worry about here, because the panel prints no
 * captions. The figures under the picture are the caption's job.
 *
 * A model with more than one frame carries a list, one entry per frame in the
 * frame's own order — two photographs of the same instrument show two different
 * things, and giving both the same sentence would tell a reader stepping from
 * the first to the second that nothing changed.
 */
const alt: Record<Lang, Record<string, string | readonly string[]>> = {
  en: {
    "ALX-4000E":
      "The ALX-4000E on a mast: a bow-tie element at the back and a tapering log-periodic boom of red-tipped elements in front",
    "MAX-9": "The MAX-9 under its red plastic protection cover, mounted on a tube",
    "MAX-18":
      "The MAX-18 under a red plastic protection cover, a flattened triangular wedge on a mounting tube with the feed cable leaving at the back",
    "HAX-6": "The HAX-6 broadband horn antenna on its mast, aperture facing the camera",
    "HAX-18": "The HAX-18, a silver pyramidal horn on a mounting tube",
    "HAX-40": "The HAX-40, a small horn with a waveguide transition and an SMA-compatible connector",
    "LAX-10":
      "The LAX-10: a grey shielded loop with a red marker at the top, standing on a rectangular amplifier box carrying a type plate and two indicator lamps",
    "FPA-18":
      "The FPA-18, a black anodised housing whose type plate reads “Broadband Preamplifier 1-18 GHz, Gain: 33 +/- 2.5 dB typ.”, with black and red banana jacks below it",
    "FPA-40":
      "The FPA-40 seen lengthwise: a slim silver housing lettered “18 - 40 GHz Preamplifier, Gain: 35 dB” beside an electrostatic-sensitive-device warning",
    "PMS 1084": "The PMS 1084 as a 1U rack unit, front panel lettered “RF Power Meter”",
    RSU: [
      "The RSU seen from the front and slightly above: a light grey 3U case with a silver bow handle at each end, a red Frankonia nameplate, the SET, STATE and RELAY buttons with their lamps, a dark display, “RELAY SWITCHING UNIT” on a grey block and a POWER button beside the red RSU name strip",
      "The RSU front panel head on, its display reading “Relay: State/Type” over “1:0/3  2:1/3  3:2/3  4:3/3” and the two lines “Interlock 1 2 3 4” and “Tripped 0 0 0 0”",
    ],
    "CIT-100": "The CIT-100 in a 19-inch case, front panel lettered “Conducted Immunity Test System”",
    "CIT-1000":
      "The CIT-1000 seen from the front and slightly to the side: a 19-inch case with dark blue corner rails and a bail handle at the right, a red Frankonia nameplate, a wide dark touch screen across the panel, the FAULT, INTERLOCK and READY lamps above the RF-OUT connector, RF-IN in the middle, a round ON / OFF button and a red CIT-1000 name strip",
    "ERX-6":
      "The ERX-6 in three-quarter view: a grey bench case with a carrying bail, a red side panel lettered ERX-6, and an 8.4-inch touch screen showing a frequency scan with the FREQ. SCAN, TRANSDUCER, LIMIT LINES, CURVES, SETTINGS, MARKER, SAVE SETTINGS and RUN keys down its right edge",
    "ECU-6":
      "The ECU-6 in a 4U rack case, front panel lettered “EMC CONTROL UNIT”, with an interlock button, a yellow OLED readout showing frequency and forward and reverse power, an RF-ON lamp and a power switch",
    "PSG-300":
      "The PSG-300 front panel, lettered “POWER SIGNAL GENERATOR DC … 300 kHz”, with an earth terminal, the OUT 50 Ω socket and the red and black OUT terminals, the PROTECTION and READY lamps, the POWER SUPPLY HIGH and AMPLIFIER ON buttons, a round ON / OFF button and a silver bow handle at each end",
    "MTS-800":
      "The MTS-800 front panel, lettered “Magnetic Test System”, with banana jacks, BNC inputs and a mains switch",
    "EFS-18":
      "The EFS-18 on a small flexible tripod: a white spherical sensor head marked “EFS-18 1MHz – 18GHz E-Field”, with its cable coiled beside the base and ending in a small charging module",

    "CDN-AF2 … AF8": [
      "A CDN-AF8 on its mounting plate: a white enclosure with a red band, lettered “CDN-AF8 — Coupling / Decoupling Network — 150 kHz – 230 MHz”, an “HF In (Pcont ≤ 6W)” N socket on the top face, and a black end panel of eight numbered 2 mm sockets under “EUT PORT max 100 V 1 A”",
      "The simplified circuit of the CDN-AF2: RF in through a 204 Ω resistor and a 10 nF capacitor onto line 1, a choke of more than 200 µH between AE and EUT, and 47 nF to the ground reference on line 2",
    ],
    "CDN-M1 … M5": [
      "A CDN-M5 on its mounting plate, lettered “CDN-M5 — Coupling / Decoupling Network — 150 kHz – 230 MHz”, with an “HF In” N socket and a black end panel of five 4 mm safety sockets marked L3, N, L2, PE and L1 under “EUT PORT 500 VAC 1000 VDC 50/60 Hz 32 A”",
      "The simplified circuit of the CDN-M5: RF in through a 50 kΩ resistor onto five 10 nF capacitors, one per conductor, behind a five-winding choke of more than 200 µH between AE and EUT, with 47 nF from each line to the ground reference",
    ],
    "CDN-T2 / T4 / T8": [
      "A CDN-T2 on its mounting plate, lettered “CDN-T2 — Coupling / Decoupling Network — 150 kHz – 230 MHz”, with an “HF In” N socket and a black end panel of two 2 mm sockets numbered 1 and 2 under “EUT PORT max 150 V 0.5 A”",
      "The simplified circuit of the CDN-T2: RF in through a transformer, a 204 Ω resistor and two 10 nF capacitors onto the pair, with a bifilar choke of more than 30 mH between AE and EUT",
    ],
    "CDN-RJ45": [
      "A CDN-RJ45 on its mounting plate, lettered “CDN-RJ45 — Coupling / Decoupling Network — 150 kHz – 230 MHz”, with an “HF In” N socket and a black end panel carrying a single RJ45 socket under “EUT PORT max 100 V 0.5 A”",
      "The simplified circuit of the CDN-RJ45: RF in through a 50 kΩ resistor onto eight 10 nF capacitors, one per pin, behind the crossed pairs and their chokes between the AE and EUT RJ45 sockets",
    ],
    "CDN-CAN-L4 / L5": "The simplified circuit of the CDN-CAN-L4: RF in through a 400 Ω resistor and 10 nF capacitors onto Sub-D pins 2 and 7 behind a choke of more than 30 mH, and onto pins 3 and 9 behind one of more than 200 µH, with 47 nF to the ground reference",
    "CDN-S1 … S25": "The simplified circuit of the CDN-Sx: the cable screen carried straight through from AE to EUT over a choke of more than 200 µH, with RF in coupled to it through a 100 Ω resistor",
    "CN AF2 / AF4 / AF8": [
      "A coupling network for EN 61000-4-16: a grey steel box on a mounting plate, an N socket on the side, and a black end panel whose plate reads “EUT Port [max 100V / 0,5A] 1 2 3 4” above four blue terminals",
      "The datasheet's AF2 row: the simplified diagram of a two-line coupling network — a resistor R and a capacitor C in series from the common point to each line, with SW3 across the capacitors, AE at the left and EUT at the right",
    ],
    "CN M2 / M3 / M4 / M5": "The datasheet's M2/AC row: the simplified diagram of a two-conductor powerline coupling network — a resistor R and a capacitor C per conductor, no shorting switch, AE at the left and EUT at the right",
    "CN T2 / T4 / T8": "The datasheet's T2 row: the simplified diagram of a balanced coupling network — a bifilar-wound inductor L in the line, a second L, the resistors R and the capacitors C with SW3 across them, AE at the left and EUT at the right",
    "CN RJ45": "The datasheet's RJ45 row: the simplified diagram of an eight-line balanced coupling network — a resistor R and a capacitor C per line with SW3 across the capacitors, AE at the left and EUT at the right",
    "IT-6 / IT-16 / IT-20": [
      "An isolation transformer: a grey steel case with two 4 mm sockets and an EUT plate on the front face, a green earth terminal below them and a warning label beside it",
      "Three transformers in star configuration: L1, L2 and L3 each entering its own transformer and leaving as l1, l2 and l3, the earthed star point drawn under them and lettered Yy0",
    ],
    "EMCL-20": [
      "An EM coupling clamp lying open, its two halves apart: a long white housing in each, a ferrite rail running the length of both, an N socket at one end and toggle latches along the sides",
      "The calibration set supplied with the clamp: two mounting brackets carrying the 50/150 Ω transition, and a long brass rod lying between them",
    ],
    "EMCL-35":
      "An EM coupling clamp lying open, its two halves apart: a long white housing in each, a ferrite rail running the length of both, an N socket at one end and toggle latches along the sides",
    "BCI probe": [
      "The bulk current injection probe: a hinged aluminium clamp with a round aperture through the middle, an SMA-compatible socket on the side and a spring clip on the front edge",
      "The calibration jig for the probe: an aluminium stand with a vertical plate, a coaxial socket on each side and an aperture through the middle for the probe to close over",
    ],
  },
  zh: {
    "ALX-4000E":
      "ALX-4000E 安装在桅杆上 — 对数周期吊杆，后部带有蝴蝶结元件，前部逐渐变短的红尖元件",
    "MAX-9": "MAX-9安装在带有红色塑料保护盖的管子上",
    "MAX-18":
      "MAX-18 带红色塑料保护盖 — 扁平三角形楔形放置在安装管上，馈电电缆从背面引出",
    "HAX-6": "HAX-6 宽带喇叭天线安装在桅杆上，孔径朝前",
    "HAX-18": "安装在安装管上的银色金字塔喇叭HAX-18",
    "HAX-40": "带有波导过渡和 SMA 兼容连接器的紧凑型喇叭 HAX-40",
    "LAX-10":
      "LAX-10 — 顶部带有红色标记的灰色屏蔽屋顶位于带有铭牌和两个指示灯的矩形放大器盒上方。",
    "FPA-18":
      "FPA-18 — 黑色阳极氧化外壳，铭牌上写有“宽带前置放大器 1-18 GHz，增益：33 +/- 2.5 dB（典型值）”下面是黑色和红色的香蕉插孔。",
    "FPA-40":
      "FPA-40 的侧视图 — 薄薄的银色外壳，带有“18 - 40 GHz 前置放大器，增益：35 dB”和并排放置的静电警告标签。",
    "PMS 1084": "PMS 1084采用1U机架单元形式，前面板上标有“RF Power Meter”",
    RSU: [
      "略从上方看 RSU — 浅灰色 3U 外壳，两端带有银色弓形手柄，红色 FRANKONIA 铭牌，带指示灯的 SET·STATE·RELAY 按钮，黑色显示屏，灰色块写有“RELAY SWITCHING UNIT”，红色 RSU 名称带旁边的 POWER 按钮",
      "RSU 前面板从正面看 — 显示屏显示两行：“Relay: State/Type”和“1:0/3 2:1/3 3:2/3 4:3/3”，下面是“Interlock 1 2 3 4”和“Tripped 0 0 0 0”。",
    ],
    "CIT-100": "19英寸机箱中的CIT-100，前面板上标有“传导抗扰度测试系统”",
    "CIT-1000":
      "从正面以小角度观察 CIT-1000 — 19 英寸外壳，带海军蓝色角轨和右手柄，左上角有红色 FRANKONIA 铭牌，面板上宽阔的深色触摸屏，RF-OUT 连接器上方的 FAULT·INTERLOCK·READY 指示灯，中间的 RF-IN，圆形 ON/OFF 按钮和红色 CIT-1000 名称带。",
    "ERX-6":
      "从某个角度看 ERX-6 — 带手柄面纱的灰色工作台箱、写有 ERX-6 的红色侧面板、频率扫描屏幕和右侧边缘的 FREQ。 8.4英寸触摸屏，带有可视扫描·传感器·限制线·曲线·设置·标记·保存设置·运行键",
    "ECU-6":
      "4U 机架中的 ECU-6 — 前面板上的“EMC CONTROL UNIT”符号、互锁按钮、带有频率、进度和反射功率的黄色 OLED 显示屏、RF-ON 指示灯和电源开关",
    "PSG-300":
      "PSG-300 前面板 — “电源信号发生器 DC … 300 kHz”符号、接地端子和 OUT 50 Ω 插座、红色/黑色 OUT 端子、保护/就绪指示灯、电源高/放大器开按钮、圆形开/关按钮、两端银色弓形手柄",
    "MTS-800":
      "MTS-800 前面板带有“磁性测试系统”符号 — 香蕉插孔、BNC 输入、电源开关",
    "EFS-18":
      "EFS-18 安装在一个小型柔性三脚架上 - 一个白色球形传感器头，上面写有“EFS-18 1MHz – 18GHz E-Field”，以及一个小型充电模块，位于缠绕在底座上的电缆末端。",

    "CDN-AF2 … AF8": [
      "安装板上的 CDN-AF8 — 白色外壳，带有红色条纹，标记为“CDN-AF8 — 耦合/去耦网络 — 150 kHz – 230 MHz”，“HF In (Pcont ≤ 6W)”N 插座位于顶部，2 mm 插座编号位于黑色侧 8 的“EUT 端口最大 100 V 1 A”下方",
      "CDN-AF2 简化电路图 — RF 输入通过 204 Ω 电阻器和 10 nF 电容器耦合到线路 1，AE 和 EUT 之间的扼流圈 >200 µH，从线路 2 到参考地的阻抗为 47 nF",
    ],
    "CDN-M1 … M5": [
      "安装板上的 CDN-M5 —“CDN-M5 — 耦合/去耦网络 — 150 kHz – 230 MHz”符号，“HF In”N 插座，4 mm 标记为 L3·N·L2·PE·L1，位于黑色一侧的“EUT 端口 500 VAC 1000 VDC 50/60 Hz 32 A”下方 五个安全插座",
      "CDN-M5 简化电路图 — RF 输入通过 50 kΩ 电阻器进入 5 个 10 nF 电容器，每个导体一个，AE 和 EUT 之间有一个 >200 µH 的 5 绕组扼流圈，每条线路到参考地的电阻为 47 nF。",
    ],
    "CDN-T2 / T4 / T8": [
      "安装板上的 CDN-T2 —“CDN-T2 — 耦合/去耦网络 — 150 kHz – 230 MHz”符号，“HF In”N 插座，黑色一侧“EUT 端口最大 150 V 0.5 A”下方的 1 号和 2 号 2 mm 插座。",
      "CDN-T2 简化电路图 — RF 输入通过变压器、204 Ω 电阻器、两个 10 nF 电容器以及 AE 和 EUT 之间 >30 mH 的双柱扼流圈耦合到该对。",
    ],
    "CDN-RJ45": [
      "安装板上的 CDN-RJ45 —“CDN-RJ45 — 耦合/去耦网络 — 150 kHz – 230 MHz”符号，“HF In”N 插座，黑色一侧“EUT 端口最大 100 V 0.5 A”下方的 1 个 RJ45 插座",
      "CDN-RJ45 简化电路图 — RF 输入通过 50 kΩ 电阻器进入 8 个 10 nF 电容器，每个引脚一个，交叉对和 AE 和 EUT 的 RJ45 插座之间的扼流圈。",
    ],
    "CDN-CAN-L4 / L5": "CDN-CAN-L4简单电路图——RF输入通过400Ω电阻和10nF电容连接到扼流器超过30mH后的Sub-D引脚2和7，以及扼流器超过200μH后的引脚3和9，并以47nF作为参考地。",
    "CDN-S1 … S25": "CDN-Sx 简化电路图 — 电缆屏蔽层通过超过 200 µH 的扼流圈从 AE 延伸到 EUT，RF 输入通过 100 Ω 电阻器耦合到该屏蔽层。",
    "CN AF2 / AF4 / AF8": [
      "EN 61000-4-16 组合网 — 安装板上有灰色钢板盒，侧面有 N 型插座，黑色横截面铭牌上写有“EUT 端口 [最大 100V / 0,5A] 1 2 3 4”，其下方有四个蓝色端子",
      "数据表AF2行——两线耦合网络的简化电路图。电阻R和电容C从公共点到每条线串联，SW3与电容并联。左边是AE，右边是EUT",
    ],
    "CN M2 / M3 / M4 / M5": "M2/AC 数据表行 — 双导体电力线耦合网络的简化电路图。每根导线有一个电阻R和一个电容C，并且没有短路开关。左边是AE，右边是EUT",
    "CN T2 / T4 / T8": "数据表第 T2 行 — 平衡耦合网络的简化电路图。线路中一个双线绕制电感L，其上方还有一个L，电阻R、电容C、与电容并联的SW3。左边是AE，右边是EUT",
    "CN RJ45": "RJ45排数据表——8线平衡耦合网络简化电路图。每条线路都有一个电阻R和一个电容C，SW3与电容并联。左边是AE，右边是EUT",
    "IT-6 / IT-16 / IT-20": [
      "隔离变压器 — 灰色钢壳，前面有两个 4 mm 插座，EUT 铭牌，下面有绿色接地端子，旁边有警告标签。",
      "星形连接的变压器——L1·L2·L3分别进入磁力变压器，出来为l1·l2·l3，并表示下面的中性点接地和Yy0。",
    ],
    "EMCL-20": [
      "两对 EM 配合夹 — 每对长白色外壳，全长铁氧体导轨，一端为 N 型插座，一侧为肘节闩锁。",
      "带有夹具的校准套件 — 两个带 50/150 Ω 过渡的安装支架以及位于它们之间的长黄铜杆。",
    ],
    "EMCL-35":
      "两对 EM 配合夹 — 每对长白色外壳，全长铁氧体导轨，一端为 N 型插座，一侧为肘节闩锁。",
    "BCI probe": [
      "BCI 注入探针 — 铰接式铝夹，中心有圆形开口，侧面有 SMA 兼容插座，前缘有弹簧夹",
      "探头校准夹具 — 带垂直板的铝制支架，两侧有同轴插座，中间有一个用于固定探头的开口。",
    ],
  },
};

/** This model's frames, ready for the accordion. Empty for a model the head
 *  office does not photograph — the caller renders the figures alone. */
export const modelShots = (lang: Lang, name: string): readonly Plate[] => {
  const described = alt[lang][name];
  return (frames[name] ?? []).map((frame, i) => ({
    ...frame,
    alt: Array.isArray(described) ? described[i] : (described as string | undefined),
  }));
};
