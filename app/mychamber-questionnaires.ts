import { standards, type QuestionnaireId, type SegmentChoice } from "./mychamber-advisor";
import type { ChamberIndustry } from "./chamber-sections";
import type { Lang } from "./site-config";

/**
 * The five questionnaires of the Chamber Matrix extension.
 *
 * The extension hangs a circled questionnaire under every segment — Ⓐ
 * Automotive, Ⓑ Commercial Industrial, Ⓒ Military, Ⓓ Special Chambers — and
 * draws a free-standing ⓧ Custom Request beside the tree. The matrix named
 * them and nothing more, so the fields used to be ours to design.
 *
 * They are not any more. The head office wrote the questions out on
 * 24 August 2026 — five lists, question by question, with the branching spelled
 * in («NO >> …», «YES >> …») — and this file is that mail as data. Where a
 * question below has no counterpart in the mail it is marked optional and said
 * so in its comment; everything the head office listed is required, because the
 * mail asks for exactly that: *All questions shall be answered, step by step.*
 *
 * The questionnaires run **beside** the matrix wizard rather than replacing it.
 * A reader who walked the tree and left it part-way through arrives here with
 * what the branch already established filled in — see `Branch.carry` in
 * mychamber-advisor.ts, whose vocabulary is the field and option ids below.
 *
 * Nothing here is posted anywhere: the answers are assembled into a `mailto:`
 * addressed to the Korean sales office with the head office in copy — see
 * mychamber-questionnaire.tsx.
 */

export type { QuestionnaireId };

type L = Record<Lang, string>;

export type QChoiceOption = { id: string; label: L; note?: L };

/** What the form holds: one entry per field, a string for everything but the
 *  multi-choice fields. Declared here rather than in the component because
 *  `when` below is written against it. */
export type QValues = Readonly<Record<string, string | readonly string[]>>;

/** Whether a multi-choice field holds a given option. A carried-in answer
 *  arrives as a bare string, which is why this is not `Array.includes`. */
export const holds = (values: QValues, id: string, option: string): boolean => {
  const v = values[id];
  return typeof v === "string" ? v === option : Array.isArray(v) && v.includes(option);
};

/**
 * The two things a field can say about where it belongs.
 *
 * `when` — a field only asked of some readers. The head office writes these as
 * indented follow-ups: «You want to mix with Military standards? NO / YES >>
 * What kind of products?». The free-text half exists only under YES.
 *
 * `tail` — a field that shares the step of the one before it rather than
 * taking a screen of its own. That is what keeps one head-office question on
 * one screen: the YES follow-up sits under its own NO/YES, and weight sits
 * beside size. A hidden field is neither required nor written into the
 * message — see `visibleFields`.
 */
type QWhere = { when?: (values: QValues) => boolean; tail?: true };

export type QField = QWhere &
  (
    | {
        kind: "choice";
        id: string;
        label: L;
        /** What the progress strip prints. The label is a sentence; this is a
         *  word or two, because the strip has one line for it. */
        kicker?: L;
        /** Checkboxes when true, radio buttons when false. */
        multi?: true;
        optional?: true;
        options: readonly QChoiceOption[];
      }
    | { kind: "text"; id: string; label: L; kicker?: L; optional?: true; placeholder?: L }
    | { kind: "textarea"; id: string; label: L; kicker?: L; optional?: true; placeholder?: L }
  );

export type Questionnaire = {
  id: QuestionnaireId;
  /** The matrix node the questionnaire hangs under. `custom` is ⓧ. */
  segment: SegmentChoice | "custom";
  /** The circled letter, spelled the way the matrix writes it. */
  name: L;
  title: L;
  intro: L;
  fields: readonly QField[];
};

/* ------------------------------------------------------------------ *
 * Shared fields
 *
 * Eight of the head office's questions are the same eight in every list —
 * size, weight, pre/full compliance, the two or three "mix with" pairs, the
 * facility, the timeframe. They are built once here and spelled once.
 * ------------------------------------------------------------------ */

const yesNo = (yes: L, no: L): readonly QChoiceOption[] => [
  { id: "no", label: no },
  { id: "yes", label: yes },
];

