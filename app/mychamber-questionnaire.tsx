"use client";

import { useEffect, useRef, useState } from "react";
import {
  questionnaire,
  questionnaireForField,
  questionSteps,
  visibleFields,
  type QField,
  type QuestionnaireId,
  type QValues,
} from "./mychamber-questionnaires";
import { enquiryCc, enquiryEmail, type Lang } from "./site-config";

/**
 * One questionnaire of the Chamber Matrix extension, asked one question at a
 * time.
 *
 * The head office's brief of 24 August 2026 is two sentences long and both of
 * them are load-bearing: *All questions shall be answered, step by step*, and
 * the answers go *as a summary to the sales agent as Email*. So this is a
 * stepper rather than a page of fields — Ⓑ asks thirteen questions and a
 * thirteen-field scroll is a form people abandon — and the message it writes
 * is addressed to the Korean sales office with the head office in copy.
 *
 * The same contract as the wizard's enquiry otherwise: nothing is posted
 * anywhere. The answers are assembled into a `mailto:` and the reader's own
 * mail client opens with the body written — they read it before they send it.
 *
 * One head office question is one screen; `questionSteps` decides which fields
 * share one. The definitions live in mychamber-questionnaires.ts and this
 * component renders whichever one it is handed. `prefill` carries answers in —
 * from the wizard's branch, or from ⓧ when its first question hands the reader
 * on — as pre-selections, still editable here. The caller keys the component
 * on the questionnaire and the prefill, so a changed prefill arrives as a
 * fresh mount rather than as stale state.
 */

type Values = QValues;
type Contact = { company: string; person: string; email: string; phone: string };

const emptyContact: Contact = { company: "", person: "", email: "", phone: "" };

const copy = {
  zh: {
    stepOf: (i: number, n: number) => `问题 ${i} / ${n}`,
    contactStep: (n: number) => `已完成 ${n} 个问题，还剩最后一步`,
    progressLabel: "调查进展情况",
    multi: "可多选",
    single: "仅选择一项",
    required: "必填",
    back: "上一步",
    next: "下一步",
    toContact: "输入联系方式",
    needAnswer: "请回答标记的问题。",
    routeTo: (id: QuestionnaireId) => `前往问卷 ${id}`,
    routeNote: "您到目前为止所写的内容将按原样复制。",

    contactKicker: "联系方式",
    contactH: "您的联系方式",
    contactP: "到目前为止您所回答的信息总结如下，并成为电子邮件的正文。该页面不存储或传输任何信息。",
    reviewH: "发送内容",
    fCompany: "公司名称",
    fPerson: "负责人",
    fEmail: "邮箱",
    fPhone: "电话（可选）",
    send: "写邮件",
    fillFirst: "输入公司名称、负责人、邮箱，打开邮件创建流程。",
    copyBody: "复制文字",
    copied: "已复制",
    to: (address: string, cc: string) => `收件人：${address} · 抄送：${cc}`,
    mailSubject: (id: QuestionnaireId, company: string) => `[My Chamber] 问卷 ${id} — ${company}`,
    mailAnswers: "调查内容",
    mailFrom: "询问者",
    mailPhone: "电话",
    none: "—",
    mailFoot: "这封电子邮件是根据 Frankonia My Chamber 调查自动创建的。",
  },
  en: {
    stepOf: (i: number, n: number) => `Question ${i} of ${n}`,
    contactStep: (n: number) => `All ${n} questions answered — one step left`,
    progressLabel: "Progress through the questionnaire",
    multi: "Select all that apply",
    single: "Select one",
    required: "required",
    back: "Back",
    next: "Next",
    toContact: "Your contact details",
    needAnswer: "Answer the questions marked required.",
    routeTo: (id: QuestionnaireId) => `Go to questionnaire ${id}`,
    routeNote: "Everything you have answered so far comes with you.",

    contactKicker: "Contact",
    contactH: "Where the reply should go",
    contactP: "What you have answered is summarised below and becomes the body of the message. This page stores and transmits nothing.",
    reviewH: "What you are sending",
    fCompany: "Company",
    fPerson: "Contact name",
    fEmail: "Email",
    fPhone: "Phone (optional)",
    send: "Write the email",
    fillFirst: "Company, contact name and email open the message.",
    copyBody: "Copy the text",
    copied: "Copied",
    to: (address: string, cc: string) => `To ${address} — copy to ${cc}`,
    mailSubject: (id: QuestionnaireId, company: string) => `[My Chamber] Questionnaire ${id} — ${company}`,
    mailAnswers: "Questionnaire answers",
    mailFrom: "Enquirer",
    mailPhone: "Phone",
    none: "—",
    mailFoot: "Written automatically by the Frankonia My Chamber questionnaire.",
  },
} as const;

