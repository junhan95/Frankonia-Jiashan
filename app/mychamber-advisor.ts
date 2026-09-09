import type { ChamberIndustry, ChamberType } from "./chamber-sections";
import type { Lang } from "./site-config";

/**
 * The MyChamber decision tree — the head office's Chamber Matrix, as data.
 *
 * ## The source
 *
 * `MyChamber/Chamber Matrix-extention.pdf` (12 August 2026), the extended
 * edition of the hand-drawn matrix of 11 August. It is a tree: four segment
 * boxes, and under each of them the branches that end in a model designation.
 * docs/MYCHAMBER-MATRIX-FLOW.md transcribes it branch by branch and is the
 * specification this file implements; tests/mychamber-matrix.test.mjs holds the
 * two to each other.
 *
 * ## Why a tree
 *
 * This file used to be a weighted scoring engine over answer axes of its own —
 * EUT scale, EMC test kinds, quiet zone, compliance level — with the matrix
 * kept alongside as an answer key. It ranked well and it asked up to eight
 * questions, none of which was a question the matrix asks.
 *
 * The matrix is now the flow itself. Every question below is one of its
 * branch points, in its order, and every leaf is the model designation written
 * at the end of that branch. Nothing is scored, nothing is weighted, and there
 * is no path by which the page can answer something the head office did not.
 * The longest branch is five questions.
 *
 * What a tree cannot do is say that a model belongs in two places at once — the
 * CTC is filed under Commercial pre-compliance and is built for automotive and
 * military components as well. So a leaf may name more than one model, and each
 * leaf carries its own `why` line rather than a generated one: the reason a
 * model is at the end of a branch is a fact about the matrix, not a computation.
 *
 * ## What this file may not do
 *
 * Every designation and figure here comes from `chamberModels` and the model
 * pages in chamber-sections.ts, which are the 2026 catalogue. Nothing invents a
 * specification. Where a model's compliance is narrower than its place in the
 * tree suggests, `caveat` says so on the card.
 */

type L = Record<Lang, string>;

/* ------------------------------------------------------------------ *
 * Segments
 * ------------------------------------------------------------------ */

/**
 * The four boxes at the top of the matrix, in the drawing's order.
 *
 * Four rather than the catalogue's five industries: the matrix files the
 * E-Drive benches *inside* Automotive, as a sibling of "components" and
 * "vehicle", because a drivetrain bench is something an automotive laboratory
 * buys. And the choice is exclusive — the drawing gives each box a track of its
 * own with no line crossing between them.
 */
export const segments = ["automotive", "commercial", "military", "special"] as const;
export type SegmentChoice = (typeof segments)[number];

/** The four measurement tasks the extension files under Special Chambers. */
export const specialUses = ["sat", "ota", "antenna-vehicle", "rcs"] as const;
export type SpecialUse = (typeof specialUses)[number];

/** The circled letters the extension hangs under the segments, plus the
 *  free-standing ⓧ. Declared here rather than in mychamber-questionnaires.ts
 *  because the tree's own leaves name them. */
export type QuestionnaireId = "A" | "B" | "C" | "D" | "X";

/* ------------------------------------------------------------------ *
 * Standards
 * ------------------------------------------------------------------ */

/**
 * The standards the segment questionnaires offer as tick boxes.
 *
 * The matrix does not branch on a standard, so the wizard no longer asks about
 * one — this list exists for questionnaires Ⓐ–Ⓓ and ⓧ, which do, because the
 * engineering team needs it to reply. `industries` is what decides which
 * questionnaire shows which designation.
 *
 * Designations are not translated in either locale. They are what a reader
 * matches against a drawing, a quotation and an accreditation certificate.
 */
export const standards = [
  { id: "cispr25", name: "CISPR 25 / EN 55025", industries: ["automotive", "powertrain"],
    hint: { zh: "车载电子元件发布，1.0m元件测试", en: "Vehicle component emission, 1.0 m component test" } },
  { id: "cispr12", name: "CISPR 12 / EN 55012", industries: ["automotive"],
    hint: { zh: "整车放行", en: "Whole-vehicle emission" } },
  { id: "ecer10", name: "ECE R10", industries: ["automotive"],
    hint: { zh: "车辆EMC型式认证", en: "Vehicle EMC type approval" } },
  { id: "iso11452", name: "ISO 11452-2", industries: ["automotive", "powertrain"],
    hint: { zh: "元件辐射抗扰度（电波暗室）", en: "Component radiated immunity, absorber-lined chamber" } },
  { id: "iso11451", name: "ISO 11451-2", industries: ["automotive"],
    hint: { zh: "整车抗辐射性能", en: "Whole-vehicle radiated immunity" } },
  { id: "iso1145211", name: "ISO 11452-11", industries: ["automotive", "powertrain"],
    hint: { zh: "元件辐射抗扰度（混响室）", en: "Component radiated immunity, reverberation chamber" } },
  { id: "mil461", name: "MIL-STD-461", industries: ["military"],
    hint: { zh: "军用EMC — RE/RS/CE/CS", en: "Defence EMC — RE / RS / CE / CS" } },
  { id: "do160", name: "RTCA DO-160", industries: ["military"],
    hint: { zh: "机载设备", en: "Airborne equipment" } },
  { id: "cispr32", name: "CISPR 32 / EN 55032", industries: ["commercial"],
    hint: { zh: "多媒体设备发布", en: "Multimedia equipment emission" } },
  { id: "iec61000_4_3", name: "IEC / EN 61000-4-3", industries: ["commercial", "automotive", "powertrain"],
    hint: { zh: "辐射电磁场抗扰度", en: "Radiated RF field immunity" } },
  { id: "iec61000_4_21", name: "IEC / EN 61000-4-21", industries: ["commercial", "automotive", "military"],
    hint: { zh: "混响室测试方法", en: "Reverberation chamber test method" } },
  { id: "cispr16", name: "CISPR 16-1-4", industries: ["commercial", "automotive"],
    hint: { zh: "测试场地适用性验证（NSA/sVSWR）", en: "Test site validation — NSA / sVSWR" } },
  { id: "iec61000_4_22", name: "IEC / EN 61000-4-22", industries: ["commercial"],
    hint: { zh: "全电波暗室（FAR）测试场地——无地平面的自由空间", en: "Fully anechoic room — free space, no ground plane" } },
  // Shielding attenuation is a property of every chamber here rather than a
  // test anybody chooses one for, so it is offered to all four segments.
  { id: "en50147", name: "EN 50147-1 / IEEE 299", industries: ["automotive", "commercial", "military", "powertrain"],
    hint: { zh: "屏蔽衰减测量", en: "Shielding attenuation measurement" } },
] as const satisfies readonly {
  id: string;
  name: string;
  industries: readonly ChamberIndustry[];
  hint: L;
}[];

export type StandardId = (typeof standards)[number]["id"];

/* ------------------------------------------------------------------ *
 * The tree
 * ------------------------------------------------------------------ */

/**
 * One model at the end of a branch.
 *
 * `model` is a designation in `chamberModels` — checked where the two are
 * joined, in mychamber-catalogue.ts, so a typo stops the build rather than
 * quietly emptying a result page.
 *
 * `variant` is the exact configuration the branch pins down, where the matrix
 * branches finely enough to pin one. `why` is the matrix's own reason for
 * putting this model here, written out; it is not generated, because a
 * generated reason would be the page reasoning about the catalogue rather than
 * reporting the head office's decision.
 */