const NO: L = { zh: "否", en: "No" };
const YES: L = { zh: "是", en: "Yes" };

/** Head office question 2 — «How large is your product?» */
const sizeField: QField = {
  kind: "text",
  id: "size",
  label: { zh: "产品尺寸是多少？", en: "How large is your product?" },
  kicker: { zh: "尺寸", en: "Size" },
  placeholder: {
    zh: "基于最大的被测设备——例如4,800 × 1,900 × 1,500 毫米",
    en: "For the largest EUT you will test — e.g. 4,800 × 1,900 × 1,500 mm",
  },
};

/** Head office question 3 — «How heavy is your product?». Shares the screen
 *  with the size, because the two are read together and answered together. */
const weightField: QField = {
  kind: "text",
  id: "weight",
  tail: true,
  label: { zh: "产品重量是多少？", en: "How heavy is your product?" },
  kicker: { zh: "重量", en: "Weight" },
  placeholder: { zh: "示例：2,100公斤", en: "e.g. 2,100 kg" },
};

/**
 * Head office question 4 — «Pre-compliance or full compliance testing?»
 *
 * The mail wrote it as "Pre-compliance for full compliance testing?"; the head
 * office confirmed on 24 August 2026 that it is the either/or. "Both" is ours:
 * the CHC and the CTC exist precisely because a laboratory screens during
 * development and certifies afterwards, and a reader forced to pick one of the
 * two would be answering a question we did not mean to ask.
 */
const complianceField: QField = {
  kind: "choice",
  id: "compliance",
  label: { zh: "这是预认证还是正式认证？", en: "Pre-compliance or full compliance testing?" },
  kicker: { zh: "认证等级", en: "Compliance" },
  options: [
    { id: "pre", label: { zh: "预认证（预合规）", en: "Pre-compliance" },
      note: { zh: "研发阶段筛查", en: "Screening during development" } },
    { id: "full", label: { zh: "官方认证（完全合规）", en: "Full compliance" },
      note: { zh: "认证与型式批准", en: "Certification and type approval" } },
    { id: "both", label: { zh: "两者", en: "Both" },
      note: { zh: "一室开发和认证", en: "Development and certification in one chamber" } },
    { id: "undecided", label: { zh: "未定", en: "Not decided" } },
  ],
};

/**
 * The «You want to mix with … standards?» pairs — head office questions 6 and
 * 7 of Ⓐ and Ⓒ, 8 and 9 of Ⓑ.
 *
 * Two fields rather than one: the NO/YES is the answer the sales office reads
 * first, and the free text only exists under YES. Building them as a pair from
 * one call is what keeps the two ids in step.
 */
const mixFields = (key: string, segment: L): readonly QField[] => [
  {
    kind: "choice",
    id: `mix${key}`,
    label: { zh: `您是否需要兼容${segment.zh}标准？`, en: `Do you want to mix with ${segment.en} standards?` },
    kicker: { zh: `${segment.zh} 混合用途`, en: `Mix — ${segment.en}` },
    options: yesNo(YES, NO),
  },
  {
    kind: "text",
    id: `mix${key}What`,
    tail: true,
    when: (values) => values[`mix${key}`] === "yes",
    label: { zh: "这是什么产品？", en: "What kind of products?" },
    kicker: { zh: `${segment.zh} — 目标`, en: `${segment.en} — what` },
    placeholder: { zh: "请随意书写。", en: "In your own words." },
  },
];

/** Head office question «Do you have a facility, yet?» */
const facilityField: QField = {
  kind: "choice",
  id: "facility",
  label: { zh: "您已有建筑物要安装吗？", en: "Do you have a facility, yet?" },
  kicker: { zh: "安装场地", en: "Facility" },
  options: yesNo(YES, NO),
};

/**
 * Not a head office question. It rides on the facility answer's screen because
 * that is the only place on the form where the building comes up at all, and a
 * floor area or a ceiling height changes what can be offered.
 */
