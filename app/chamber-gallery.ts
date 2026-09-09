import type { ChamberModel } from "./chamber-sections";
import type { Plate } from "./page-body";
import type { Lang } from "./site-config";

/**
 * The extra plates a model row opens onto, beyond the one its own page leads
 * with.
 *
 * Where they came from — the head office's own model pages, re-collected the
 * way docs/source/chambers-model-assets.md §1 describes — and how the two per
 * model were chosen is in that ledger, §6. The short version: the catalogue and
 * photobook PDFs were checked again and are still the wrong source (§4), the
 * web originals run 2,500 px on the long side against the catalogue's 150 ppi,
 * and they arrive already sorted by model because each model has a page.
 *
 * The shape is split in two on purpose. `frames` carries what is true of the
 * file — where it is and how big — and is written once; `alt` carries what a
 * reader is told, and is written per locale. A single per-locale table would
 * have meant two copies of every width and height, and the pair that drifts
 * apart is the pair that puts a page into layout shift.
 *
 * Four models have one extra rather than two: MIL CHC, MIL-STD Chamber, EDTC-AX
 * and EDTC-BB. The head office publishes three photographs of each, one of
 * which is the plate their page already leads with and one of which is the
 * dark backdrop that appears on all twenty-six pages. A gallery of two is what
 * the source supports, and inventing a third would mean showing a chamber that
 * is not this one.
 *
 * Keyed by our model slug, not the head office's — `sac-10-plus-triton`,
 * `edtc-sa` and `rvc` differ. See the note on `ChamberModel.slug`.
 */

type Frame = Pick<Plate, "src" | "w" | "h">;

const p = (file: string, w: number, h: number): Frame =>
  ({ src: `/chambers/models/${file}`, w, h });

const frames: Record<string, readonly Frame[]> = {
  actc: [p("actc-0.webp", 1400, 1400), p("actc-2.webp", 1400, 934)],
  ucc: [p("ucc-0.webp", 1400, 1400), p("ucc-1.webp", 1400, 1050)],
  ctc: [p("ctc-2.webp", 1050, 700), p("ctc-3.webp", 1400, 1050)],
  chc: [p("chc-0.webp", 1400, 1400), p("chc-1.webp", 1400, 933)],
  "chc-plus": [p("chc-plus-0.webp", 1400, 1050), p("chc-plus-1.webp", 1400, 933)],
  avtc: [p("avtc-3.webp", 1400, 933), p("avtc-5.webp", 1400, 933)],
  "sac-10-v": [p("sac-10-v-6.webp", 1400, 933), p("sac-10-v-1.webp", 1400, 778)],
  "edtc-sa": [p("edtc-1.webp", 1400, 788), p("edtc-4.webp", 1400, 933)],
  "edtc-ax": [p("edtc-ax-1.webp", 1400, 1167)],
  "edtc-bb": [p("edtc-bb-1.webp", 1400, 933)],
  "mil-chc": [p("mil-chc-0.webp", 1400, 1400)],
  "mil-std-chamber": [p("mil-std-chamber-1.webp", 1024, 500)],
  "mil-std-chamber-advanced": [
    p("mil-std-chamber-advanced-2.webp", 1400, 1050),
    p("mil-std-chamber-advanced-4.webp", 1400, 1050),
  ],
  "sac-3-plus": [p("sac-3-plus-0.webp", 1400, 1120), p("sac-3-plus-2.webp", 1400, 933)],
  "sac-3-square": [p("sac-3-square-0.webp", 1400, 1050), p("sac-3-square-2.webp", 933, 622)],
  "sac-5-plus": [p("sac-5-plus-0.webp", 1400, 1120), p("sac-5-plus-2.webp", 1400, 933)],
  "sac-5-square": [p("sac-5-square-0.webp", 1400, 875), p("sac-5-square-2.webp", 1400, 933)],
  "sac-10-plus": [p("sac-10-plus-0.webp", 1400, 1400), p("sac-10-plus-2.webp", 1400, 933)],
  "sac-10-plus-triton": [p("triton-4.webp", 1400, 933), p("triton-3.webp", 1400, 933)],
  "sac-10-h-hybrid": [p("sac-10-h-hybrid-0.webp", 1400, 1400), p("sac-10-h-hybrid-3.webp", 1400, 933)],
  "sac-10-p-pyramid": [p("sac-10-p-pyramid-0.webp", 1400, 1400), p("sac-10-p-pyramid-1.webp", 1024, 500)],
  "fac-3": [p("fac-3-0.webp", 1400, 1000), p("fac-3-1.webp", 1400, 933)],
  "fac-3-l": [p("fac-3-l-0.webp", 1400, 1050), p("fac-3-l-1.webp", 1400, 933)],
  "sac-3-fac-3-transformer": [
    p("sac-3-fac-3-transformer-0.webp", 1400, 1050),
    p("sac-3-fac-3-transformer-2.webp", 1400, 930),
  ],
  rvc: [p("reverberation-solutions-1.webp", 656, 437), p("reverberation-solutions-2.webp", 656, 437)],
  "shielded-room": [p("shielded-room-6.webp", 846, 564), p("shielded-room-2.webp", 1400, 933)],
};