export type Leaf = {
  model: string;
  variant?: { name: string; size: string; note: L };
  why: L;
  caveat?: L;
};

export type AskNode = {
  kind: "ask";
  /** Stable across the whole tree — the progress strip and the enquiry mail
   *  key on it, and the conformance test names branches by it. */
  id: string;
  kicker: L;
  title: L;
  hint?: L;
  options: readonly Branch[];
};

export type ModelsNode = { kind: "models"; leaves: readonly Leaf[] };

/**
 * A branch that ends outside the catalogue.
 *
 * Three kinds reach one. The Special Chambers track, whose four tasks have no
 * catalogue models. The custom quiet zone under a 10.0 m chamber, which is a
 * dimension rather than a designation. And the matrix's own `custom` ovals —
 * the circle it hangs under every segment box, which is the reader saying that
 * none of the branches under their segment is their problem.
 */
export type FormNode = { kind: "form"; qid: QuestionnaireId };

export type Node = AskNode | ModelsNode | FormNode;

export type Branch = {
  id: string;
  label: L;
  note?: L;
  /**
   * What this choice establishes, in the vocabulary of the segment's
   * questionnaire.
   *
   * `carried` below accumulates it down the path and the wizard hands it to
   * the form as a pre-selection, so a reader who leaves the tree — by the
   * custom branch, by the escape link, or because their branch ends in a
   * questionnaire — does not answer the same question twice.
   *
   * Keys are questionnaire field ids and values are its option ids. Nothing in
   * the type system holds those two vocabularies together, so
   * tests/mychamber-matrix.test.mjs checks every one of them against the
   * questionnaire it would land in.
   */
  carry?: Readonly<Record<string, string>>;
  next: Node;
};

/**
 * The matrix's `custom` oval, drawn under every segment box: a branch of the
 * segment, level with the ones that end in models, for the reader whose
 * requirement none of them carries.
 *
 * It is deliberately the last option rather than the first. A reader who can
 * place themselves should place themselves — the questionnaire is the answer
 * when the tree has none, not a way around reading it.
 */
const customBranch = (qid: QuestionnaireId, note: L): Branch => ({
  id: "custom",
  label: { zh: "以上均不适用——定制需求", en: "None of these — a custom requirement" },
  note,
  next: { kind: "form", qid },
});

const ask = (
  id: string,
  kicker: L,
  title: L,
  hint: L,
  options: readonly Branch[],
): AskNode => ({ kind: "ask", id, kicker, title, hint, options });

const models = (...leaves: readonly Leaf[]): ModelsNode => ({ kind: "models", leaves });

/* ---- shared question copy ---------------------------------------- */

const absorberKicker: L = { zh: "吸波材料", en: "Absorber lining" };
const absorberHint: L = {
  zh: "性能相当。混合体在较小的暗室内实现相同的静区，而金字塔具有更便宜的衬里和更低的启动频率。",
  en: "The performance is equivalent. Hybrid reaches the same quiet zone in a smaller room; pyramid is a cheaper lining and starts lower in frequency.",
};

/* ---- Automotive --------------------------------------------------- */

const rvcComponentLeaves: readonly Leaf[] = [
  {
    model: "RVC S",
    why: {
      zh: "矩阵是汽车部件混响测试中使用的两个尺寸中较小的一个——以零件/模块为基础。",
      en: "The smaller of the two sizes the matrix puts at automotive component reverberation testing — components and modules.",
    },
  },
  {
    model: "RVC M",
    why: {
      zh: "在同一分公司的较大分公司中，我们还接受大型军用和车辆零件。",
      en: "The larger of the same pair, taking large military and automotive components.",
    },
  },
];