const siteField: QField = {
  kind: "textarea",
  id: "site",
  tail: true,
  optional: true,
  label: { zh: "安装环境（可选）", en: "The building (optional)" },
  kicker: { zh: "安装环境", en: "The building" },
  placeholder: {
    zh: "请写明影响设计的条件，如使用面积、层高、现有设施等。",
    en: "Floor area, height, existing installations — anything that shapes the design.",
  },
};

/**
 * Head office question «What is your implementation time frame?».
 *
 * The mail says free text; we keep the four brackets, confirmed on
 * 24 August 2026. A bracket is what a sales office sorts an enquiry by, and
 * "Q3 next year" and "내년 3분기" sort into nothing.
 */
const timelineField: QField = {
  kind: "choice",
  id: "timeline",
  label: { zh: "您的计划实施时间是什么时候？", en: "What is your implementation time frame?" },
  kicker: { zh: "实施时间", en: "Timeframe" },
  options: [
    { id: "6m", label: { zh: "6个月内", en: "Within six months" } },
    { id: "1y", label: { zh: "1年内", en: "Within a year" } },
    { id: "later", label: { zh: "1年后", en: "Beyond a year" } },
    { id: "exploring", label: { zh: "评审阶段", en: "Still exploring" } },
  ],
};

/* ---- The optional tail --------------------------------------------- *
 *
 * Three fields the head office did not ask for, kept because the engineering
 * team reads them and confirmed on 24 August 2026 that they stay — as optional
 * answers, on one screen at the end, so they never stand between a reader and
 * the send button.
 */

/** The standards the questionnaire's segment implies, as tick boxes. Reused
 *  from the advisor's own list so a designation is never spelled twice. */
const standardOptions = (industries: readonly ChamberIndustry[]): readonly QChoiceOption[] =>
  standards
    .filter((s) => s.industries.some((i) => industries.includes(i)))
    .map((s) => ({ id: s.id, label: { zh: s.name, en: s.name }, note: s.hint }));

const standardsField = (industries: readonly ChamberIndustry[]): QField => ({
  kind: "choice",
  id: "standards",
  multi: true,
  optional: true,
  label: { zh: "适用标准（可选）", en: "Standards to satisfy (optional)" },
  kicker: { zh: "标准", en: "Standards" },
  options: standardOptions(industries),
});

const freqOptionalField: QField = {
  kind: "text",
  id: "freq",
  tail: true,
  optional: true,
  label: { zh: "频率范围（可选）", en: "Frequency range (optional)" },
  kicker: { zh: "频率", en: "Frequency" },
  placeholder: { zh: "示例：30 MHz – 18 GHz", en: "e.g. 30 MHz – 18 GHz" },
};

/** Head office questions Ⓓ5 and ⓧ8, where the range is asked outright. */
const freqField: QField = {
  kind: "text",
  id: "freq",
  label: { zh: "哪个频率范围对您来说很重要？", en: "What frequency range is important for you?" },
  kicker: { zh: "频率", en: "Frequency" },
  placeholder: { zh: "示例：30 MHz – 18 GHz", en: "e.g. 30 MHz – 18 GHz" },
};

const requirementField: QField = {
  kind: "textarea",
  id: "requirement",
  tail: true,
  optional: true,
  label: { zh: "您想分享的任何其他信息（可选）", en: "Anything else (optional)" },
  kicker: { zh: "附加内容", en: "Anything else" },
  placeholder: {
    zh: "请写下上述各项未涵盖的任何条件——特殊测试配置、吞吐量、与现有设备的关系等。",
    en: "Anything the answers above did not carry — an unusual test setup, throughput, how it relates to an existing installation.",
  },
};

/** Head office questions Ⓓ4 and ⓧ5, where the standards are free text
 *  because the measurement methods they name are not in our own list. */
const standardsTextField: QField = {
  kind: "textarea",
  id: "standardsText",
  label: { zh: "有什么必须满足的标准吗？", en: "Do you have to meet specific standards?" },
  kicker: { zh: "标准", en: "Standards" },
  placeholder: {
    zh: "请写出您所知道的标准号或内部标准。",
    en: "Designations or internal requirements, as far as you know them.",
  },
};