/**
 * What is in each frame, in order, per locale.
 *
 * These say what is visible and nothing else — the ledger's rule for every alt
 * on the site. Where a picture is a sectioned render rather than a photograph
 * it says so, because a reader who cannot see it would otherwise be told the
 * room has no fourth wall.
 */
const alt: Record<Lang, Record<string, readonly string[]>> = {
  zh: {
    actc: [
      "ACTC 剪切渲染。箱形腔室内部覆盖有混合吸波体，天线支架和测试支架放置在地平面上。屋顶有红色钢梁。",
      "安装在红色支架上的对数周期天线指向接地平面上方的测试支架。后壁是黑色铁氧体面，侧面是白色吸收体。",
    ],
    ucc: [
      "UCC 剪裁渲染。它是一个柜子大小的暗室，门开着，其内壁由黑色铁氧体瓷砖和白色吸波材料隔开。接地平面上方有一个红色天线支架。",
      "铜接地板的特写视图。有一系列铜板用螺钉固定到位，白色测试台框架从它们上方经过。后面是吸收墙。",
    ],
    ctc: [
      "从上方看到的暗室视图。喇叭天线放置在木制测试台上，地板为地平面，墙壁和天花板为白色吸波体。",
      "天花板和墙壁相交的角落。一盏灯夹在白色吸收体之间，黑色铁氧体面暴露在其后面。",
    ],
    chc: [
      "CHC 剪切渲染。它是一个紧凑的箱形室，带有开放式屏蔽门，内部是由黑色铁氧体和白色吸收体制成的混合衬里。",
      "从暗室内部看到的屏蔽门。吸波材料之间可见两扇深色钢门，侧板上有 Frankonia 标记。",
    ],
    "chc-plus": [
      "CHC Plus 剖面图渲染。在红色屋顶横梁下可以看到覆盖有吸收材料的内部，并且天线支架立在地板上，吸收材料铺在地板上。",
      "安装在三脚架上的红色喇叭天线面向室内。地板上覆盖着白色的吸水材料，电缆在其后面走线。",
    ],
    avtc: [
      "转盘上停着一辆红色 SUV，左侧有一根天线杆。墙壁是白色的吸收体，地板是彩绘的踏板。",
      "室外的控制室。桌子上摆满了仪器架和显示器，右侧有一扇关闭的白色纱门。",
    ],
    "sac-10-v": [
      "暗室内的地面上停着一台黄色挖掘机。右边有一个天线杆，墙壁和天花板是白色的吸波材料。",
      "包含暗室的整个建筑物的剪切渲染图。车辆试验室和测功机位于下层，控制室和通道位于上层。",
    ],
    "edtc-sa": [
      "EDTC 剪裁渲染。室内有天线架和测试台，墙外有红色装载机和变速箱连接到轴上。",
      "暗室外的设备间内。有灰色的柜子和便携式传感器，三个粗的电缆管道沿着墙壁延伸到室内。",
    ],
    "edtc-ax": [
      "EDTC-AX 剪切渲染。两个红色负载相对放置在带有铜接地板的测试台上，双锥天线立在地板上。",
    ],
    "edtc-bb": [
      "天线杆立于室内，蓝色EMC-BlueBox负载和测试样本放置在中心转盘上。",
    ],
    "mil-chc": [
      "MIL CHC 镂空渲染。它是一个紧凑的暗室，带有打开的屏蔽门，里面放置了红色天线支架和测试台。",
    ],
    "mil-std-chamber": [
      "暗室内停着一辆军用卡车，前面有人正在调整移动天线杆。墙体是一个短金字塔吸波体。",
    ],
    "mil-std-chamber-advanced": [
      "带有红色框架的大型屏蔽门打开，可以看到远处的暗室里有一辆车辆。吸波材料一直延伸到门内。",
      "暗室内停着一辆黑色装甲车，前面的地板上放置着红色的长金字塔吸波材料和排气管。",
    ],
    "sac-3-plus": [
      "SAC-3 Plus 剖面渲染。弯曲的圆顶屋顶下方可见吸水内部，天线杆位于地面上方。",
      "从圆顶屋顶下看到的测试室。后墙上悬挂着 DEKRA 横幅，踏板上画有转盘和黄色标记线。",
    ],
    "sac-3-square": [
      "SAC-3 方形镂空渲染。它是一个红色钢架的方形暗室，地面上放置着转盘和天线支架。",
      "垂直显示方形室边缘的照片。墙壁是白色金字塔吸波材料，底部踏板有转盘圆圈和黄色标记。",
    ],
    "sac-5-plus": [
      "SAC-5 Plus 剖面渲染。吸波墙位于带有红色拱形肋的圆顶屋顶下方，地面上方是天线杆。",
      "抬头看穹顶天花板。白色吸收体遵循一条曲线，越过曲线，黑色铁氧体表面就暴露出来。",
    ],
    "sac-5-square": [
      "SAC-5 方形镂空渲染。它是一个红色框架的方形暗室，地平面上画有一个转盘圆圈，上面立着一个天线支架。",
      "沿着墙壁金字塔吸波材料看向转盘的照片。吸波材料沿远端变窄，底部是光滑的胎面。",
    ],
    "sac-10-plus": [
      "SAC-10 Plus 剖面渲染。测试室被安置在一个包裹着红色钢框架的多边形外壳中，内衬吸收材料，并在地板上标记有一个测试轴。",
      "抬头看天花板。长金字塔形吸光体成排悬挂，并在它们之间被照亮。",
    ],
    "sac-10-plus-triton": [
      "一个人正在暗室地板上行走。后墙上附有一个吸波材料，地板上放置一个可移动的吸波材料。",
      "天线安装在墙前的支架上，吸波块排列在其下方的地板上。",
    ],
    "sac-10-h-hybrid": [
      "SAC-10/H 混合剖面渲染。红框内有一个混合衬里的测试室，侧面附有一个两层的附楼。",
      "安装在移动转向架上的天线杆矗立在暗室中央，地板上画着一条红色激光线。壁的底部是铁氧体，顶部是吸波材料。",
    ],
    "sac-10-p-pyramid": [
      "SAC-10/P 金字塔切割渲染。红框内的测试室仅覆盖有长金字塔吸波体，被测设备放置在中心。",
      "长金字塔吸波器的近视图。墙上覆盖着一座尖尖的金字塔，金字塔之间夹着两盏灯。",
    ],
    "fac-3": [
      "FAC-3 剪切渲染。它是完全电波暗室的，不仅墙壁和天花板，就连地板也都布满了吸声体，中间还矗立着一根天线杆。",
      "安装在三脚架上的天线及其后面的红色天线放置在地板吸波材料上。吸波材料一直延伸到地板，没有接地平面。",
    ],
    "fac-3-l": [
      "FAC-3 L 镂空渲染。这是一个扩展的完全电波暗室，地板上覆盖着吸波器，天线杆和入口楼梯连在一起。",
      "红色放大器和喇叭天线朝暗室内部放置，底部有吸波器和木制测试台。",
    ],
    "sac-3-fac-3-transformer": [
      "SAC-3 / FAC-3 变压器剖面渲染。通过在地平面上铺设地面吸波材料实现完全电波暗室，中间有天线杆。",
      "安装在红色支架上的对数周期天线面向吸波器壁。壁的顶部是吸波材料，底部是黑色铁氧体。",
    ],
    rvc: [
      "在一个只有金属墙包围的暗室里，一个Z形搅拌器垂直立着。到处都没有吸波材料，底部有一条黄色指示线。",
      "从上方接受照明的Z形搅拌器。右边挂着一个小天线，墙壁和天花板都是金属表面。",
    ],
    "shielded-room": [
      "屏蔽室通风口近景。墙壁上安装有致密的金属蜂窝板。",
      "工厂大厅里排列着两间屏蔽室。门开着，可以看到里面的桌子和测量仪器，楼上的管道和管道从上面穿过。",
    ],
  },
  en: {
    actc: [
      "Cutaway render of the ACTC: a box chamber lined with hybrid absorbers, an antenna mount and a bench on the ground plane, and red steel beams across the roof.",
      "A log-periodic antenna on a red mount, aimed along the ground-plane bench. The wall behind it is bare ferrite, the one beside it white absorbers.",
    ],
    ucc: [
      "Cutaway render of the UCC: a cabinet-sized chamber with the door open, the inner walls split between black ferrite tiles and white absorbers, and a red antenna mount on the ground plane.",
      "The copper ground plane close up — bolted copper sheets running under the white bench frame, absorbers on the wall behind.",
    ],
    ctc: [
      "Looking down into the chamber: a horn antenna set over a wooden bench, the ground plane below, absorbers on the walls and ceiling.",
      "The corner where ceiling meets wall — lights set between the white absorbers, bare ferrite showing behind them.",
    ],
    chc: [
      "Cutaway render of the CHC: a compact box chamber with the shielded door open, lined with black ferrite and white absorbers together.",
      "The shielded door seen from inside: two dark steel leaves between the absorbers, with the Frankonia mark stamped into the panel beside them.",
    ],
    "chc-plus": [
      "Cutaway render of the CHC Plus: absorbers all round under red roof beams, with floor absorbers laid down and an antenna stand on them.",
      "A red horn antenna on a tripod, aimed down the chamber over white floor absorbers, its cable running back behind it.",
    ],
    avtc: [
      "A red SUV on the turntable with an antenna mast to the left, absorber walls all round and a painted ground plane underfoot.",
      "The control room outside the chamber: instrument racks and a desk of monitors, with the white shielded door closed at the right.",
    ],
    "sac-10-v": [
      "A yellow excavator standing on the ground plane inside the chamber, an antenna mast to the right, absorbers over the walls and ceiling.",
      "A cutaway render of the whole building: the vehicle chamber and its dynamometer on the lower floor, control rooms and a walkway above.",
    ],
    "edtc-sa": [
      "Cutaway render of the EDTC: mount and bench inside the chamber, the red load machine and gearbox outside the wall, joined through it by the shaft.",
      "The plant room outside the chamber: grey cabinets and a wheeled converter, with three thick cable ducts running into the wall.",
    ],
    "edtc-ax": [
      "Cutaway render of the EDTC-AX: two red load machines facing each other on a copper-topped bench, with a biconical antenna standing on the floor.",
    ],
    "edtc-bb": [
      "An antenna mast in the chamber, with the blue EMC-BlueBox load machine and its test piece on the turntable in the middle.",
    ],
    "mil-chc": [
      "Cutaway render of the MIL CHC: a compact chamber with the shielded door open, a red antenna mount and a bench inside.",
    ],
    "mil-std-chamber": [
      "A military truck inside the chamber, with someone adjusting a mobile antenna mast in front of it. The walls are lined with short-pyramid absorbers.",
    ],
    "mil-std-chamber-advanced": [
      "A large shielded gate in a red frame, standing open on a vehicle inside the chamber. The absorbers carry on across the gate itself.",
      "A black armoured vehicle in the chamber, with red long-pyramid floor absorbers and an exhaust duct laid out in front of it.",
    ],
    "sac-3-plus": [
      "Cutaway render of the SAC-3 Plus: the curved dome roof over an absorber-lined room, with an antenna mast on the ground plane.",
      "The test room under the dome roof: a DEKRA banner on the far wall, a turntable and yellow floor markings on the ground plane.",
    ],
    "sac-3-square": [
      "Cutaway render of the SAC-3 Square: a square chamber inside a red steel frame, with a turntable and antenna mount on the ground plane.",
      "A corner of the square chamber, seen upright: pyramid absorbers on the walls, and the turntable circle and yellow markings on the ground plane.",
    ],
    "sac-5-plus": [
      "Cutaway render of the SAC-5 Plus: absorber walls under a dome roof carried on red arched ribs, an antenna mast on the ground plane.",
      "Looking up into the dome: the white absorbers following the curve, and the bare ferrite ceiling showing beyond them.",
    ],
    "sac-5-square": [
      "Cutaway render of the SAC-5 Square: a square chamber in a red frame, the turntable circle marked on the ground plane and an antenna stand beside it.",
      "Along the wall pyramids toward the turntable, the absorbers running away in perspective over a smooth ground plane.",
    ],
    "sac-10-plus": [
      "Cutaway render of the SAC-10 Plus: an absorber-lined room inside the polygonal shell and its red steel frame, with a single test axis marked on the floor.",
      "Looking up at the ceiling: rows of long-pyramid absorbers with the lights set between them.",
    ],
    "sac-10-plus-triton": [
      "Someone walking across the chamber floor, with absorbers on the far wall and movable floor absorbers standing to one side.",
      "An antenna on its mount in front of the wall, with a row of floor-absorber blocks standing below it.",
    ],
    "sac-10-h-hybrid": [
      "Cutaway render of the SAC-10/H Hybrid: the hybrid-lined test room inside its red frame, with a two-storey annex alongside.",
      "A wheeled antenna mast standing in the chamber, a red laser line on the floor beside it, ferrite low on the wall and absorbers above.",
    ],
    "sac-10-p-pyramid": [
      "Cutaway render of the SAC-10/P Pyramid: the room inside the red frame lined in long-pyramid absorbers throughout, an EUT in the middle.",
      "Long-pyramid absorbers close up, covering the wall end to end with two light fittings set between them.",
    ],
    "fac-3": [
      "Cutaway render of the FAC-3: absorbers on the floor as well as the walls and ceiling — the fully anechoic setup — with an antenna mast in the middle.",
      "An antenna on a tripod and a red one behind it, standing over floor absorbers. There is no ground plane; the floor is lined too.",
    ],
    "fac-3-l": [
      "Cutaway render of the FAC-3 L: the extended fully anechoic room with absorbers on the floor too, an antenna mast and the entrance steps drawn in.",
      "A red amplifier and a horn antenna aimed into the chamber, with floor absorbers and a wooden bench below.",
    ],
    "sac-3-fac-3-transformer": [
      "Cutaway render of the SAC-3 / FAC-3 Transformer, drawn in the fully anechoic setup — floor absorbers laid over the ground plane, an antenna mast in the middle.",
      "A log-periodic antenna on a red mount facing the absorber wall, absorbers above and bare ferrite below.",
    ],
    rvc: [
      "A Z-fold stirrer standing upright in a room walled entirely in bare metal — no absorbers anywhere, and yellow markings on the floor.",
      "The Z-fold stirrer lit from above, a small antenna hanging to the right, walls and ceiling all bare metal.",
    ],
    "shielded-room": [
      "A shielded room's ventilation opening close up: a fine metal honeycomb panel set into the wall.",
      "Two shielded rooms standing side by side in a hall, doors open on the desks and instruments inside, the building's pipework and ducting overhead.",
    ],
  },
};