const automotive = ask(
  "auto-branch",
  { zh: "被测设备", en: "What is tested" },
  { zh: "你在测试什么？", en: "What do you test?" },
  {
    zh: "该矩阵在汽车领域有四个分支。按以下顺序划分：零部件、整车、混响室、电驱动系统。",
    en: "The four branches the matrix draws under Automotive — components, whole vehicles, reverberation, and the electric drivetrain.",
  },
  [
    {
      id: "components",
      label: { zh: "元件", en: "Components" },
      note: { zh: "ECU、传感器、电气模块", en: "ECUs, sensors, electronic modules" },
      carry: { products: "component" },
      next: ask(
        "auto-component-level",
        { zh: "测试等级", en: "Test level" },
        { zh: "你们进行组件测试到什么水平？", en: "How far do the component tests have to go?" },
        {
          zh: "矩阵将组件分支分为三个分支：混响、预认证和正式认证。",
          en: "The matrix splits the component branch three ways — reverberation, pre-compliance, and full compliance.",
        },
        [
          {
            id: "reverberation",
            label: { zh: "混响测试", en: "Reverberation" },
            note: { zh: "IEC 61000-4-21 · ISO 11452-11", en: "IEC 61000-4-21, ISO 11452-11" },
            carry: { reverb: "yes", reverbLevel: "components" },
            next: models(...rvcComponentLeaves),
          },
          {
            id: "pre",
            label: { zh: "预认证（预合规）", en: "Pre-compliance" },
            note: { zh: "研发阶段筛查", en: "Development screening" },
            carry: { compliance: "pre" },
            next: models({
              model: "UCC",
              why: {
                zh: "这是Matrix用于汽车零部件预认证的模型。最小的 CISPR 25 预认证室，可替代 GTEM 室。",
                en: "The model the matrix puts at automotive component pre-compliance — the smallest CISPR 25 pre-compliance chamber there is, the alternative to a GTEM cell.",
              },
              caveat: {
                zh: "发射测量在预认证范围内。如果您需要正式认证，ACTC 是您的最佳选择。",
                en: "Emission measurement is pre-compliant. If the emission figures have to certify, that is the ACTC.",
              },
            }),
          },
          {
            id: "full",
            label: { zh: "官方认证（完全合规）", en: "Full compliance" },
            note: { zh: "CISPR 25 1.0 m 元件测试", en: "CISPR 25 at the 1.0 m component distance" },
            carry: { compliance: "full" },
            next: models({
              model: "ACTC",
              why: {
                zh: "这是Matrix用于汽车零部件官方认证的模型——CISPR 25零部件测试室。",
                en: "The model the matrix puts at automotive component full compliance — the CISPR 25 component testing chamber.",
              },
            }),
          },
        ],
      ),
    },
    {
      id: "vehicle",
      label: { zh: "整车（车辆）", en: "Vehicle" },
      note: { zh: "车规级EMC测试", en: "EMC testing on the whole vehicle" },
      carry: { products: "vehicle" },
      next: ask(
        "auto-vehicle-distance",
        { zh: "测量距离", en: "Measurement distance" },
        { zh: "成品车的测量距离是多少？", en: "Which measurement distance?" },
        {
          zh: "标准规定的天线-车辆距离。该矩阵有两个分支：3.0 m 和 10.0 m。",
          en: "The antenna-to-vehicle distance the standard prescribes. The matrix draws two — 3.0 m and 10.0 m.",
        },
        [
          {
            id: "3m",
            label: { zh: "3.0 m", en: "3.0 m" },
            note: { zh: "零部件和整车一室一厅", en: "Components and whole vehicles in one room" },
            carry: { distance: "3m" },
            next: models({
              model: "AVTC",
              why: {
                zh: "Matrix是放置在汽车整车3.0m室内的模型——3.0m室内同时进行零部件测试和整车测试。",
                en: "The model the matrix puts at automotive 3.0 m — the 3.0 m chamber that takes component and full-vehicle tests alike.",
              },
            }),
          },
          {
            id: "10m",
            label: { zh: "10.0 m", en: "10.0 m" },
            note: { zh: "ECE R10·CISPR 12型式认证", en: "ECE R10 and CISPR 12 type approval" },
            carry: { distance: "10m" },
            next: ask(
              "auto-vehicle-10m",
              { zh: "10.0m配置", en: "10.0 m configuration" },
              { zh: "10.0m试验室的配置是怎样的？", en: "Which 10.0 m configuration?" },
              {
                zh: "矩阵有SAC-10V和SAC-10VC两种配置，10.0m以下。 VC 是一种从 5.0 m 测量距离开始，在结构上为 10.0 m 响应做好准备的配置。",
                en: "The matrix draws two under 10.0 m — the SAC-10V and the SAC-10VC. The VC starts at a 5.0 m test distance while the shell is prepared for 10.0 m.",
              },
              [
                {
                  id: "sac-10v",
                  label: { zh: "SAC-10V — 距起点 10.0 m", en: "SAC-10V — 10.0 m from the start" },
                  note: { zh: "测功机集成，行驶工况测试", en: "Integrated dynamometer, tested under load" },
                  next: ask(
                    "auto-vehicle-absorber",
                    absorberKicker,
                    { zh: "吸波材料是什么类型？", en: "Which absorber lining?" },
                    absorberHint,
                    [
                      {
                        id: "hybrid",
                        label: { zh: "混合（铁氧体 + Frankosorb®）", en: "Hybrid — ferrite with Frankosorb®" },
                        note: { zh: "节省建筑空间时", en: "When floor area is the constraint" },
                        next: models({
                          model: "SAC-10V",
                          variant: {
                            name: "SAC-10V-6/H",
                            size: "22,580 × 15,680 × 8,700 mm",
                            note: { zh: "QZ ø6.0 m (H = 3.0 m) 测量距离 10.0 m", en: "QZ ø6.0 m at 10.0 m test distance (H = 3.0 m)" },
                          },
                          why: {
                            zh: "矩阵中对应汽车 / 10.0 m / 混合吸波材料的配置。",
                            en: "The configuration the matrix puts at automotive vehicle 10.0 m with a hybrid lining.",
                          },
                          caveat: {
                            zh: "是集成测功机的配置，以整车在行驶状态下进行测试为前提。 12.0m·18.0m大型车配置为SL12·SL18。",
                            en: "Built around an integrated dynamometer, for whole vehicles tested under load. SL12 and SL18 take 12.0 m and 18.0 m vehicles.",
                          },
                        }),
                      },
                      {
                        id: "pyramid",
                        label: { zh: "金字塔（仅限 Frankosorb®）", en: "Pyramid — Frankosorb® alone" },
                        note: { zh: "节省衬里成本时", en: "When lining cost is the constraint" },
                        next: models({
                          model: "SAC-10V",
                          variant: {
                            name: "SAC-10V-6/P",
                            size: "26,480 × 20,180 × 9,000 mm",
                            note: { zh: "QZ ø6.0 m (H = 3.0 m) 测量距离 10.0 m", en: "QZ ø6.0 m at 10.0 m test distance (H = 3.0 m)" },
                          },
                          why: {
                            zh: "该矩阵由汽车成品车10.0m金字塔组成。",
                            en: "The configuration the matrix puts at automotive vehicle 10.0 m with a pyramid lining.",
                          },
                          caveat: {
                            zh: "是以整车行驶状态下进行测试为前提，集成测功机的配置。与混合配置相比需要更大的建筑面积。",
                            en: "Built around an integrated dynamometer, for whole vehicles tested under load. It needs more floor area than the hybrid build.",
                          },
                        }),
                      },
                    ],
                  ),
                },
                {
                  id: "sac-10vc",
                  label: { zh: "SAC-10VC — 从 5.0 m 开始，准备 10.0 m", en: "SAC-10VC — 5.0 m now, prepared for 10.0 m" },
                  note: { zh: "分步投资构成", en: "The staged-investment build" },
                  next: models({
                    model: "SAC-10V",
                    variant: {
                      name: "SAC-10VC",
                      size: "Custom size",
                      note: {
                        zh: "从 5.0 m 测量距离开始配置，为 10.0 m 响应做准备",
                        en: "Starts at a 5.0 m test distance, with the shell prepared for 10.0 m",
                      },
                    },
                    why: {
                      zh: "该矩阵与SAC-10V并排放置在汽车成品车下方10.0m处。该目录在 SAC-10V 型号页面上的 VC 配置中介绍了它。",
                      en: "The build the matrix draws beside the SAC-10V under automotive vehicle 10.0 m. In the catalogue it is the VC configuration of the SAC-10V.",
                    },
                    caveat: {
                      zh: "目前以5.0m的测量距离运行，并准备外壳和设施，以便将来可以扩展到10.0m。确切的尺寸将根据准备的程度而变化。",
                      en: "Operated at 5.0 m today, with the shell and services prepared for a later extension to 10.0 m. The exact dimensions follow how far that preparation goes.",
                    },
                  }),
                },
              ],
            ),
          },
        ],
      ),
    },
    {
      id: "reverberation",
      label: { zh: "混响", en: "Reverberation" },
      note: { zh: "统计高场测试·IEC 61000-4-21", en: "Statistical high-field testing — IEC 61000-4-21" },
      carry: { reverb: "yes" },
      next: ask(
        "auto-rvc-eut",
        { zh: "被测设备", en: "What goes in it" },
        { zh: "混响室里有什么？", en: "What goes into the reverberation chamber?" },
        {
          zh: "矩阵将混响分支分为部分和车辆分支。这是一个以后无法更改的选择，因为暗室的体积决定了最低的使用频率。",
          en: "The matrix splits the reverberation branch into components and vehicles. The volume of the room sets its lowest usable frequency, so this is not a choice that can be changed later.",
        },
        [
          {
            id: "components",
            label: { zh: "元件", en: "Components" },
            carry: { products: "component", reverbLevel: "components" },
            next: models(...rvcComponentLeaves),
          },
          {
            id: "vehicle",
            label: { zh: "整车（车辆）", en: "Vehicle" },
            carry: { products: "vehicle", reverbLevel: "vehicle" },
            next: ask(
              "auto-rvc-stirrer",
              { zh: "搅拌器", en: "Stirrer" },
              { zh: "电场搅拌采用哪种方式？", en: "How should the field be stirred?" },
              {
                zh: "这是Matrix在车辆混响室中写下的“带有搅拌器细节”的问题。搅拌器不断改变边界条件，使电场在一段时间内统计均匀——圆盘越大，不相关的电场样本就越多，暗室就越大。",
                en: "The question the matrix writes as “with stirrer details”. The stirrer keeps changing the boundary conditions so that one full turn makes the field statistically uniform — the larger the disc, the more uncorrelated field samples, and the larger the room.",
              },
              [
                {
                  id: "zfold",
                  label: { zh: "Z型折叠搅拌器", en: "Z-fold stirrer" },
                  note: { zh: "立式/卧式2台 · 暗室较小", en: "Two of them, vertical and horizontal — a smaller room" },
                  next: models({
                    model: "RVC L",
                    why: {
                      zh: "矩阵中 RVC L / XL / XXL 中间的 Z 形折叠搅拌器配置 - 汽车混响室的标准尺寸。",
                      en: "The Z-fold build among the matrix's RVC L / XL / XXL — the standard size of a vehicle reverberation chamber.",
                    },
                  }),
                },
                {
                  id: "disc9",
                  label: { zh: "大圆盘搅拌器ø9.0 m", en: "Large-disc stirrer, ø9.0 m" },
                  note: { zh: "电场更加均匀", en: "A more uniform field" },
                  next: models({
                    model: "RVC XL",
                    why: {
                      zh: "与RVC L具有相同的工作容积和最低工作频率，并采用ø9.0 m圆盘搅拌器进行研磨。",
                      en: "Shares the working volume and lowest usable frequency of the RVC L, and is separated from it by the ø9.0 m disc stirrer.",
                    },
                  }),
                },
                {
                  id: "disc12",
                  label: { zh: "大圆盘搅拌器ø12.0 m", en: "Large-disc stirrer, ø12.0 m" },
                  note: { zh: "大型车辆·最大暗室", en: "Large vehicles — the largest room" },
                  next: models({
                    model: "RVC XXL",
                    why: {
                      zh: "这是Matrix RVC L / XL / XXL 中最大的配置，甚至可以容纳大型车辆。",
                      en: "The largest of the matrix's RVC L / XL / XXL, sized for large vehicles.",
                    },
                  }),
                },
              ],
            ),
          },
        ],
      ),
    },
    {
      id: "edrive",
      label: { zh: "电动传动系统（E-Drive）", en: "Electric drivetrain (E-Drive)" },
      note: { zh: "带负载的驱动系统试验台", en: "A drivetrain bench with a load machine" },
      // The head office's own product list has no "E-Drive" on it — a bench
      // like this tests a motor, and "Electric Motor" is the answer that opens
      // questionnaire Ⓐ's two load-machine fields. So leaving the tree here
      // asks about the dynamometer rather than about a product the reader
      // would have to describe twice.
      carry: { products: "motor" },
      next: ask(
        "auto-edrive-dyno",
        { zh: "负载", en: "Load machine" },
        { zh: "负载（测功机）是什么配置？", en: "Which dynamometer setup?" },
        {
          zh: "矩阵的E-Drive分支被分为一种负载配置。这个答案决定了三种 EDTC 模型。",
          en: "The matrix's E-Drive branch splits on the dynamometer alone — this one answer settles which of the three EDTC chambers it is.",
        },
        [
          {
            id: "mobile",
            label: { zh: "移动测功机", en: "Mobile dyno" },
            note: { zh: "EMC-BlueBox · 高达 120 kW", en: "The EMC-BlueBox, up to 120 kW" },
            carry: { driveSetup: "bluebox" },
            next: models({
              model: "EDTC-BB",
              why: {
                zh: "Matrix 放置在 Mobile Dyno «EDTC-BB with Blue Box» — 配置包括 EMC-BlueBox 移动装载机。",
                en: "The matrix's “EDTC-BB with Blue Box” at Mobile Dyno — the build that includes the EMC-BlueBox mobile load machine.",
              },
            }),
          },
          {
            id: "single",
            label: { zh: "固定单测功机（Fixed single dyno）", en: "Fixed single dyno" },
            note: { zh: "1外部负载，固定轴", en: "One external load machine, fixed shaft" },
            carry: { driveSetup: "single" },
            next: models({
              model: "EDTC-SA",
              why: {
                zh: "矩阵是放置在固定单测功机上的“EDTC”——官方目录名称是EDTC-SA。",
                en: "The matrix's “EDTC” at Fixed Single Dyno — EDTC-SA in the catalogue.",
              },
            }),
          },
          {
            id: "axis",
            label: { zh: "定轴测功机", en: "Fixed axis dyno" },
            note: { zh: "电驱桥测试 · 2 个外部负载", en: "E-axle testing — two external load machines" },
            carry: { driveSetup: "eaxle" },
            next: models({
              model: "EDTC-AX",
              why: {
                zh: "这是 Matrix 在固定轴 Dyno 上放置的模型 - 用于电动车轴测试的两轴配置。",
                en: "The model the matrix puts at Fixed Axis Dyno — the two-machine build for e-axle testing.",
              },
            }),
          },
        ],
      ),
    },
    customBranch("A", {
      zh: "不属于上述四类的汽车及汽车电子测试需求",
      en: "An automotive requirement none of the four branches carries",
    }),
  ],
);

