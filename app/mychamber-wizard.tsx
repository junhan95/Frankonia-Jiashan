"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import CartAdd from "./cart-add";
import type { CartSeed } from "./cart-store";
import {
  carried,
  resolve,
  segmentOf,
  walk,
  type CatalogueEntry,
  type Path,
  type Recommendation,
  type Step,
} from "./mychamber-advisor";
import QuestionnairePanel from "./mychamber-questionnaire";
import {
  questionnaire,
  questionnaireFor,
  type QuestionnaireId,
  type QValues,
} from "./mychamber-questionnaires";
import { enquiryCc, enquiryEmail, type Lang } from "./site-config";
import SiteLink from "./site-link";

/**
 * The MyChamber wizard — the head office Chamber Matrix, walked one branch at a
 * time.
 *
 * The state is a single array: the option chosen at each question, in order.
 * Everything else is derived from it by `walk` in mychamber-advisor.ts — which
 * questions have been reached, which one is being asked, and what is at the end
 * of the branch. Changing an answer part-way up truncates everything under it,
 * so there is no pruning pass and no way to be filtered by an answer to a
 * question that is no longer on screen.
 *
 * The only client component on this site besides the navigation drawer and the
 * language switch, and it earns it: the questions branch on the answers, so the
 * flow cannot be pre-rendered as a set of pages. The catalogue arrives as props
 * — see the note in mychamber-content.tsx.
 *
 * Nothing here is submitted anywhere. The site is a static export with no back
 * end, and a form that posted to a third party would put a customer's project
 * details somewhere neither they nor Frankonia chose. The enquiry is assembled
 * into a `mailto:` instead: the reader's own mail client opens with the body
 * already written, and they read it before they send it.
 */

type Form = { company: string; person: string; email: string; phone: string; note: string };

const emptyForm: Form = { company: "", person: "", email: "", phone: "", note: "" };