/* ---- The load machine, asked only of a bench that has one ---------- *
 *
 * Not a head office question either, and the one place where dropping ours
 * would cost a number nothing else on the form asks for: the three EDTC
 * chambers differ in the dynamometer, and a quotation for one starts from its
 * rating. It used to hang off an "E-Drive" answer that the head office's own
 * product list does not have — it now hangs off the two answers that do imply
 * a dyno.
 */
const onDyno = (values: QValues) =>
  holds(values, "products", "motor") || holds(values, "products", "vehicle-dyno");

const driveSetupField: QField = {
  kind: "choice",
  id: "driveSetup",
  optional: true,
  when: onDyno,
  label: { zh: "负载（测功机）配置是什么？ （可选）", en: "Which load machine? (optional)" },
  kicker: { zh: "负载", en: "Load machine" },
  options: [
    { id: "single", label: { zh: "固定单轴负载", en: "Fixed single dyno" } },
    { id: "eaxle", label: { zh: "固定2轴负载（电子轴）", en: "Fixed axis dyno (e-axle)" } },
    { id: "bluebox", label: { zh: "移动负载（EMC-BlueBox）", en: "Mobile dyno (EMC-BlueBox)" } },
    { id: "undecided", label: { zh: "未定", en: "Not decided" } },
  ],
};

const drivePowerField: QField = {
  kind: "text",
  id: "drivePower",
  tail: true,
  optional: true,
  when: onDyno,
  label: { zh: "负载输出/最高转速（选择）", en: "Load machine rating (optional)" },
  kicker: { zh: "负载输出", en: "Rating" },
  placeholder: { zh: "示例：250 kW，20,000 rpm", en: "e.g. 250 kW, 20,000 rpm" },
};

const intro: L = {
  zh: "如果您逐一回答每个问题，系统会对其进行汇总，并创建一封电子邮件转发给销售负责人。",
  en: "Answer them one at a time and they are summarised into the message that goes to your sales contact.",
};

/* ------------------------------------------------------------------ *
 * Ⓐ Automotive
 * ------------------------------------------------------------------ */

const A: Questionnaire = {
  id: "A",
  segment: "automotive",
  name: { zh: "调查Ⓐ——汽车", en: "Questionnaire Ⓐ — Automotive" },
  title: { zh: "汽车检测要求", en: "Your automotive test requirement" },
  intro,
  fields: [
    {
      kind: "choice",
      id: "products",
      multi: true,
      label: { zh: "您希望测试哪些产品？", en: "What kind of products do you want to test?" },
      kicker: { zh: "被测设备", en: "Products" },
      options: [
        { id: "component", label: { zh: "电器元件", en: "Electric component" },
          note: { zh: "ECU、传感器、电气模块", en: "ECUs, sensors, electronic modules" } },
        { id: "motor", label: { zh: "驱动电机（电动机）", en: "Electric motor" } },
        { id: "battery", label: { zh: "电池", en: "Battery" } },
        { id: "vehicle", label: { zh: "整车—无测功机", en: "Vehicle without dyno" } },
        { id: "vehicle-dyno", label: { zh: "整车—带测功机", en: "Vehicle with dyno" } },
      ],
    },
    sizeField,
    weightField,
    driveSetupField,
    drivePowerField,
    complianceField,
    {
      // Head office question 5, with both of its halves. The NO branch asks the
      // test distance and the YES branch asks the level — so the two follow-ups
      // are mutually exclusive and share this one screen with their question.
      kind: "choice",
      id: "reverb",
      label: { zh: "您是否考虑混响室测试方案？", en: "Are you interested in reverberation solutions?" },
      kicker: { zh: "混响室", en: "Reverberation" },
      options: [
        { id: "no", label: NO, note: { zh: "前往全电波暗室或半电波暗室测试场地", en: "An anechoic or semi-anechoic site" } },
        { id: "yes", label: YES, note: { zh: "IEC 61000-4-21 · ISO 11452-11", en: "IEC 61000-4-21, ISO 11452-11" } },
      ],
    },
    {
      kind: "choice",
      id: "distance",
      tail: true,
      // Shown until the reader says yes, rather than only once they say no:
      // the tree's own vehicle branch carries a distance in, and a field the
      // carried answer cannot be seen in is a field that lost it.
      when: (values) => values.reverb !== "yes",
      label: { zh: "您的产品适合哪种测量距离？", en: "What test distance fits best for your product?" },
      kicker: { zh: "测量距离", en: "Distance" },
      options: [
        { id: "1m", label: { zh: "1.0 m", en: "1.0 m" } },
        { id: "2m", label: { zh: "2.0 m", en: "2.0 m" } },
        { id: "3m", label: { zh: "3.0 m", en: "3.0 m" } },
        { id: "5m", label: { zh: "5.0 m", en: "5.0 m" } },
        { id: "10m", label: { zh: "10.0 m", en: "10.0 m" } },
        { id: "undecided", label: { zh: "未定", en: "Not decided" } },
      ],
    },
    {
      kind: "choice",
      id: "reverbLevel",
      tail: true,
      when: (values) => values.reverb === "yes",
      label: { zh: "您关注部件级还是整车级混响室测试？", en: "What exactly interests you?" },
      kicker: { zh: "混响室范围", en: "Reverberation level" },
      options: [
        { id: "components", label: { zh: "元件", en: "Component level" } },
        { id: "vehicle", label: { zh: "车辆级别", en: "Vehicle level" } },
      ],
    },
    ...mixFields("Commercial", { zh: "商业/工业", en: "commercial / industrial" }),
    ...mixFields("Military", { zh: "军用", en: "military" }),
    facilityField,
    siteField,
    timelineField,
    standardsField(["automotive", "powertrain"]),
    freqOptionalField,
    requirementField,
  ],
};