/* ---- Commercial · Industrial -------------------------------------- */

/** The four quiet zones the matrix tabulates twice under the 10.0 m branch —
 *  once for the hybrid lining and once for the pyramid — plus its "Custom",
 *  which leaves the catalogue and goes to questionnaire Ⓑ. */
const tenMetreQz = (
  absorber: "hybrid" | "pyramid",
  model: string,
  sizes: Readonly<Record<"3m" | "4m" | "5m" | "6m", { name: string; size: string }>>,
): AskNode =>
  ask(
    `comm-10.0 m-qz-${absorber}`,
    { zh: "静区", en: "Quiet zone" },
    { zh: "静区（QZ）需要什么？", en: "How large a quiet zone do you need?" },
    {
      zh: "这是被测设备周围的圆柱形区域的直径，其中反射被抑制在规格范围内。自己确定腔室的外部尺寸 - 这是矩阵所写的问题：“3.0 m / 4.0 m / 5.0 m / 6.0 m / Custom”。",
      en: "The diameter of the cylinder around the EUT in which reflections stay inside the standard's limit. It sets the outer dimensions of the chamber directly — the question the matrix writes as “3.0 m / 4.0 m / 5.0 m / 6.0 m / Custom”.",
    },
    [
      ...(["3m", "4m", "5m", "6m"] as const).map((qz) => ({
        id: qz,
        label: { zh: `ø${qz.replace("m", ".0 m")}`, en: `ø${qz.replace("m", ".0 m")}` },
        next: models({
          model,
          variant: {
            name: sizes[qz].name,
            size: sizes[qz].size,
            note: {
              zh: `QZ ø 测量距离 10.0 m${qz.replace("m", ".0 m")} (H = 3.0 m)`,
              en: `QZ ø${qz.replace("m", ".0 m")} at 10.0 m test distance (H = 3.0 m)`,
            },
          },
          why:
            absorber === "hybrid"
              ? {
                  zh: "基体是经过商业认证的SAC·10.0 m·混合模型，静区决定了其内部的成分。",
                  en: "The model the matrix puts at commercial full compliance SAC, 10.0 m, hybrid — and the quiet zone picks the build within it.",
                }
              : {
                  zh: "基体是经过商业认证的SAC·10.0 m·金字塔模型，静区决定了其内部的成分。",
                  en: "The model the matrix puts at commercial full compliance SAC, 10.0 m, pyramid — and the quiet zone picks the build within it.",
                },
        }),
      })),
      {
        id: "custom",
        label: { zh: "其他 · 定制尺寸", en: "Something else — a custom size" },
        note: { zh: "这会导致设计团队进行审查。", en: "Goes to the engineering team" },
        next: { kind: "form", qid: "B" } satisfies FormNode,
      },
    ],
  );