const copy = {
  zh: {
    stepOf: (i: number, n: number) => `问题 ${i} / ${n}`,
    stepAll: (n: number) => `已完成全部 ${n} 个问题`,
    progressLabel: "进度与已选条件",
    jumpHint: "点击每个项目即可返回该问题并进行编辑。如果您更改答案，将再次询问以下选择。",
    jumpTo: (kicker: string) => `返回“${kicker}”问题`,
    single: "仅选择一项",
    back: "上一步",
    next: "下一步",
    toResult: "查看结果",
    toQuestionnaire: "写下您的要求",
    restart: "再次从头开始",
    needAnswer: "请选择一项。",

    resultKicker: "结果",
    resultH: "符合您需求的暗室",
    resultOne: "这是总部 Chamber Matrix 根据您的选择所对应的型号。",
    resultMany: (n: number) =>
      `Chamber Matrix 在此分支提供 ${n} 款型号。这些是同一分支下的备选方案，不代表排名。`,
    rankTop: "推荐",
    rankAlt: (n: number) => `选项 ${n}`,
    why: "选择此暗室的依据",
    variant: "符合所选条件的配置",
    specSize: "外部尺寸",
    specNote: "测量条件",
    specRange: "频率范围",
    seeType: "查看所有同类型型号",
    pick: "咨询此暗室",
    picked: "已选为询价型号",
    caveat: "请检查",

    customLink: "如果您的要求不在标准分支中 - 请通过自定义调查问卷与我们联系",
    customFromResult: "如果标准型号不够用——通过定制调查问卷联系我们",
    customBackFlow: "返回问题",
    customBackResult: "返回结果",

    none: "—",

    quoteKicker: "获取报价",
    quoteH: "按原样发送您的选择",
    quoteP:
      "如果您填写了以下信息，您选择的暗室与选择路径将自动包含在邮件正文中。您的邮件程序将打开，您可以在发送前检查内容。该页面不存储或传输任何信息。",
    fCompany: "公司名称",
    fPerson: "负责人",
    fEmail: "邮箱",
    fPhone: "电话（可选）",
    fNote: "附加请求（可选）",
    fNotePlaceholder: "请写下您想了解的任何信息，例如预计安装时间、建筑条件、预算范围。",
    required: "必填",
    send: "写邮件",
    fillFirst: "输入公司名称、负责人、邮箱，打开邮件创建流程。",
    copyBody: "复制文字",
    copied: "已复制",
    to: (address: string, cc: string) => `收件人：${address} · 抄送：${cc}`,

    mailSubject: (model: string, company: string) => `[My Chamber] ${model} 询价 — ${company}`,
    mailTitle: "Frankonia My Chamber 选型结果",
    mailPick: "选定室",
    mailAnswers: "选择路径",
    mailAlts: "同一分支的其他选项",
    mailFrom: "询问者",
    // The form marks these two "(선택)" because the button does not wait for
    // them; in the message they are just a phone number and a note.
    mailPhone: "电话",
    mailNote: "额外要求",
    mailFoot: "这封电子邮件是 Frankonia My Chamber 根据您的选择自动创建的。",
  },
  en: {
    stepOf: (i: number, n: number) => `Question ${i} of ${n}`,
    stepAll: (n: number) => `All ${n} questions answered`,
    progressLabel: "Progress and answers so far",
    jumpHint: "Select any of them to go back to that question — changing an answer asks the ones below it again.",
    jumpTo: (kicker: string) => `Go to the question about ${kicker}`,
    single: "Select one",
    back: "Back",
    next: "Next",
    toResult: "See the result",
    toQuestionnaire: "Describe the requirement",
    restart: "Start again",
    needAnswer: "Choose one of the options.",

    resultKicker: "Result",
    resultH: "The chamber at the end of this branch",
    resultOne: "The model the head office Chamber Matrix puts at the end of the answers you gave.",
    resultMany: (n: number) =>
      `The Chamber Matrix draws ${n} models side by side at the end of this branch. They are alternatives within it, not a ranking.`,
    rankTop: "Recommended",
    rankAlt: (n: number) => `Option ${n}`,
    why: "Why the matrix puts it here",
    variant: "The configuration your answers point at",
    specSize: "External dimension",
    specNote: "Test conditions",
    specRange: "Frequency range",
    seeType: "See every model of this form",
    pick: "Enquire about this one",
    picked: "Selected for the enquiry",
    caveat: "Worth knowing",

    customLink: "A requirement the branches do not carry? Open the questionnaire",
    customFromResult: "If no standard model quite fits — open the questionnaire",
    customBackFlow: "Back to the questions",
    customBackResult: "Back to the result",

    none: "—",

    quoteKicker: "Enquiry",
    quoteH: "Send it with your answers attached",
    quoteP:
      "Fill this in and the chamber you chose, with the branch you took to reach it, go into the body of the message. Your mail client opens with it written; you read it before it is sent. This page stores and transmits nothing.",
    fCompany: "Company",
    fPerson: "Contact name",
    fEmail: "Email",
    fPhone: "Phone (optional)",
    fNote: "Anything else (optional)",
    fNotePlaceholder: "Timing, building constraints, budget range — whatever helps us answer properly.",
    required: "required",
    send: "Write the email",
    fillFirst: "Company, contact name and email open the message.",
    copyBody: "Copy the text",
    copied: "Copied",
    to: (address: string, cc: string) => `To ${address} — copy to ${cc}`,

    mailSubject: (model: string, company: string) => `[My Chamber] ${model} — quotation request from ${company}`,
    mailTitle: "Frankonia My Chamber result",
    mailPick: "Chamber chosen",
    mailAnswers: "The branch taken",
    mailAlts: "Alternatives at the same branch",
    mailFrom: "Enquirer",
    mailPhone: "Phone",
    mailNote: "Notes",
    mailFoot: "Written automatically by Frankonia My Chamber from the answers above.",
  },
} as const;