/* ------------------------------------------------------------------ *
 * Ⓑ Commercial · Industrial
 * ------------------------------------------------------------------ */

const B: Questionnaire = {
  id: "B",
  segment: "commercial",
  name: { zh: "调查Ⓑ——商业·工业", en: "Questionnaire Ⓑ — Commercial · Industrial" },
  title: { zh: "商业/工业测试要求", en: "Your commercial / industrial test requirement" },
  intro,
  fields: [
    {
      // The head office list, in its order — except "Others", which the mail
      // writes sixth of eight and which is last here. A catch-all in the middle
      // of a grid of tick boxes reads as a category of its own.
      kind: "choice",
      id: "products",
      multi: true,
      label: { zh: "您希望测试哪些产品？", en: "What kind of products do you want to test?" },
      kicker: { zh: "被测设备", en: "Products" },
      options: [
        { id: "multimedia", label: { zh: "多媒体", en: "Multimedia" } },
        { id: "industry", label: { zh: "工业设备（工业）", en: "Industry" } },
        { id: "medical", label: { zh: "医疗", en: "Medical" } },
        { id: "lights", label: { zh: "灯", en: "Lights" } },
        { id: "household", label: { zh: "家用电器", en: "Household appliances" } },
        { id: "components", label: { zh: "元件", en: "Components" } },
        { id: "subsystems", label: { zh: "子系统", en: "Subsystems" } },
        { id: "other", label: { zh: "其他", en: "Others" } },
      ],
    },
    sizeField,
    weightField,
    complianceField,
    {
      kind: "choice",
      id: "tests",
      multi: true,
      label: { zh: "您需要进行哪些测试？", en: "What tests do you want to follow?" },
      kicker: { zh: "测试类型", en: "Tests" },
      options: [
        { id: "emission", label: { zh: "发射", en: "Emission" } },
        { id: "immunity", label: { zh: "抗扰度", en: "Immunity" } },
        { id: "conducted", label: { zh: "传导测试", en: "Conducted testing" } },
      ],
    },
    {
      kind: "text",
      id: "qz",
      label: { zh: "哪种静区（QZ）尺寸适合我的产品？", en: "What quiet zone size fits best for your product?" },
      kicker: { zh: "静区", en: "Quiet zone" },
      placeholder: { zh: "直径 × 高度 — 示例：ø3.0 m × 2.0 m", en: "Diameter by height — e.g. ø3.0 m × 2.0 m" },
    },
    {
      kind: "choice",
      id: "distance",
      label: { zh: "您的产品适合哪种测量距离？", en: "What test distance fits best for your product?" },
      kicker: { zh: "测量距离", en: "Distance" },
      options: [
        { id: "1m", label: { zh: "1.0 m", en: "1.0 m" } },
        { id: "3m", label: { zh: "3.0 m", en: "3.0 m" } },
        { id: "5m", label: { zh: "5.0 m", en: "5.0 m" } },
        { id: "10m", label: { zh: "10.0 m", en: "10.0 m" } },
        { id: "undecided", label: { zh: "未定", en: "Not decided" } },
      ],
    },
    ...mixFields("Automotive", { zh: "汽车", en: "automotive" }),
    ...mixFields("Military", { zh: "军用", en: "military" }),
    {
      kind: "choice",
      id: "reverbAlt",
      label: { zh: "您愿意考虑混响作为替代方案吗？", en: "Do you want to check reverberation as an alternative?" },
      kicker: { zh: "混响室替代方案", en: "Reverberation" },
      options: yesNo(YES, NO),
    },
    facilityField,
    siteField,
    timelineField,
    standardsField(["commercial"]),
    freqOptionalField,
    requirementField,
  ],
};