const commercial = ask(
  "comm-branch",
  { zh: "测试方法和认证级别", en: "Method and compliance level" },
  { zh: "您需要哪些测试，符合性要求是什么？", en: "Which testing, and to what level?" },
  {
    zh: "该矩阵在商业和工业下有四个分支。官方认证又分为带地平面的半电波暗室（SAC）和不带地平面的全电波暗室（FAC）。",
    en: "The four branches the matrix draws under Commercial · Industrial. Full compliance splits again — semi-anechoic with a ground plane, or fully anechoic without one.",
  },
  [
    {
      id: "reverberation",
      label: { zh: "混响测试", en: "Reverberation" },
      note: { zh: "IEC 61000-4-21 高场辐射抗扰度", en: "IEC 61000-4-21 — high-field radiated immunity" },
      carry: { reverbAlt: "yes" },
      next: models(
        {
          model: "RVC e1",
          why: {
            zh: "Matrix 将“RVC e1/e2”中较小的一个置于商业混响分支中 - 适用于中小型 ISM/多媒体产品。",
            en: "The smaller of the matrix's “RVC e1/e2” at the commercial reverberation branch — for small and medium ISM and multimedia products.",
          },
        },
        {
          model: "RVC e2",
          why: {
            zh: "同一分支较大的一侧接收较大的 ISM/多媒体产品和较低的起始频率。",
            en: "The larger of the same pair, for large ISM and multimedia products and a lower starting frequency.",
          },
        },
      ),
    },
    {
      id: "pre",
      label: { zh: "预认证（预合规）", en: "Pre-compliance" },
      note: { zh: "紧凑型腔室·发展阶段", en: "A compact chamber, during development" },
      carry: { compliance: "pre" },
      next: models(
        {
          model: "CHC",
          why: {
            zh: "这是 Matrix 进行商业预认证的“CHC”——最小的 3.0 m 暗室，可在一个暗室内解决完全符合性抗扰度和预认证发射问题。",
            en: "The matrix's “CHC” at commercial pre-compliance — the smallest 3.0 m chamber that puts full compliant immunity and pre-compliance emission in one room.",
          },
          caveat: {
            zh: "抗扰度经官方认证为 3.0 m，辐射发射在预先认证的范围内。静区为ø1.2m。",
            en: "Full compliant immunity at 3.0 m; radiated emission is pre-compliant. The quiet zone is ø1.2 m.",
          },
        },
        {
          model: "CHC Plus",
          why: {
            zh: "这是 CHC 的更高级别配置，可测量官方认证级别的 1 GHz 至 18 GHz 范围——这是雷达和无线频段需要认证时的答案。",
            en: "The advanced setup of the CHC, measuring 1 GHz to 18 GHz to full compliance — the answer when the radar and radio bands have to certify.",
          },
          caveat: {
            zh: "不在矩阵中，但在目录中。合适的辐射发射测量范围为 1 GHz 至 18 GHz，30 MHz 至 1 GHz 为预认证范围。",
            en: "A configuration the catalogue carries and the matrix does not draw. Compliant emission measurement runs from 1 GHz to 18 GHz; from 30 MHz to 1 GHz it is pre-compliant.",
          },
        },
        {
          model: "CTC",
          why: {
            zh: "矩阵是与 CHC 并排放置的“CTC”——在一个腔室中获得 CISPR 25 · ISO 11452 · MIL-STD 461 · DO-160 · IEC 61000-4-3 的正式认证。",
            en: "The matrix's “CTC”, drawn beside the CHC — it certifies CISPR 25, ISO 11452, MIL-STD 461, DO-160 and IEC 61000-4-3 in one chamber.",
          },
          caveat: {
            zh: "这是一个以抗扰度测试为中心的零件室。 CISPR 25 · ISO 11452 · MIL-STD 461 · DO-160 正式认证测量距离为 1.0 m，IEC 61000-4-3 为 3.0 m。",
            en: "A component chamber built around immunity testing. CISPR 25, ISO 11452, MIL-STD 461 and DO-160 are certified at 1.0 m and IEC 61000-4-3 at 3.0 m.",
          },
        },
      ),
    },
    {
      id: "sac",
      label: { zh: "官方认证—半电波暗室SAC", en: "Full compliance — semi-anechoic (SAC)" },
      note: { zh: "带接地层·CISPR 16-1-4、ANSI C63.4", en: "With a ground plane — CISPR 16-1-4, ANSI C63.4" },
      carry: { compliance: "full" },
      next: ask(
        "comm-sac-distance",
        { zh: "测量距离", en: "Measurement distance" },
        { zh: "测量距离是多少？", en: "Which measurement distance?" },
        {
          zh: "标准规定的天线与测试物体之间的距离。矩阵放置在SAC分支下方3.0 m·5.0 m·10.0 m处。",
          en: "The antenna-to-EUT distance the standard prescribes. The matrix draws 3.0 m, 5.0 m and 10.0 m under the SAC branch.",
        },
        [
          {
            id: "3m",
            label: { zh: "3.0 m", en: "3.0 m" },
            note: { zh: "应用最广泛的测试场地距离", en: "The most common test-site distance" },
            carry: { distance: "3m" },
            next: models(
              {
                model: "SAC-3 Plus",
                why: {
                  zh: "Matrix 放置在 Commercial SAC 3.0 m 中的两个型号中，这是圆顶型 — 此类中选择最多的室。",
                  en: "The dome shell of the two the matrix puts at commercial SAC 3.0 m — the most selected chamber in its class.",
                },
                caveat: {
                  zh: "静区范围为ø1.2~2.0m。如果需要超过 ø2.0 m，请选择方形。",
                  en: "The quiet zone runs ø1.2 m to ø2.0 m. Beyond ø2.0 m the answer is the Square.",
                },
              },
              {
                model: "SAC-3 Square",
                why: {
                  zh: "同一分支方形外壳——可容纳ø3.0m静区和大型转盘/移动测功机。",
                  en: "The square shell of the same pair — room for a ø3.0 m quiet zone and a large turntable or mobile dynamometer.",
                },
              },
            ),
          },
          {
            id: "5m",
            label: { zh: "5.0 m", en: "5.0 m" },
            note: { zh: "3.0m和5.0m并用的配置", en: "Chambers covering 3.0 m and 5.0 m together" },
            carry: { distance: "5m" },
            next: models(
              {
                model: "SAC-5 Plus",
                why: {
                  zh: "Matrix 是放置在 Commercial SAC 5.0 m 上的两个型号的圆顶类型 — 它同时使用 3.0 m 和 5.0 m 测量距离。",
                  en: "The dome shell of the two the matrix puts at commercial SAC 5.0 m, covering both the 3.0 m and 5.0 m test distances.",
                },
              },
              {
                model: "SAC-5 Square",
                why: {
                  zh: "同支的方壳，从5.0m延伸至ø4.0m静区。",
                  en: "The square shell of the same pair, stretching to a ø4.0 m quiet zone at 5.0 m.",
                },
              },
            ),
          },
          {
            id: "10m",
            label: { zh: "10.0 m", en: "10.0 m" },
            note: { zh: "整车·大型被测设备·CISPR 16-1-4", en: "Whole vehicles, large EUTs, CISPR 16-1-4" },
            // The custom quiet zone two questions below lands in Ⓑ, and this
            // is what stops it arriving without the distance it belongs to.
            carry: { distance: "10m" },
            next: ask(
              "comm-10m-build",
              { zh: "10.0m配置", en: "10.0 m configuration" },
              { zh: "您希望建造什么配置的 10.0 m 暗室？", en: "How should the 10.0 m chamber be built?" },
              {
                zh: "该矩阵在10.0m以下有3个分支：混合型、金字塔型、特殊型。前两种是衬砌法，特殊型是多边形壳以相同测量距离建造的两种配置。",
                en: "The matrix draws three under 10.0 m — hybrid, pyramid, and Special. The first two are linings; Special is the same measurement distance built into a polygonal shell.",
              },
              [
                {
                  id: "hybrid",
                  label: { zh: "混合（铁氧体 + Frankosorb®）", en: "Hybrid — ferrite with Frankosorb®" },
                  note: { zh: "节省建筑空间·30 MHz~40 GHz", en: "When floor area is the constraint — 30 MHz to 40 GHz" },
                  next: tenMetreQz("hybrid", "SAC-10/H Hybrid", {
                    "3m": { name: "SAC-10-3/H", size: "18,380 × 12,830 × 8,550 mm" },
                    "4m": { name: "SAC-10-4/H", size: "19,280 × 13,280 × 8,550 mm" },
                    "5m": { name: "SAC-10-5/H", size: "21,080 × 15,080 × 8,700 mm" },
                    "6m": { name: "SAC-10-6/H", size: "21,680 × 15,680 × 8,700 mm" },
                  }),
                },
                {
                  id: "pyramid",
                  label: { zh: "金字塔（仅限 Frankosorb®）", en: "Pyramid — Frankosorb® alone" },
                  note: { zh: "节省线路成本·26 MHz至40 GHz", en: "When lining cost is the constraint — 26 MHz to 40 GHz" },
                  next: tenMetreQz("pyramid", "SAC-10/P Pyramid", {
                    "3m": { name: "SAC-10-3/P", size: "21,680 × 13,730 × 8,550 mm" },
                    "4m": { name: "SAC-10-4/P", size: "21,680 × 13,730 × 8,550 mm" },
                    "5m": { name: "SAC-10-5/P", size: "23,480 × 16,580 × 9,000 mm" },
                    "6m": { name: "SAC-10-6/P", size: "24,980 × 17,180 × 9,000 mm" },
                  }),
                },
                {
                  id: "special",
                  label: { zh: "特殊—多边形壳", en: "Special — the polygonal shell" },
                  note: { zh: "最小化建筑空间或最大化吞吐量", en: "Smallest floor area, or highest throughput" },
                  next: models(
                    {
                      model: "SAC-10 Plus",
                      why: {
                        zh: "矩阵是 10.0 m《特殊》中的《SAC-10 Plus》——最便宜的 10.0 m 配置，具有相同的 Triton 外壳作为单轴。",
                        en: "The matrix's “SAC-10 Plus” at 10.0 m Special — the same Triton shell on a single axis, the least expensive way to a 10.0 m chamber.",
                      },
                      caveat: {
                        zh: "静区固定为ø3.0 m。如果您需要更大的 QZ，它是混合或金字塔分支。",
                        en: "The quiet zone is fixed at ø3.0 m. For anything larger the answer is the hybrid or pyramid branch.",
                      },
                    },
                    {
                      model: "SAC-10 Plus Triton",
                      why: {
                        zh: "矩阵是并排书写的《Triton》——一个 10.0 m 轴和两个 3.0 m 轴在一个多边形壳中，并行进行三个测试。",
                        en: "The matrix's “Triton”, written beside it — one 10.0 m axis and two 3.0 m axes in a single polygonal shell, three tests in parallel.",
                      },
                      caveat: {
                        zh: "三个测试同时进行，无需移动天线和底部吸波体。当您需要最大限度地提高一栋建筑的吞吐量并具有 ø3.0 m 的静区范围时，它就是您的答案。",
                        en: "Three tests in parallel with the antennas and floor absorbers staying in place — the answer when throughput in one building is the constraint. The quiet zone is ø3.0 m.",
                      },
                    },
                  ),
                },
              ],
            ),
          },
        ],
      ),
    },
    {
      id: "fac",
      label: { zh: "官方认证——全电波暗室FAC", en: "Full compliance — fully anechoic (FAC)" },
      note: { zh: "无接地层的自由空间·IEC/EN 61000-4-22", en: "Free space, no ground plane — IEC / EN 61000-4-22" },
      // Every fully anechoic chamber in the range is a 3.0 m one.
      carry: { compliance: "full", distance: "3m" },
      next: ask(
        "comm-fac-build",
        { zh: "FAC配置", en: "FAC configuration" },
        { zh: "完全电波暗室需要什么配置？", en: "Which fully anechoic build do you need?" },
        {
          zh: "该矩阵在FAC分支下有3个分支：FAC-3·FAC-3L·SAC-3/FAC-3 Transformer。",
          en: "The matrix draws three under the FAC branch — the FAC-3, the FAC-3 L, and the SAC-3 / FAC-3 Transformer.",
        },
        [
          {
            id: "tabletop",
            label: { zh: "桌面被测设备", en: "Table-top EUTs" },
            next: models({
              model: "FAC-3",
              why: {
                zh: "矩阵是位于 FAC 分支的“FAC-3”——一个用于桌面被测设备的自由空间 EMC 测试站点。",
                en: "The matrix's “FAC-3” at the FAC branch — the free-space EMC test site for table-top EUTs.",
              },
              caveat: {
                zh: "这是没有地平面的自由空间条件。需要接地层的测试场地规范需要半电波暗室 (SAC) 系列。",
                en: "Free-space conditions, with no ground plane. A test-site standard that requires one needs a semi-anechoic chamber instead.",
              },
            }),
          },
          {
            id: "floor",
            label: { zh: "直至静止的被测设备（高度扫描）", en: "Floor-standing EUTs as well — with height scan" },
            next: models({
              model: "FAC-3 L",
              why: {
                zh: "Matrix 的《FAC-3 L》——一种扩展到具有高度扫描功能的固定测试物体的配置。",
                en: "The matrix's “FAC-3 L” — the build with a height scan that extends it to floor-standing EUTs.",
              },
              caveat: {
                zh: "这是没有地平面的自由空间条件。",
                en: "Free-space conditions, with no ground plane.",
              },
            }),
          },
          {
            id: "both",
            label: { zh: "半无香和全无香两种", en: "Both semi-anechoic and fully anechoic" },
            note: { zh: "通过插入和移除底部吸波材料进行切换", en: "Converted by adding or removing the floor absorbers" },
            next: models({
              model: "SAC-3 / FAC-3 Transformer",
              why: {
                zh: "这是矩阵写为“SAC-3 / FAC-3变压器”的模型——需要两种地板条件时的答案。",
                en: "The model the matrix writes as “SAC-3 / FAC-3 Transformer” — the answer when both floor conditions are needed.",
              },
              caveat: {
                zh: "您可以通过插入和移除底部吸波材料在半无味和完全无味之间切换。",
                en: "Converts between semi-anechoic and fully anechoic by adding or removing the floor absorbers.",
              },
            }),
          },
        ],
      ),
    },
    customBranch("B", {
      zh: "不属于上述四类的工业和电子设备要求",
      en: "An industrial requirement none of the four branches carries",
    }),
  ],
);