const selected = (values: Values, field: QField): readonly string[] => {
  const v = values[field.id];
  if (v === undefined) return [];
  return typeof v === "string" ? (v.trim() ? [v] : []) : v;
};

/** A field's answer as text for the message — option labels for choices, the
 *  reader's own words for the rest. */
const summarise = (values: Values, field: QField, lang: Lang): string => {
  const ids = selected(values, field);
  if (field.kind !== "choice") return ids.join(" ");
  return ids
    .map((id) => field.options.find((o) => o.id === id)?.label[lang] ?? id)
    .join(" · ");
};

export default function QuestionnairePanel({
  lang,
  qid,
  prefill,
  onRoute,
}: {
  lang: Lang;
  qid: QuestionnaireId;
  prefill?: Readonly<Record<string, string>>;
  /** ⓧ's first question, when the reader turns out to know their industry
   *  after all: the caller swaps the questionnaire and carries the answers. */
  onRoute?: (to: QuestionnaireId, carry: Values) => void;
}) {
  const t = copy[lang];
  const q = questionnaire(qid);

  const [values, setValues] = useState<Values>(prefill ?? {});
  const [contact, setContact] = useState<Contact>(emptyContact);
  const [view, setView] = useState(0);
  const [copied, setCopied] = useState(false);

  const set = (id: string, value: string | readonly string[]) => {
    setValues((prev) => ({ ...prev, [id]: value }));
    setCopied(false);
  };

  // Recomputed on every answer: a field can appear and disappear as the reader
  // changes an earlier one, and a step can appear and disappear with it.
  const steps = questionSteps(q, values);
  // The contact details are the step after the last question, so the cursor
  // runs one past the questions and stops there.
  const index = Math.min(view, steps.length);
  const onContact = index === steps.length;
  const step = onContact ? undefined : steps[index];

  const headingRef = useRef<HTMLHeadingElement>(null);
  const mounted = useRef(false);
  useEffect(() => {
    // Moving between steps replaces the panel, so a keyboard or screen reader
    // user would otherwise be left with no announcement that anything changed.
    // Not on first render — that would scroll the page away from the heading
    // the reader arrived at.
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    headingRef.current?.focus();
  }, [index]);

  const answered = (field: QField) => selected(values, field).length > 0;
  const stepReady = (step ?? []).every((f) => f.optional || answered(f));

  // ⓧ question 1, once it has both halves: the head office draws a line from
  // "YES, and it is automotive" straight to questionnaire Ⓐ.
  const routeTo =
    onRoute && step?.some((f) => f.id === "field") && values.known === "yes"
      ? questionnaireForField(values.field as string | undefined)
      : null;

  const ready = Boolean(contact.company.trim() && contact.person.trim() && contact.email.trim());
  const body = mailBody(lang, qid, values, contact);
  const subject = t.mailSubject(qid, contact.company.trim() || t.none);
  const href =
    `mailto:${enquiryEmail}` +
    `?cc=${encodeURIComponent(enquiryCc)}` +
    `&subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`;

  const setC = (key: keyof Contact) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setContact({ ...contact, [key]: event.target.value });
    setCopied(false);
  };

  return (
    <section>
      <div className="wrap">
        <div className="sec-head">
          <span className="kicker">{q.name[lang]}</span>
          <h2 ref={headingRef} tabIndex={-1}>{onContact ? t.contactH : q.title[lang]}</h2>
          <p>{onContact ? t.contactP : q.intro[lang]}</p>
        </div>

        <Progress
          lang={lang}
          index={index}
          total={steps.length}
          onContact={onContact}
          onJump={setView}
        />

        {/* No action and no method, like the wizard's enquiry: the fields exist
            to write the mailto at the end. */}
        <form className="mc-form" onSubmit={(event) => event.preventDefault()}>
          {step
            ? step.map((field) => (
                <Field key={field.id} lang={lang} field={field} values={values} set={set} />
              ))
            : (
              <>
                <div className="mc-fields">
                  <div className="mc-field">
                    <label htmlFor="mcq-company">{t.fCompany}<em>{t.required}</em></label>
                    <input id="mcq-company" value={contact.company} onChange={setC("company")} autoComplete="organization" />
                  </div>
                  <div className="mc-field">
                    <label htmlFor="mcq-person">{t.fPerson}<em>{t.required}</em></label>
                    <input id="mcq-person" value={contact.person} onChange={setC("person")} autoComplete="name" />
                  </div>
                  <div className="mc-field">
                    <label htmlFor="mcq-email">{t.fEmail}<em>{t.required}</em></label>
                    <input id="mcq-email" type="email" value={contact.email} onChange={setC("email")} autoComplete="email" />
                  </div>
                  <div className="mc-field">
                    <label htmlFor="mcq-phone">{t.fPhone}</label>
                    <input id="mcq-phone" type="tel" value={contact.phone} onChange={setC("phone")} autoComplete="tel" />
                  </div>
                </div>

                {/* The answers, before the message is written rather than after
                    it is sent. Each line goes back to its own question — the
                    strip above only counts, and a reader who spots a wrong
                    answer here should not have to count backwards to it. */}
                <h3 className="mcq-review-h">{t.reviewH}</h3>
                <ol className="mcq-review">
                  {steps.map((fields, i) =>
                    fields.map((field) => (
                      <li key={field.id}>
                        <button type="button" className="mcq-review-btn" onClick={() => setView(i)}>
                          <span>{field.kicker?.[lang] ?? field.label[lang]}</span>
                          <b>{summarise(values, field, lang) || t.none}</b>
                        </button>
                      </li>
                    )),
                  )}
                </ol>
              </>
            )}
        </form>

        <div className="btns mc-actions">
          {index > 0 && (
            <button type="button" className="btn btn-outline" onClick={() => setView(index - 1)}>
              {t.back}
            </button>
          )}

          {onContact ? (
            <>
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
            </>
          ) : routeTo ? (
            <button type="button" className="btn btn-red" onClick={() => onRoute?.(routeTo, values)}>
              {t.routeTo(routeTo)}
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-red"
              disabled={!stepReady}
              onClick={() => setView(index + 1)}
            >
              {index === steps.length - 1 ? t.toContact : t.next}
            </button>
          )}

          {!onContact && !routeTo && !stepReady && <span className="mc-need">{t.needAnswer}</span>}
        </div>

        <p className="mc-note">
          {routeTo ? t.routeNote : onContact ? (ready ? t.to(enquiryEmail, enquiryCc) : t.fillFirst) : null}
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * One field
 * ------------------------------------------------------------------ */

function Field({
  lang,
  field,
  values,
  set,
}: {
  lang: Lang;
  field: QField;
  values: Values;
  set: (id: string, value: string | readonly string[]) => void;
}) {
  const t = copy[lang];

  if (field.kind === "choice") {
    const picked = selected(values, field);
    return (
      <div className="mc-opts mc-q-field" role="group" aria-labelledby={`mcq-${field.id}`}>
        {/* Like the wizard's contact fields, only the required mark is
            printed — an unmarked field is optional. */}
        <p className="mc-q-label" id={`mcq-${field.id}`}>
          {field.label[lang]}
          {!field.optional && <em>{t.required}</em>}
        </p>
        <p className="mc-mode">{field.multi ? t.multi : t.single}</p>
        <div className="mc-opt-grid">
          {field.options.map((option) => {
            const on = picked.includes(option.id);
            return (
              <label className={on ? "mc-opt on" : "mc-opt"} key={option.id}>
                <input
                  type={field.multi ? "checkbox" : "radio"}
                  name={`mcq-${field.id}`}
                  checked={on}
                  onChange={() =>
                    set(
                      field.id,
                      field.multi
                        ? on
                          ? picked.filter((x) => x !== option.id)
                          : [...picked, option.id]
                        : option.id,
                    )
                  }
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
    );
  }

  return (
    <div className="mc-field mc-field--wide mc-q-field">
      <label htmlFor={`mcq-${field.id}`}>
        {field.label[lang]}
        {!field.optional && <em>{t.required}</em>}
      </label>
      {field.kind === "textarea" ? (
        <textarea
          id={`mcq-${field.id}`}
          rows={4}
          value={(values[field.id] as string) ?? ""}
          onChange={(e) => set(field.id, e.target.value)}
          placeholder={field.placeholder?.[lang]}
        />
      ) : (
        <input
          id={`mcq-${field.id}`}
          value={(values[field.id] as string) ?? ""}
          onChange={(e) => set(field.id, e.target.value)}
          placeholder={field.placeholder?.[lang]}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Progress
 * ------------------------------------------------------------------ */

/**
 * How far through the questions the reader is.
 *
 * A bar and a count rather than the wizard's strip of labelled nodes: the
 * wizard asks at most five questions and can name every one of them on a row,
 * and Ⓑ asks thirteen. The answers themselves are reviewed on the last step,
 * where there is room to print them and a way back to each.
 *
 * The filled part is clickable back to any question already passed. Forward is
 * not, because a question further on may not exist until this one is answered.
 */
function Progress({
  lang,
  index,
  total,
  onContact,
  onJump,
}: {
  lang: Lang;
  index: number;
  total: number;
  onContact: boolean;
  onJump: (i: number) => void;
}) {
  const t = copy[lang];
  return (
    <nav className="mcq-progress" aria-label={t.progressLabel}>
      <span className="mc-count">{onContact ? t.contactStep(total) : t.stepOf(index + 1, total)}</span>
      <ol className="mcq-bar">
        {Array.from({ length: total }, (_, i) => {
          const state = i < index ? "is-done" : i === index ? "is-now" : "is-todo";
          return (
            <li className={`mcq-tick ${state}`} key={i}>
              <button
                type="button"
                disabled={i >= index}
                aria-current={i === index ? "step" : undefined}
                aria-label={t.stepOf(i + 1, total)}
                onClick={() => onJump(i)}
              />
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* ------------------------------------------------------------------ *
 * The message
 * ------------------------------------------------------------------ */

/** The enquiry as plain text — same grammar as the wizard's: headings in
 *  brackets, one fact per line, compact enough to survive being a URL. */
function mailBody(lang: Lang, qid: QuestionnaireId, values: Values, contact: Contact): string {
  const t = copy[lang];
  const q = questionnaire(qid);
  const lines: string[] = [q.name[lang], ""];

  lines.push(`[${t.mailAnswers}]`);
  for (const field of visibleFields(q, values)) {
    lines.push(`${field.label[lang]}: ${summarise(values, field, lang) || t.none}`);
  }
  lines.push("");

  lines.push(
    `[${t.mailFrom}]`,
    `${t.fCompany}: ${contact.company || t.none}`,
    `${t.fPerson}: ${contact.person || t.none}`,
    `${t.fEmail}: ${contact.email || t.none}`,
    `${t.mailPhone}: ${contact.phone || t.none}`,
  );

  lines.push("", "--", t.mailFoot);
  return lines.join("\r\n");
}