/* ------------------------------------------------------------------ *
 * Ⓒ Military
 * ------------------------------------------------------------------ */

const C: Questionnaire = {
  id: "C",
  segment: "military",
  name: { zh: "调查Ⓒ——军事", en: "Questionnaire Ⓒ — Military" },
  title: { zh: "军事测试要求", en: "Your military test requirement" },
  intro,
  fields: [
    {
      kind: "choice",
      id: "products",
      multi: true,
      label: { zh: "您希望测试哪些产品？", en: "What kind of products do you want to test?" },
      kicker: { zh: "被测设备", en: "Products" },
      options: [
        { id: "component", label: { zh: "元件", en: "Components" } },
        { id: "subsystem", label: { zh: "子系统", en: "Subsystem" } },
        { id: "vehicle", label: { zh: "车辆", en: "Vehicles" } },
        { id: "heavy-vehicle", label: { zh: "重型车辆", en: "Heavy duty vehicles" } },
        { id: "special", label: { zh: "特价", en: "Specials" } },
      ],
    },
    sizeField,
    weightField,
    complianceField,
    {
      // The matrix splits the military branch on where the range starts — it is
      // what separates the P600 lining from the P2400 — so 26 MHz stays on the
      // list beside the head office's own two, and is what the tree carries in.
      kind: "choice",
      id: "startFreq",
      label: { zh: "发射测试开始频率是多少？", en: "What is your emission start frequency?" },
      kicker: { zh: "启动频率", en: "Start frequency" },
      options: [
        { id: "30", label: { zh: "30 MHz", en: "30 MHz" } },
        { id: "80", label: { zh: "80 MHz", en: "80 MHz" } },
        { id: "26", label: { zh: "26 MHz", en: "26 MHz" } },
        { id: "other", label: { zh: "其他", en: "Others" } },
      ],
    },
    {
      kind: "text",
      id: "startFreqOther",
      tail: true,
      when: (values) => values.startFreq === "other",
      label: { zh: "请写出起始频率。", en: "Which frequency?" },
      kicker: { zh: "启动频率—其他", en: "Start frequency — other" },
      placeholder: { zh: "示例：10kHz", en: "e.g. 10 kHz" },
    },
    ...mixFields("Commercial", { zh: "商业/工业", en: "commercial / industrial" }),
    ...mixFields("Automotive", { zh: "汽车", en: "automotive" }),
    facilityField,
    siteField,
    timelineField,
    standardsField(["military"]),
    // MIL-STD-461 and DO-160 are decided at the top of the range as well as at
    // the bottom: 18 GHz against 40 GHz changes the lining and the ferrite.
    freqOptionalField,
    requirementField,
  ],
};

/* ------------------------------------------------------------------ *
 * Ⓓ Special Chambers
 * ------------------------------------------------------------------ */