/* ---- Military ------------------------------------------------------ */

const military = ask(
  "mil-branch",
  { zh: "被测设备", en: "What is tested" },
  { zh: "你在测试什么？", en: "What do you test?" },
  {
    zh: "矩阵将军事分为两个分支：零件和载具。两个插脚下方都以吸波材料的方式重新研磨。",
    en: "The matrix splits Military two ways — components and vehicles — and both split again on the absorber lining.",
  },
  [
    {
      id: "components",
      label: { zh: "零件/设备（组件）", en: "Components and equipment" },
      note: { zh: "MIL-STD-461·DO-160组件测试", en: "MIL-STD-461 and DO-160 component testing" },
      carry: { products: "component" },
      next: ask(
        "mil-component-absorber",
        absorberKicker,
        { zh: "吸波材料是什么类型？", en: "Which absorber lining?" },
        absorberHint,
        [
          {
            id: "hybrid",
            label: { zh: "杂交种", en: "Hybrid" },
            note: { zh: "9 kHz / 30 MHz~40 GHz", en: "9 kHz / 30 MHz to 40 GHz" },
            next: models({
              model: "MIL CHC",
              variant: {
                name: "MIL CHC",
                size: "4,880 × 4,880 × 3,000 mm",
                note: { zh: "9 kHz / 30 MHz~40 GHz，混合吸收体", en: "9 kHz / 30 MHz to 40 GHz, hybrid absorber lining" },
              },
              why: {
                zh: "矩阵中对应军用部件 / 混合吸波材料的型号为 MIL CHC (Hybrid)。",
                en: "The matrix's “MIL CHC (Hybrid)” at military components with a hybrid lining.",
              },
            }),
          },
          {
            id: "pyramid",
            label: { zh: "金字塔", en: "Pyramid" },
            note: { zh: "9 kHz / 80 MHz ~ 40 GHz·单金字塔", en: "9 kHz / 80 MHz to 40 GHz — short pyramid" },
            next: models({
              model: "MIL CHC",
              variant: {
                name: "MIL CPC",
                size: "6,080 × 5,380 × 3,750 mm",
                note: { zh: "9 kHz / 80 MHz ~ 40 GHz，单金字塔吸波体", en: "9 kHz / 80 MHz to 40 GHz, short-pyramid lining" },
              },
              why: {
                zh: "矩阵是“MIL CPC（金字塔）”，位于 MIL CHC 模型页面的军事零件金字塔 - 金字塔配置中。",
                en: "The matrix's “MIL CPC (Pyramid)” at military components with a pyramid lining — the pyramid build on the MIL CHC model page.",
              },
            }),
          },
        ],
      ),
    },
    {
      id: "vehicle",
      label: { zh: "车辆·大型被测设备（车辆）", en: "Vehicles and large EUTs" },
      note: { zh: "车辆/平台单元测试", en: "Testing at vehicle and platform scale" },
      carry: { products: "vehicle" },
      next: ask(
        "mil-vehicle-absorber",
        absorberKicker,
        { zh: "吸波材料是什么类型？", en: "Which absorber lining?" },
        absorberHint,
        [
          {
            id: "hybrid",
            label: { zh: "杂交种", en: "Hybrid" },
            note: { zh: "9 kHz / 30 MHz~40 GHz", en: "9 kHz / 30 MHz to 40 GHz" },
            carry: { startFreq: "30" },
            next: models({
              model: "MIL-STD Chamber Advanced",
              variant: {
                name: "MIL-STD Advanced Hybrid",
                size: "Custom size",
                note: { zh: "9 kHz / 30 MHz~40 GHz，混合吸收体", en: "9 kHz / 30 MHz to 40 GHz, hybrid absorber lining" },
              },
              why: {
                zh: "矩阵中对应军用车辆 / 混合吸波材料的型号为 MIL STD Advanced。它还满足商业和车辆测试场地的要求。",
                en: "The hybrid build of the matrix's “MIL StD Advanced” at military vehicles with a hybrid lining. It meets the commercial and automotive test-site requirements as well.",
              },
            }),
          },
          {
            id: "pyramid",
            label: { zh: "金字塔", en: "Pyramid" },
            note: { zh: "分回起始频率", en: "Splits again on where the range starts" },
            next: ask(
              "mil-vehicle-start",
              { zh: "启动频率", en: "Where the range starts" },
              { zh: "测试应该以什么频率开始？", en: "Where does the test range have to start?" },
              {
                zh: "这是一道矩阵写着“MIL STD 80 (P600)”和“MIL STD 30 (P2400)”的问题。这两个数字不是型号名称，而是吸波器对应的起始频率，P600·P2400是金字塔吸波器的长度。",
                en: "The question the matrix writes as “MIL STD 80 (P600)” and “MIL STD 30 (P2400)”. The two numbers are not model names but the frequency the lining starts at; P600 and P2400 are the lengths of the pyramid absorbers.",
              },
              [
                {
                  id: "80",
                  label: { zh: "80 MHz 以上 — 短金字塔 P600", en: "From 80 MHz — short pyramid, P600" },
                  carry: { startFreq: "80" },
                  next: models({
                    model: "MIL-STD Chamber",
                    why: {
                      zh: "这是 Matrix 的《MIL STD 80 (P600)》——一种用于车辆的军用室，支持 80 MHz 以上的单金字塔衬里。",
                      en: "The matrix's “MIL STD 80 (P600)” — the military vehicle chamber whose short-pyramid lining works from 80 MHz up.",
                    },
                    caveat: {
                      zh: "支持 80 MHz 以上。如果您需要高达 26/30 MHz，请选择高级。",
                      en: "From 80 MHz up. If the range has to start at 26 or 30 MHz, that is the Advanced.",
                    },
                  }),
                },
                {
                  id: "26",
                  label: { zh: "26 / 30 MHz 起 — 长金字塔 P2400", en: "From 26 / 30 MHz — long pyramid, P2400" },
                  carry: { startFreq: "26" },
                  next: models({
                    model: "MIL-STD Chamber Advanced",
                    variant: {
                      name: "MIL-STD Advanced Pyramid",
                      size: "Custom size",
                      note: { zh: "9 kHz / 26 MHz~40 GHz，长金字塔 (P2400) 吸波体", en: "9 kHz / 26 MHz to 40 GHz, long-pyramid (P2400) absorbers" },
                    },
                    why: {
                      zh: "Matrix 的 «MIL STD Adv. / MIL STD 30 (P2400)» — 长金字塔衬里，频率低至 26 MHz。",
                      en: "The matrix's “MIL STD Adv. / MIL STD 30 (P2400)” — the long-pyramid build that reaches down to 26 MHz.",
                    },
                  }),
                },
              ],
            ),
          },
        ],
      ),
    },
    customBranch("C", {
      zh: "零件或车辆中未包含的军事要求",
      en: "A defence requirement that is neither of the two branches",
    }),
  ],
);