export default function MyChamberWizard({
  lang,
  catalogue,
}: {
  lang: Lang;
  catalogue: readonly CatalogueEntry[];
}) {
  const t = copy[lang];

  /** The whole state of the flow: the option chosen at each question, in the
   *  order they were asked. Everything else is derived. */
  const [path, setPath] = useState<Path>([]);
  /** Which question is on screen. Equal to the number of questions reached
   *  when the reader has walked past the last one and the outcome is showing. */
  const [view, setView] = useState(0);
  /** The questionnaire view — which of the five is open, or none. Held as an
   *  id rather than a flag because ⓧ can hand the reader on: its first
   *  question routes a reader who does know their industry into Ⓐ–Ⓓ, and
   *  `routed` is what it sends across with them. */
  const [custom, setCustom] = useState<QuestionnaireId | null>(null);
  const [routed, setRouted] = useState<Readonly<Record<string, string>> | null>(null);
  const [chosen, setChosen] = useState<string | null>(null);
  const [form, setForm] = useState<Form>(emptyForm);
  const [copied, setCopied] = useState(false);

  const trail = useMemo(() => walk(path), [path]);
  const { steps, at } = trail;

  // The outcome is only reachable once every question on the branch has been
  // answered, so the cursor stops one short of the end while one is still open.
  const lastView = at.kind === "ask" ? steps.length - 1 : steps.length;
  const index = Math.min(view, lastView);
  const atOutcome = index === steps.length;
  const step: Step | undefined = atOutcome ? undefined : steps[index];

  const results = useMemo(
    () => (at.kind === "models" ? resolve(catalogue, at, lang) : []),
    [at, catalogue, lang],
  );
  const pick = results.find((r) => r.entry.name === chosen) ?? results[0];

  const headingRef = useRef<HTMLHeadingElement>(null);
  const mounted = useRef(false);
  useEffect(() => {
    // Moving between steps replaces the whole panel, so a keyboard or screen
    // reader user would otherwise be left at the top of the document with no
    // announcement that anything changed. Not on first render — that would
    // scroll the page away from the heading the reader arrived at.
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    headingRef.current?.focus();
  }, [index]);

  /** Answer the question on screen. Everything chosen under it is dropped:
   *  a different branch asks different questions. */
  const choose = (optionId: string) =>
    setPath((prev) => [...prev.slice(0, index), optionId]);

  const restart = () => {
    setPath([]);
    setView(0);
    setChosen(null);
  };

  /** Open the questionnaire this branch points at — the segment's own circled
   *  letter, or ⓧ before a segment has been chosen. */
  const openQuestionnaire = () => {
    setRouted(null);
    setCustom(questionnaireFor(segmentOf(path)));
  };

  /**
   * ⓧ found the reader's industry after all — the head office's own «YES >>
   * link to other Questionnaires».
   *
   * The five questionnaires share a vocabulary, so what the target also asks
   * arrives answered. What it does not ask is not thrown away: ⓧ's free text
   * about the product, its application and its special requirements has no
   * field of its own in Ⓐ–Ⓓ, and it lands in the one field every
   * questionnaire ends with instead. Losing a paragraph somebody typed because
   * they answered a routing question is not something a form should do.
   */
  const route = (to: QuestionnaireId, carry: QValues) => {
    const target = questionnaire(to);
    const asked = new Set(target.fields.map((f) => f.id));
    const flat: Record<string, string> = {};
    const spare: string[] = [];

    for (const field of questionnaire("X").fields) {
      const value = carry[field.id];
      const one = (typeof value === "string" ? value : (value ?? []).join(", ")).trim();
      if (!one) continue;
      if (asked.has(field.id)) flat[field.id] = one;
      else if (field.kind !== "choice") spare.push(`${field.label[lang]}: ${one}`);
    }
    if (spare.length > 0) flat.requirement = spare.join("\n");

    setRouted(flat);
    setCustom(to);
  };

  /** Every question on the branch has been answered, so the end of it is one
   *  click away from wherever the reader is standing. Going back to change an
   *  earlier answer clears this, because a different branch asks different
   *  questions and they have to be answered before there is an end again. */
  const complete = at.kind !== "ask";

  // The escape hatch — the matrix's free-standing ⓧ Custom Request, or the
  // segment's own circled questionnaire once a segment has been chosen. It
  // arrives with whatever the branch already established, so a reader who
  // leaves at question four does not answer question two again. Keyed on both,
  // so reopening after a different answer starts the form fresh rather than
  // carrying stale state.
  if (custom) {
    // `routed` wins over the branch: a reader ⓧ handed on answered its
    // questions more recently than they walked the tree.
    const prefill = routed ?? carried(path);
    return (
      <>
        <section>
          <div className="wrap">
            <button type="button" className="go" onClick={() => { setCustom(null); setRouted(null); }}>
              {atOutcome ? t.customBackResult : t.customBackFlow}<span aria-hidden="true">→</span>
            </button>
          </div>
        </section>
        <QuestionnairePanel
          key={`${custom}-${JSON.stringify(prefill)}`}
          lang={lang}
          qid={custom}
          prefill={prefill}
          onRoute={route}
        />
      </>
    );
  }

  // A branch that ends outside the catalogue: the matrix's `custom` oval under
  // each segment, the Special Chambers track, and the custom quiet zone under
  // a 10.0 m chamber. All three end in a questionnaire rather than in a model,
  // with whatever the branch already established carried in as a pre-selection.
  if (atOutcome && at.kind === "form") {
    return (
      <>
        <section>
          <div className="wrap">
            <StepStrip lang={lang} steps={steps} index={steps.length} onJump={setView} />
            <div className="btns mc-actions">
              <button type="button" className="btn btn-outline" onClick={() => setView(steps.length - 1)}>
                {t.back}
              </button>
              <button type="button" className="go" onClick={restart}>
                {t.restart}<span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </section>
        <QuestionnairePanel
          key={`${at.qid}-${JSON.stringify(carried(path))}`}
          lang={lang}
          qid={at.qid}
          prefill={carried(path)}
        />
      </>
    );
  }

  if (atOutcome) {
    return (
      <>
        <section>
          <div className="wrap">
            {/* The answers, where they have been all along: the progress strip.
                A reader who wants to change one goes back to the question
                itself rather than to a second copy of it further down. */}
            <StepStrip lang={lang} steps={steps} index={steps.length} onJump={setView} />

            <div className="sec-head">
              <span className="kicker">{t.resultKicker}</span>
              <h2 ref={headingRef} tabIndex={-1}>{t.resultH}</h2>
              <p>{results.length === 1 ? t.resultOne : t.resultMany(results.length)}</p>
            </div>

            <div className="mc-results">
              {results.map((r, i) => (
                <ResultCard
                  key={r.entry.name}
                  lang={lang}
                  rank={i}
                  only={results.length === 1}
                  result={r}
                  steps={steps}
                  selected={pick?.entry.name === r.entry.name}
                  onSelect={() => setChosen(r.entry.name)}
                />
              ))}
            </div>

            <div className="btns mc-actions">
              {/* The circled questionnaire under this segment — the reader
                  whose requirement the branch does not carry. */}
              <button type="button" className="go" onClick={openQuestionnaire}>
                {t.customFromResult}<span aria-hidden="true">→</span>
              </button>
              <button type="button" className="go" onClick={restart}>
                {t.restart}<span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </section>

        <QuoteForm
          lang={lang}
          steps={steps}
          pick={pick ?? null}
          alternatives={results.filter((r) => r.entry.name !== pick?.entry.name)}
          form={form}
          setForm={setForm}
          copied={copied}
          setCopied={setCopied}
        />
      </>
    );
  }

  if (!step) return null;
  const question = step.question;

  return (
    <section>
      <div className="wrap">
        <StepStrip lang={lang} steps={steps} index={index} onJump={setView} />

        <div className="sec-head mc-head">
          <span className="kicker">{question.kicker[lang]}</span>
          <h2 id={`mc-q-${question.id}`} ref={headingRef} tabIndex={-1}>
            {question.title[lang]}
          </h2>
          {question.hint && <p>{question.hint[lang]}</p>}
        </div>

        <div className="mc-opts" role="group" aria-labelledby={`mc-q-${question.id}`}>
          {/* Every question in the matrix is a single choice — its branches do
              not overlap — so the mode line says so and never says otherwise. */}
          <p className="mc-mode">{t.single}</p>
          <div className="mc-opt-grid">
            {question.options.map((option) => {
              const on = step.chosen?.id === option.id;
              return (
                <label className={on ? "mc-opt on" : "mc-opt"} key={option.id}>
                  <input
                    type="radio"
                    name={`mc-${question.id}`}
                    checked={on}
                    onChange={() => choose(option.id)}
                  />
                  <span className="mc-opt-body">
                    <b>{option.label[lang]}</b>
                    {option.note && <span>{option.note[lang]}</span>}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="btns mc-actions">
          {index > 0 && (
            <button type="button" className="btn btn-outline" onClick={() => setView(index - 1)}>
              {t.back}
            </button>
          )}
          <button
            type="button"
            className="btn btn-red"
            disabled={!step.chosen}
            onClick={() => setView(complete ? steps.length : index + 1)}
          >
            {complete ? (at.kind === "form" ? t.toQuestionnaire : t.toResult) : t.next}
          </button>
          {!step.chosen && <span className="mc-need">{t.needAnswer}</span>}
        </div>

        {/* The way out, for the steps that do not already offer one.
            The matrix hangs its `custom` oval off the segment box, so the
            second question of every segment carries the exit as an option of
            its own — and so does the quiet zone, whose "Custom" is one. Deeper
            questions have none drawn, and a reader four questions in should
            not have to walk back to find the door, so the link stands in.
            Printing both on the same screen would just be the same door
            twice. */}
        {!question.options.some((o) => o.next.kind === "form") && (
          <p className="mc-note">
            <button type="button" className="go" onClick={openQuestionnaire}>
              {t.customLink}<span aria-hidden="true">→</span>
            </button>
          </p>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Progress strip
 * ------------------------------------------------------------------ */

/**
 * Where the reader is on the branch, what they have chosen, and the way back
 * to any of it.
 *
 * One element does all three because they are one thing: a question already
 * answered is a segment of the bar that is filled, and the answer is written
 * under it. There is no separate summary further down the page — a second copy
 * of the answers would only be a second place to keep in step.
 *
 * The strip only ever holds questions the reader has actually reached, so
 * every entry on it is somewhere they can go back to. The total moves as the
 * branch does: `walk` recomputes it on every answer.
 */
function StepStrip({
  lang,
  steps,
  index,
  onJump,
}: {
  lang: Lang;
  steps: readonly Step[];
  index: number;
  onJump: (i: number) => void;
}) {
  const t = copy[lang];
  const done = index === steps.length;

  return (
    <nav className="mc-progress" aria-label={t.progressLabel}>
      <span className="mc-count">{done ? t.stepAll(steps.length) : t.stepOf(index + 1, steps.length)}</span>

      <ol className="mc-steps">
        {steps.map((s, i) => {
          const value = s.chosen?.label[lang] ?? "";
          const now = !done && i === index;
          const past = value.length > 0 && !now;
          const kicker = s.question.kicker[lang];
          return (
            <li
              className={`mc-step ${now ? "is-now" : past ? "is-done" : "is-todo"}`}
              key={s.question.id}
            >
              <button
                type="button"
                className="mc-step-btn"
                aria-current={now ? "step" : undefined}
                aria-label={`${kicker} — ${value || t.none}. ${t.jumpTo(kicker)}`}
                title={value || undefined}
                onClick={() => onJump(i)}
              >
                {/* The node. A tick once the question is behind the reader, a
                    filled ring where they are, the number until they get
                    there — the connector to either side is drawn by the row. */}
                <span className="mc-step-dot" aria-hidden="true">
                  {past ? (
                    <svg className="mc-step-chk" viewBox="0 0 16 16"><path d="M3 8.5l3.2 3.2L13 5" /></svg>
                  ) : now ? null : (
                    <b>{i + 1}</b>
                  )}
                </span>
                {/* The kicker sits in a span of its own because the pill
                    carries the caret up to the node as a corner of itself,
                    and the ellipsis that trims a long kicker would clip it. */}
                <span className="mc-step-pill"><span>{kicker}</span></span>
                <span className="mc-step-val">{value || t.none}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <p className="mc-step-hint">{t.jumpHint}</p>
    </nav>
  );
}

/* ------------------------------------------------------------------ *
 * Result card
 * ------------------------------------------------------------------ */

function ResultCard({
  lang,
  rank,
  only,
  result,
  steps,
  selected,
  onSelect,
}: {
  lang: Lang;
  rank: number;
  only: boolean;
  result: Recommendation;
  /** The branch that led here, so a chamber put in the basket carries it. */
  steps: readonly Step[];
  selected: boolean;
  onSelect: () => void;
}) {
  const t = copy[lang];
  const { entry } = result;

  // What My Enquiry is handed if this card is added. The figures are labelled here
  // rather than in the basket: the basket holds products from three different
  // parts of the site and cannot know that the second line of a chamber's
  // specification is its test conditions. Everything is captured as text, in
  // the locale the reader chose it in, so the enquiry that comes out the other
  // end reads the way the page they chose from did.
  const seed: CartSeed = {
    id: `chamber:${entry.name}`,
    name: entry.name,
    desc: entry.desc,
    spec: entry.spec
      ? [
          `${t.specSize}: ${entry.spec.size}`,
          entry.spec.note && `${t.specNote}: ${entry.spec.note}`,
          entry.spec.range && `${t.specRange}: ${entry.spec.range}`,
        ].filter((line): line is string => Boolean(line))
      : undefined,
    config: [
      result.variant && `${t.variant}: ${result.variant.name} — ${result.variant.size}`,
      ...steps.map((s) => `${s.question.kicker[lang]}: ${s.chosen?.label[lang] ?? t.none}`),
    ].filter((line): line is string => Boolean(line)),
    from: "My Chamber",
    href: entry.href,
    lang,
  };

  return (
    // The emphasis follows the reader's own pick rather than the first card.
    // Where the matrix names several models at one leaf they are equals, and a
    // permanently highlighted first card would rank what the head office did
    // not; where it names one, that one is the pick from the start.
    <article className={selected ? "mc-card mc-card--top" : "mc-card"}>
      {/* The model's own plate, the same one its page leads with. The alt comes
          with it rather than being written here: a reader who cannot see the
          picture is owed what is in it, and what is in it is authored once, in
          the table both the page and this card read. */}
      <figure className="mc-shot">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={entry.shot.src} alt={entry.shot.alt ?? ""} width={entry.shot.w} height={entry.shot.h} loading="lazy" decoding="async" />
      </figure>

      <div className="mc-card-body">
        {/* One model at the end of a branch is the recommendation. Several are
            the alternatives the matrix draws side by side — numbered, because
            they are equals and calling the second one a runner-up would be
            this page ranking what the head office did not. */}
        <span className="mc-rank">{only ? t.rankTop : t.rankAlt(rank + 1)}</span>
        {/* Model designations are never translated — they are what a reader
            matches against the catalogue, the drawings and the quotation. */}
        <h3>{entry.name}</h3>
        <p className="mc-desc">{entry.desc}</p>

        {/* The exact configuration the branch pinned down. It comes before the
            model's own specification because it is the more specific answer of
            the two — and the two are not in conflict: the row below describes
            the model, this describes the build of it a quotation would be
            written for. */}
        {result.variant && (
          <div className="mc-variant">
            <span className="mc-variant-label">{t.variant}</span>
            <b>{result.variant.name}</b>
            <span>{result.variant.size}</span>
            <span>{result.variant.note}</span>
          </div>
        )}

        {entry.spec && (
          <dl className="mc-spec">
            <div>
              <dt>{t.specSize}</dt>
              <dd>{entry.spec.size}</dd>
            </div>
            {entry.spec.note && (
              <div>
                <dt>{t.specNote}</dt>
                <dd>{entry.spec.note}</dd>
              </div>
            )}
            {entry.spec.range && (
              <div>
                <dt>{t.specRange}</dt>
                <dd>{entry.spec.range}</dd>
              </div>
            )}
          </dl>
        )}

        <div className="mc-why">
          <h4>{t.why}</h4>
          <ul className="check-list">
            <li>
              <svg className="chk" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3.2 3.2L13 5" /></svg>
              {result.why}
            </li>
          </ul>
        </div>

        {result.caveat && (
          <p className="mc-caveat">
            <b>{t.caveat}</b>
            {result.caveat}
          </p>
        )}

        <div className="mc-card-foot">
          <label className={selected ? "mc-choose on" : "mc-choose"}>
            <input type="radio" name="mc-pick" checked={selected} onChange={onSelect} />
            <span>{selected ? t.picked : t.pick}</span>
          </label>
          {/* Beside the radio rather than instead of it, because the two are
              different questions. The radio decides which chamber the enquiry
              at the foot of *this* page is about — one branch, one model, sent
              now. My Enquiry is for the reader who is specifying a laboratory:
              they walk the questions again for the next requirement, and the
              basket in the bar keeps what they found. */}
          <CartAdd lang={lang} item={seed} />
          <SiteLink className="go" href={entry.href}>
            {t.seeType}<span aria-hidden="true">→</span>
          </SiteLink>
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ *
 * Quotation enquiry
 * ------------------------------------------------------------------ */

function QuoteForm({
  lang,
  steps,
  pick,
  alternatives,
  form,
  setForm,
  copied,
  setCopied,
}: {
  lang: Lang;
  steps: readonly Step[];
  pick: Recommendation | null;
  alternatives: readonly Recommendation[];
  form: Form;
  setForm: (f: Form) => void;
  copied: boolean;
  setCopied: (v: boolean) => void;
}) {
  const t = copy[lang];
  const ready = Boolean(form.company.trim() && form.person.trim() && form.email.trim());
  const body = mailBody(lang, steps, pick, alternatives, form);
  const subject = t.mailSubject(pick?.entry.name ?? "—", form.company.trim() || "—");
  // The Korean sales office, with the head office in copy — the same pair the
  // questionnaire writes to, because this is the same enquiry by another route.
  const href =
    `mailto:${enquiryEmail}` +
    `?cc=${encodeURIComponent(enquiryCc)}` +
    `&subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`;

  const set = (key: keyof Form) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [key]: event.target.value });
    setCopied(false);
  };

  return (
    <section>
      <div className="wrap">
        <div className="sec-head">
          <span className="kicker">{t.quoteKicker}</span>
          <h2>{t.quoteH}</h2>
          <p>{t.quoteP}</p>
        </div>

        {/* No action and no method: nothing is posted anywhere. The button
            below is a mailto link, and the fields exist to write it. */}
        <form className="mc-form" onSubmit={(event) => event.preventDefault()}>
          <div className="mc-fields">
            <Field id="mc-company" label={t.fCompany} mark={t.required} value={form.company} onChange={set("company")} autoComplete="organization" />
            <Field id="mc-person" label={t.fPerson} mark={t.required} value={form.person} onChange={set("person")} autoComplete="name" />
            <Field id="mc-email" label={t.fEmail} mark={t.required} value={form.email} onChange={set("email")} type="email" autoComplete="email" />
            <Field id="mc-phone" label={t.fPhone} value={form.phone} onChange={set("phone")} type="tel" autoComplete="tel" />
          </div>

          <div className="mc-field mc-field--wide">
            <label htmlFor="mc-note">{t.fNote}</label>
            <textarea id="mc-note" rows={4} value={form.note} onChange={set("note")} placeholder={t.fNotePlaceholder} />
          </div>

          <div className="btns mc-actions">
            {ready ? (
              <a className="btn btn-red" href={href}>{t.send}</a>
            ) : (
              <button type="button" className="btn btn-red" disabled>{t.send}</button>
            )}
            <button
              type="button"
              className="btn btn-outline"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(body);
                  setCopied(true);
                } catch {
                  // No clipboard permission — the reader can still select the
                  // text, and pretending it worked would be worse.
                  setCopied(false);
                }
              }}
            >
              {copied ? t.copied : t.copyBody}
            </button>
          </div>
          <p className="mc-note">{ready ? t.to(enquiryEmail, enquiryCc) : t.fillFirst}</p>
        </form>
      </div>
    </section>
  );
}

/** `mark`, not `required`: the HTML attribute of that name is a boolean and
 *  belongs to the input, and this is the word printed beside the label. */
function Field({
  id,
  label,
  mark,
  ...input
}: {
  id: string;
  label: string;
  mark?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="mc-field">
      <label htmlFor={id}>
        {label}
        {mark && <em>{mark}</em>}
      </label>
      <input id={id} {...input} />
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * The branch → text
 * ------------------------------------------------------------------ */

/**
 * The enquiry, as plain text.
 *
 * Written for a person to read in an inbox, not parsed by anything: headings
 * in brackets, one fact per line, and the branch in the order it was walked.
 * Kept compact because a `mailto:` body has to survive being a URL — every
 * value here is a label from this site or a line the reader typed.
 */
function mailBody(
  lang: Lang,
  steps: readonly Step[],
  pick: Recommendation | null,
  alternatives: readonly Recommendation[],
  form: Form,
): string {
  const t = copy[lang];
  const lines: string[] = [t.mailTitle, ""];

  if (pick) {
    lines.push(`[${t.mailPick}]`, `${pick.entry.name} — ${pick.entry.desc}`);
    if (pick.variant) {
      lines.push(`${t.variant}: ${pick.variant.name} — ${pick.variant.size} · ${pick.variant.note}`);
    }
    if (pick.entry.spec) {
      lines.push(`${t.specSize}: ${pick.entry.spec.size}`);
      if (pick.entry.spec.note) lines.push(`${t.specNote}: ${pick.entry.spec.note}`);
      if (pick.entry.spec.range) lines.push(`${t.specRange}: ${pick.entry.spec.range}`);
    }
    lines.push("");
  }

  lines.push(`[${t.mailAnswers}]`);
  for (const s of steps) {
    lines.push(`${s.question.kicker[lang]}: ${s.chosen?.label[lang] ?? t.none}`);
  }
  lines.push("");

  if (alternatives.length > 0) {
    lines.push(`[${t.mailAlts}]`, alternatives.map((r) => r.entry.name).join(", "), "");
  }

  lines.push(
    `[${t.mailFrom}]`,
    `${t.fCompany}: ${form.company || t.none}`,
    `${t.fPerson}: ${form.person || t.none}`,
    `${t.fEmail}: ${form.email || t.none}`,
    `${t.mailPhone}: ${form.phone || t.none}`,
  );
  if (form.note.trim()) lines.push(`${t.mailNote}: ${form.note.trim()}`);

  lines.push("", "--", t.mailFoot);
  return lines.join("\r\n");
}