const D: Questionnaire = {
  id: "D",
  segment: "special",
  name: { zh: "调查Ⓓ——特殊暗室", en: "Questionnaire Ⓓ — Special chambers" },
  title: { zh: "特殊暗室要求", en: "Your special-chamber requirement" },
  intro: {
    zh: "特殊的腔室旨在满足您的测量任务，而不是标准型号。如果您一一回答每个问题，系统将对其进行汇总，并撰写一封电子邮件转发给负责的销售代表。",
    en: "A special chamber is designed to the measurement task rather than picked from the standard range. Answer the questions one at a time and they are summarised into the message that goes to your sales contact.",
  },
  fields: [
    {
      // Option ids match `specialUses` in the advisor, so the wizard's answer
      // carries straight in as a pre-selection. The head office asks this one
      // as free text; the four tasks are the four the matrix itself draws, and
      // `object` below is where the free text goes.
      kind: "choice",
      id: "use",
      label: { zh: "您进行哪些测量？", en: "What kind of measurement do you want to make?" },
      kicker: { zh: "测量挑战", en: "Measurement" },
      options: [
        { id: "sat", label: { zh: "卫星测试（SAT暗室）", en: "Satellite testing — SAT chamber" } },
        { id: "ota", label: { zh: "天线零件·OTA", en: "Antenna components — OTA" } },
        { id: "antenna-vehicle", label: { zh: "车辆天线测量", en: "Vehicle antenna measurement" } },
        { id: "rcs", label: { zh: "RCS 测量", en: "RCS measurement" } },
      ],
    },
    {
      kind: "textarea",
      id: "object",
      label: { zh: "你在测量什么？", en: "What kind of products do you want to test?" },
      kicker: { zh: "测量目标", en: "Products" },
      placeholder: {
        zh: "请随意写出您所测量的内容。",
        en: "What is measured, in your own words.",
      },
    },
    sizeField,
    weightField,
    standardsTextField,
    freqField,
    facilityField,
    siteField,
    timelineField,
    { ...requirementField, tail: undefined },
  ],
};

/* ------------------------------------------------------------------ *
 * ⓧ Custom Request
 * ------------------------------------------------------------------ */

const X: Questionnaire = {
  id: "X",
  segment: "custom",
  name: { zh: "定制请求 ⓧ — 定制请求", en: "Custom Request ⓧ" },
  title: { zh: "定制要求", en: "A custom request" },
  intro: {
    zh: "如果您还没有决定测试要求的领域或目的，也没关系。只需写下您所知道的内容，我们将一起组织。",
    en: "If you do not yet know which direction, industry or application your test requirement goes, tell us what you have so far and we will work it out with you.",
  },
  fields: [
    {
      // Head office question 1, and the only routing question on the site: YES
      // plus an industry hands the reader to that industry's own questionnaire
      // with everything answered so far carried across. The component draws the
      // handover button — see mychamber-questionnaire.tsx.
      kind: "choice",
      id: "known",
      label: { zh: "你已经决定要测试什么了吗？", en: "Do you know what kind of products you want to test?" },
      kicker: { zh: "目标确定", en: "Products known" },
      options: [
        { id: "no", label: { zh: "尚未决定", en: "Not yet" },
          note: { zh: "你可以这样继续。", en: "Carry on with this questionnaire" } },
        { id: "yes", label: { zh: "是的，已修复", en: "Yes" },
          note: { zh: "如果您选择一个字段，您将被引导至相应的调查。", en: "Choose the industry and we take you to its questionnaire" } },
      ],
    },
    {
      kind: "choice",
      id: "field",
      tail: true,
      when: (values) => values.known === "yes",
      label: { zh: "适用于哪些领域？", en: "To which industry is it related?" },
      kicker: { zh: "田野", en: "Industry" },
      options: [
        { id: "automotive", label: { zh: "Automotive", en: "Automotive" }, note: { zh: "调查Ⓐ", en: "Questionnaire Ⓐ" } },
        { id: "commercial", label: { zh: "Commercial · Industrial", en: "Commercial · Industrial" }, note: { zh: "调查Ⓑ", en: "Questionnaire Ⓑ" } },
        { id: "military", label: { zh: "Military", en: "Military" }, note: { zh: "调查Ⓒ", en: "Questionnaire Ⓒ" } },
        { id: "special", label: { zh: "Special Chambers", en: "Special chambers" }, note: { zh: "调查Ⓓ", en: "Questionnaire Ⓓ" } },
      ],
    },
    {
      kind: "textarea",
      id: "product",
      label: { zh: "请告诉我们您正在测试的产品。", en: "Tell us about the product you want to test." },
      kicker: { zh: "产品", en: "Product" },
      placeholder: { zh: "你知道多少就写多少。", en: "As much as you know." },
    },
    sizeField,
    weightField,
    {
      ...standardsTextField,
      label: { zh: "是否有必须满足的规格或内部标准？", en: "Do you have to meet specific standards or internal requirements?" },
    },
    {
      kind: "textarea",
      id: "application",
      label: { zh: "这个产品是用来做什么的？", en: "Tell us about your application." },
      kicker: { zh: "使用", en: "Application" },
      placeholder: { zh: "请写出该产品的实际使用情况。", en: "How the product is actually used." },
    },
    {
      kind: "textarea",
      id: "special",
      label: { zh: "有什么必须满足的特殊要求吗？", en: "What special requirements do you need to meet?" },
      kicker: { zh: "特殊要求", en: "Special requirements" },
      placeholder: { zh: "如果没有，请写“无”。", en: "Write “none” if there are none." },
    },
    freqField,
    facilityField,
    siteField,
    timelineField,
  ],
};