/* ---- Special Chambers ---------------------------------------------- */

const specialTaskCopy: Record<SpecialUse, { label: L; note: L }> = {
  sat: {
    label: { zh: "卫星测试（SAT暗室）", en: "Satellite testing — SAT chamber" },
    note: { zh: "卫星和有效载荷测试设施", en: "Satellites and payloads under test" },
  },
  ota: {
    label: { zh: "天线零件·OTA", en: "Antenna components — OTA" },
    note: { zh: "天线和无线组件辐射特性的测量", en: "Radiated performance of antennas and wireless components" },
  },
  "antenna-vehicle": {
    label: { zh: "车辆天线测量", en: "Vehicle antenna measurement" },
    note: { zh: "安装在整车上的天线的辐射特性", en: "Antenna performance measured on the whole vehicle" },
  },
  rcs: {
    label: { zh: "RCS 测量", en: "RCS measurement" },
    note: { zh: "雷达截面", en: "Radar cross-section" },
  },
};

const special = ask(
  "special-task",
  { zh: "测量挑战", en: "The measurement" },
  { zh: "它用于什么测量室？", en: "What will the chamber measure?" },
  {
    zh: "Chamber Matrix的特殊暗室盒没有目录模型。由于所有四个挑战都是围绕测量挑战而不是标准模型设计的，因此这直接导致设计团队审查。",
    en: "The Special Chambers box in the matrix has no catalogue models under it. All four are designed to the measurement task rather than picked from the standard range, so this branch goes straight to the engineering team.",
  },
  [
    ...specialUses.map((use) => ({
      id: use,
      label: specialTaskCopy[use].label,
      note: specialTaskCopy[use].note,
      carry: { use },
      next: { kind: "form", qid: "D" } satisfies FormNode,
    })),
    // The matrix draws the Ⓓ circle as this segment's `custom` oval, level
    // with the four tasks rather than under them. Since none of the four has a
    // catalogue model they all end there anyway — so what the oval really adds
    // is a way in for the measurement that is none of the four.
    {
      id: "custom",
      label: { zh: "其他特殊测量", en: "Some other special measurement" },
      note: {
        zh: "不适合四项任务中任何一项的测量",
        en: "A measurement none of the four tasks describes",
      },
      next: { kind: "form", qid: "D" } satisfies FormNode,
    },
  ],
);