/** The extra plates for one model, in gallery order, already carrying the
 *  locale's alt. Empty for a slug with none, so a caller can spread it. */
export const modelGallery = (lang: Lang, slug: string): readonly Plate[] =>
  (frames[slug] ?? []).map((frame, i) => ({ ...frame, alt: alt[lang][slug]?.[i] }));

/** The two reverberation chambers built around a large disc under the ceiling.
 *  Named rather than derived: the stirrer is written into the model tables as
 *  prose, and matching on that prose would break the first time it is reworded. */
const largeDiscStirrer = new Set(["RVC XL", "RVC XXL"]);

/**
 * The plates one model row opens onto: the model page's own lead plate first,
 * then the gallery extras.
 *
 * The reverberation chambers are the exception, and they split in two. Seven of
 * them share a slug, so they share a page and would share all three plates —
 * but the three are two different chambers. The lead plate is a large-disc
 * stirrer turning under the ceiling, which is how the XL and the XXL are built;
 * both gallery frames are a Z-fold stirrer standing upright, which is how the
 * other five are. So each row keeps only the plates of its own stirrer: XL and
 * XXL the lead alone, e1, e2, S, M and L the two Z-folds. A thumbnail is a
 * claim about the model beside it, and neither group can be shown as the other.
 */
export const modelShots = (
  lang: Lang,
  model: ChamberModel,
  figure: Plate,
): readonly Plate[] => {
  const extras = modelGallery(lang, model.slug);
  if (model.type !== "rvc") return [figure, ...extras];
  return largeDiscStirrer.has(model.name) ? [figure] : extras;
};

/** Every file the gallery names, for the ledger check in the test suite. */
export const galleryFiles: readonly string[] =
  Object.values(frames).flat().map((f) => f.src);