export const questionnaires: readonly Questionnaire[] = [A, B, C, D, X];

export const questionnaire = (id: QuestionnaireId): Questionnaire =>
  questionnaires.find((q) => q.id === id)!;

/**
 * The fields a questionnaire actually asks, given what has been answered so
 * far.
 *
 * Every reader of the form goes through here — the steps, the check that
 * decides whether a step can be left, and the message itself. A field that is
 * not on screen is therefore never required and never sent, which is what
 * keeps a stale answer from riding along: a reader who says YES to mixing with
 * military standards, names the products, then changes to NO keeps the typing
 * (it comes back if they change their mind again) but the enquiry does not
 * carry a requirement they withdrew.
 */
export const visibleFields = (q: Questionnaire, values: QValues): readonly QField[] =>
  q.fields.filter((f) => !f.when || f.when(values));

/**
 * The questionnaire as screens.
 *
 * One head office question is one screen. A `tail` field joins the screen of
 * the field before it, which is what puts «YES >> what kind of products?»
 * under its own NO/YES rather than a click away from it — and what keeps the
 * three optional extras from becoming three more screens at the end.
 *
 * A tail whose head is hidden starts a screen of its own rather than
 * disappearing: nothing in the five questionnaires does that today, and losing
 * a field silently would be worse than an extra screen.
 */
export const questionSteps = (q: Questionnaire, values: QValues): readonly (readonly QField[])[] => {
  const out: QField[][] = [];
  for (const field of visibleFields(q, values)) {
    if (field.tail && out.length > 0) out[out.length - 1].push(field);
    else out.push([field]);
  }
  return out;
};

/**
 * The questionnaire a segment points at.
 *
 * The matrix hangs one circled letter under each of its four boxes, and the
 * segment question is a single choice, so this is a straight lookup. ⓧ is for
 * the reader who has not reached a segment yet — the free-standing Custom
 * Request box the matrix draws beside the tree.
 */
const letters: Record<SegmentChoice, QuestionnaireId> = {
  automotive: "A",
  commercial: "B",
  military: "C",
  special: "D",
};

export const questionnaireFor = (segment: SegmentChoice | undefined): QuestionnaireId =>
  segment ? letters[segment] : "X";

/** Where ⓧ's routing question sends the reader. The option ids of `field` are
 *  the segment names, so this is `letters` again — named separately because
 *  the component asks it of an answer rather than of a walked path. */
export const questionnaireForField = (field: string | undefined): QuestionnaireId | null =>
  field && field in letters ? letters[field as SegmentChoice] : null;