/* ---- The root ------------------------------------------------------ */

/**
 * Question one: the four boxes at the top of the matrix, in the drawing's
 * order and with the extension's renaming of the second one.
 *
 * The Shielded Room is deliberately not here. It appears nowhere in the
 * matrix, and it is not an EMC test site — it is the shell the range is built
 * on, bought on its own. A reader after one is served by its product page, not
 * by a chamber-selection tree.
 */
export const tree: AskNode = ask(
  "segment",
  { zh: "应用领域", en: "Application" },
  { zh: "您需要哪个应用领域的暗室？", en: "Which field is the chamber for?" },
  {
    zh: "这是我们的暗室矩阵的第一个分支。后续问题将遵循您在此处选择的领域的分支 - 即使最长的路径也只需要几个问题。",
    en: "The first branch of the head office Chamber Matrix. Everything after this follows the branch of the field you choose, and even the longest path is a handful of questions.",
  },
  [
    {
      id: "automotive",
      label: { zh: "Automotive", en: "Automotive" },
      note: { zh: "车辆、电气元件、电动传动系统（E-Drive）", en: "Vehicles, vehicle components and electric drivetrains" },
      next: automotive,
    },
    {
      id: "commercial",
      label: { zh: "Commercial · Industrial", en: "Commercial · Industrial" },
      note: { zh: "一般工业及电子设备", en: "Industrial and consumer electronics" },
      next: commercial,
    },
    {
      id: "military",
      label: { zh: "Military", en: "Military" },
      note: { zh: "军事、国防、航空", en: "Defence and aerospace" },
      next: military,
    },
    {
      id: "special",
      label: { zh: "特殊暗室", en: "Special chambers" },
      note: {
        zh: "卫星测试·天线测量（OTA）·RCS——EMC测试以外的测量任务",
        en: "Satellite testing, antenna measurement (OTA), RCS — measurement tasks beyond EMC",
      },
      next: special,
    },
  ],
);

/* ------------------------------------------------------------------ *
 * Walking it
 * ------------------------------------------------------------------ */

/** The reader's answers: one option id per question, in the order asked. */
export type Path = readonly string[];

export type Step = {
  question: AskNode;
  /** Undefined only for the last entry, which is the question being asked. */
  chosen?: Branch;
};

export type Walk = {
  /** Every question the path has reached, answered ones first and the one
   *  being asked last. Drives the progress strip and the enquiry mail. */
  steps: readonly Step[];
  /** Where the path lands: the unanswered question, or the outcome. */
  at: Node;
  /** The path with anything unrecognised trimmed off. Choosing a different
   *  option part-way up invalidates everything under it, and this is where
   *  that happens — there is no separate pruning pass. */
  path: Path;
};

export const walk = (path: Path): Walk => {
  const steps: Step[] = [];
  const kept: string[] = [];
  let node: Node = tree;

  while (node.kind === "ask") {
    // Annotated because `Branch` and `Node` are mutually recursive, and the
    // inference walks in a circle without it.
    const chosen: Branch | undefined = node.options.find((o) => o.id === path[kept.length]);
    steps.push({ question: node, chosen });
    if (!chosen) break;
    kept.push(chosen.id);
    node = chosen.next;
  }

  return { steps, at: node, path: kept };
};

/**
 * Everything the branch has established, in the vocabulary of the segment's
 * questionnaire — see `Branch.carry`.
 *
 * Accumulated in the order asked, so a later branch overrides an earlier one
 * where both speak to the same field. Handed to whichever questionnaire the
 * reader reaches: the one their branch ends in, or the one the escape link
 * opens. A reader who answered "완성차" three questions ago should not be asked
 * again on the way out.
 */
export const carried = (path: Path): Readonly<Record<string, string>> => {
  const out: Record<string, string> = {};
  for (const step of walk(path).steps) Object.assign(out, step.chosen?.carry ?? {});
  return out;
};

/** The segment the path is on, before anything is chosen under it. */
export const segmentOf = (path: Path): SegmentChoice | undefined =>
  (segments as readonly string[]).includes(path[0]) ? (path[0] as SegmentChoice) : undefined;

/** Every model designation any branch of the tree ends in. Used by
 *  mychamber-catalogue.ts to check the tree against the catalogue at build
 *  time, and by the conformance test to check the catalogue against the tree. */
export const treeModels = (): readonly string[] => {
  const found = new Set<string>();
  const visit = (node: Node) => {
    if (node.kind === "models") {
      for (const leaf of node.leaves) found.add(leaf.model);
    } else if (node.kind === "ask") {
      for (const option of node.options) visit(option.next);
    }
  };
  visit(tree);
  return [...found];
};

/* ------------------------------------------------------------------ *
 * The result
 * ------------------------------------------------------------------ */

/** What the wizard needs about a model in the browser. Built on the server
 *  from `chamberModels` so the client bundle does not carry two locales of
 *  every model page's prose — see mychamber-catalogue.ts. */
export type CatalogueEntry = {
  name: string;
  desc: string;
  industry: ChamberIndustry;
  industryLabel: string;
  type: ChamberType;
  typeLabel: string;
  spec?: { size: string; range?: string; note?: string };
  /** The model's category index page, in the reader's locale. */
  href: string;
  /** The plate the model's own page leads with, carrying that page's alt. The
   *  card and the page have to show the same room — see mychamber-catalogue.ts. */
  shot: { src: string; w: number; h: number; alt?: string };
};

export type Recommendation = {
  entry: CatalogueEntry;
  /** Why the matrix puts this model at the end of this branch. */
  why: string;
  /** The exact configuration the branch pins down, where it pins one down. */
  variant?: { name: string; size: string; note: string };
  caveat?: string;
};

/**
 * The models at the end of the branch, joined to the catalogue.
 *
 * In the drawing's order, because that is the head office's own ordering and
 * nothing here re-ranks it. A leaf naming a model the catalogue does not carry
 * is dropped rather than rendered empty — and cannot happen, because
 * mychamber-catalogue.ts fails the build on it.
 */
export const resolve = (
  catalogue: readonly CatalogueEntry[],
  node: ModelsNode,
  lang: Lang,
): Recommendation[] =>
  node.leaves.flatMap((leaf) => {
    const entry = catalogue.find((e) => e.name === leaf.model);
    if (!entry) return [];
    return [{
      entry,
      why: leaf.why[lang],
      variant: leaf.variant && {
        name: leaf.variant.name,
        size: leaf.variant.size,
        note: leaf.variant.note[lang],
      },
      caveat: leaf.caveat?.[lang],
    }];
  });
