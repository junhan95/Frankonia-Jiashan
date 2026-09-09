"use client";

import { useState } from "react";
import { clearCart, removeItem, useCart, type CartItem } from "./cart-store";
import { contactEmail, siteOrigin, type Lang } from "./site-config";
import SiteLink from "./site-link";

/**
 * The My Enquiry page — the basket, what to keep in the enquiry, and the one
 * message that asks about all of it.
 *
 * Two things are deliberately separate here, and keeping them apart is most of
 * the design. What is *in the cart* is a list a reader builds over a visit and
 * takes away with them. What is *in the enquiry* is a tick against each line,
 * and it starts ticked. So a reader who came here to send everything sends
 * everything and never meets the checkboxes; a reader who has shortlisted six
 * chambers and wants a quotation on two unticks four rather than deleting them
 * and losing them.
 *
 * Nothing is submitted anywhere. Like the MyChamber enquiry and the segment
 * questionnaires, the message is assembled into a `mailto:` — the reader's own
 * mail client opens with it written, and they read it before it is sent. That
 * is stated on the page rather than left as an implementation detail, because
 * a basket is exactly the kind of thing a reader is entitled to assume was
 * sent somewhere.
 *
 * The whole page is client-rendered on purpose and is the only page on the
 * site that is: its content is in the reader's browser and nowhere else, so
 * there is nothing for the export to pre-render but the empty state — which is
 * what the exported HTML correctly contains, and what a crawler should see.
 */

type Form = { company: string; person: string; email: string; phone: string; note: string };

const emptyForm: Form = { company: "", person: "", email: "", phone: "", note: "" };

/**
 * A `mailto:` is a URL, and mail clients stop reading one somewhere around
 * 2,000 characters — Outlook first, at 2,083. Six chambers with their figures
 * and a paragraph of notes can pass that, and the failure is silent: the
 * message opens with the end of the enquiry missing. So the page watches its
 * own length and says so, and the copy button beside the send button is the
 * way out rather than an afterthought.
 */
const MAIL_LIMIT = 1900;

const copy = {
  zh: {
    listKicker: "My Enquiry",
    listH: "您的询价产品",
    listP:
      "包含的列表仅保存在该浏览器中。在您填写下面的电子邮件之前，它不会发送到服务器，也不会发送到任何地方。",
    count: (n: number) => `${n} 项产品`,
    picked: (n: number, all: number) => `已选择 ${n} 项，共 ${all} 项`,
    selectAll: "全选",
    selectNone: "取消全选",
    clear: "清空清单",
    clearAsk: "确定清空询价清单吗？",
    clearYes: "确认清空",
    clearNo: "取消",
    include: "加入本次询价",
    remove: (name: string) => `从询价清单移除 ${name}`,
    from: "添加来源",
    config: "配置",
    seePage: "产品页面",
    addedZh: "以中文添加",
    addedEn: "以英文添加",

    emptyH: "我的询盘为空",
    emptyP:
      "您可以从“Chamber and Test Systems”页面上的型号列表中执行此操作，也可以在按照“My Chamber”问题进行到底后从结果卡中执行此操作。该产品将保留在此浏览器中以供您下次访问。",
    emptyMyChamber: "使用 My Chamber 选择暗室",
    emptyChambers: "查看所有暗室",
    emptySystems: "查看全部测试系统",

    quoteKicker: "获取报价",
    quoteH: "发送所选产品的询价",
    quoteP:
      "如果您填写以下信息，您在上面选择的产品将包含在电子邮件正文中。您的邮件程序将打开，您可以在发送前检查内容。",
    fCompany: "公司名称",
    fPerson: "负责人",
    fEmail: "邮箱",
    fPhone: "电话（可选）",
    fNote: "附加请求（可选）",
    fNotePlaceholder: "请写下您想了解的任何信息，例如预计安装时间、建筑条件、预算范围。",
    required: "必填",
    send: "写邮件",
    fillFirst: "输入公司名称、负责人、邮箱，打开邮件创建流程。",
    needPick: "请选择要包含在报价中的一种或多种产品。",
    copyBody: "复制文字",
    copied: "已复制",
    to: (address: string) => `收件人：${address}`,
    tooLong:
      "文本正文较长，因此在某些电子邮件程序中可能会截断最后一部分。请减少产品数量或将文本复制并粘贴到新电子邮件中。",

    mailSubject: (n: number, company: string) => `[My Enquiry] ${n} 项产品询价 — ${company}`,
    mailTitle: "Frankonia 我的询价 请求报价",
    mailItems: (n: number) => `询价产品：${n} 项`,
    mailFrom: "询问者",
    mailPhone: "电话",
    mailNote: "额外要求",
    mailFoot: "此电子邮件是根据您在 Frankonia 我的询价中选择的产品自动创建的。",
    none: "—",
  },
  en: {
    listKicker: "My Enquiry",
    listH: "What you have put aside",
    listP:
      "The list is held in this browser. It is not sent to a server, and nothing leaves this page until you write the message below.",
    count: (n: number) => `${n} item${n === 1 ? "" : "s"}`,
    picked: (n: number, all: number) => `${n} of ${all} in the enquiry`,
    selectAll: "Select all",
    selectNone: "Clear the selection",
    clear: "Empty the enquiry",
    clearAsk: "Empty it?",
    clearYes: "Empty it",
    clearNo: "Keep it",
    include: "In the enquiry",
    remove: (name: string) => `Remove ${name} from My Enquiry`,
    from: "Added from",
    config: "Configuration",
    seePage: "Product page",
    addedZh: "Added in Chinese",
    addedEn: "Added in English",

    emptyH: "My Enquiry is empty",
    emptyP:
      "Add a model from any list on the chamber and test-system pages, or walk the My Chamber questions to the end and add the result. What you add stays in this browser and will still be here on your next visit.",
    emptyMyChamber: "Find your chamber with My Chamber",
    emptyChambers: "See every chamber",
    emptySystems: "See every test system",

    quoteKicker: "Enquiry",
    quoteH: "Send the selected items as one message",
    quoteP:
      "Fill this in and the items you ticked above go into the body of the message. Your mail client opens with it written; you read it before it is sent.",
    fCompany: "Company",
    fPerson: "Contact name",
    fEmail: "Email",
    fPhone: "Phone (optional)",
    fNote: "Anything else (optional)",
    fNotePlaceholder: "Timing, building constraints, budget range — whatever helps us answer properly.",
    required: "required",
    send: "Write the email",
    fillFirst: "Company, contact name and email open the message.",
    needPick: "Tick at least one item to put in the enquiry.",
    copyBody: "Copy the text",
    copied: "Copied",
    to: (address: string) => `To ${address}`,
    tooLong:
      "The message is long enough that some mail clients will cut the end off it. Take an item or two out, or copy the text and paste it into a new message.",

    mailSubject: (n: number, company: string) =>
      `[My Enquiry] Quotation request for ${n} item${n === 1 ? "" : "s"} — ${company}`,
    mailTitle: "Frankonia My Enquiry — quotation request",
    mailItems: (n: number) => `${n} item${n === 1 ? "" : "s"} enquired about`,
    mailFrom: "Enquirer",
    mailPhone: "Phone",
    mailNote: "Notes",
    mailFoot: "Written automatically by Frankonia My Enquiry from the items selected there.",
    none: "—",
  },
} as const;

/** The three ways back into the catalogue, offered by the empty state. They
 *  arrive as props rather than being built here: their route tables are the
 *  two largest modules on the site, and importing either into a client
 *  component would put both locales of every chamber and instrument caption
 *  into the browser bundle for the sake of two hrefs. See the same note in
 *  mychamber-catalogue.ts. */
export type CartLinks = { mychamber: string; chambers: string; systems: string };

export default function CartView({ lang, links }: { lang: Lang; links: CartLinks }) {
  const t = copy[lang];
  const items = useCart();

  /** The lines the reader has taken *out of the enquiry*, by id — not out of
   *  the cart. Stored as the exception rather than the rule so an item added
   *  in another tab arrives ticked, which is what adding it meant. */
  const [out, setOut] = useState<readonly string[]>([]);
  const [form, setForm] = useState<Form>(emptyForm);
  const [copied, setCopied] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const picked = items.filter((item) => !out.includes(item.id));
  const ready =
    picked.length > 0 &&
    Boolean(form.company.trim() && form.person.trim() && form.email.trim());

  const body = mailBody(lang, picked, form);
  const subject = t.mailSubject(picked.length, form.company.trim() || t.none);
  const href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const toggle = (id: string) =>
    setOut((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const set = (key: keyof Form) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [key]: event.target.value });
    setCopied(false);
  };

  if (items.length === 0) {
    return (
      <section>
        <div className="wrap">
          <div className="empty cart-empty">
            <h4>{t.emptyH}</h4>
            <p>{t.emptyP}</p>
            <div className="btns cart-empty-btns">
              <SiteLink className="btn btn-red" href={links.mychamber}>
                {t.emptyMyChamber}<span aria-hidden="true">→</span>
              </SiteLink>
              <SiteLink className="btn btn-outline" href={links.chambers}>
                {t.emptyChambers}<span aria-hidden="true">→</span>
              </SiteLink>
              <SiteLink className="btn btn-outline" href={links.systems}>
                {t.emptySystems}<span aria-hidden="true">→</span>
              </SiteLink>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section>
        <div className="wrap">
          <div className="sec-head">
            <span className="kicker">{t.listKicker}</span>
            <h2>{t.listH}</h2>
            <p>{t.listP}</p>
          </div>

          <div className="cart-bar">
            <span className="cart-bar-count">{t.count(items.length)}</span>
            <span className="cart-bar-picked">{t.picked(picked.length, items.length)}</span>
            <div className="cart-bar-acts">
              <button
                type="button"
                className="hl-action"
                onClick={() => setOut(out.length > 0 ? [] : items.map((i) => i.id))}
              >
                {out.length > 0 ? t.selectAll : t.selectNone}
              </button>
              {/* Emptying the cart is the one control here that destroys
                  something the reader spent the visit building, and there is no
                  undo for it. Two steps, in place: the second click is on a
                  button that says what it will do rather than on the same word
                  again. */}
              {confirmClear ? (
                <span className="cart-confirm">
                  {t.clearAsk}
                  <button type="button" className="hl-action" onClick={() => { clearCart(); setOut([]); setConfirmClear(false); }}>
                    {t.clearYes}
                  </button>
                  <button type="button" className="hl-action cart-confirm-no" onClick={() => setConfirmClear(false)}>
                    {t.clearNo}
                  </button>
                </span>
              ) : (
                <button type="button" className="hl-action" onClick={() => setConfirmClear(true)}>
                  {t.clear}
                </button>
              )}
            </div>
          </div>

          <ul className="cart-list">
            {items.map((item) => {
              const on = !out.includes(item.id);
              return (
                <li className={on ? "cart-item on" : "cart-item"} key={item.id}>
                  <label className="cart-tick">
                    <input type="checkbox" checked={on} onChange={() => toggle(item.id)} />
                    <span>{t.include}</span>
                  </label>

                  <div className="cart-item-body">
                    <h3>{item.name}</h3>
                    {item.desc && <p className="cart-item-desc">{item.desc}</p>}

                    {item.spec && item.spec.length > 0 && (
                      <ul className="cart-item-spec">
                        {item.spec.map((line) => <li key={line}>{line}</li>)}
                      </ul>
                    )}

                    {item.config && item.config.length > 0 && (
                      <div className="cart-item-config">
                        <span className="cart-item-label">{t.config}</span>
                        <ul>
                          {item.config.map((line) => <li key={line}>{line}</li>)}
                        </ul>
                      </div>
                    )}

                    <p className="cart-item-meta">
                      {item.from && <span>{t.from}: {item.from}</span>}
                      {/* The basket can hold items added on both locales — a
                          reader who switched language mid-visit. The descriptor
                          and the figures above are then in the other language,
                          and saying so is cheaper than pretending otherwise or
                          re-translating copy this page does not have. */}
                      {item.lang !== lang && <span>{item.lang === "zh" ? t.addedZh : t.addedEn}</span>}
                    </p>
                  </div>

                  <div className="cart-item-acts">
                    {item.href && (
                      <SiteLink className="go" href={item.href}>
                        {t.seePage}<span aria-hidden="true">→</span>
                      </SiteLink>
                    )}
                    <button
                      type="button"
                      className="cart-x"
                      aria-label={t.remove(item.name)}
                      onClick={() => removeItem(item.id)}
                    >
                      <svg viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M4 4l8 8M12 4l-8 8" />
                      </svg>
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="alt">
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
              <div className="mc-field">
                <label htmlFor="cart-company">{t.fCompany}<em>{t.required}</em></label>
                <input id="cart-company" value={form.company} onChange={set("company")} autoComplete="organization" />
              </div>
              <div className="mc-field">
                <label htmlFor="cart-person">{t.fPerson}<em>{t.required}</em></label>
                <input id="cart-person" value={form.person} onChange={set("person")} autoComplete="name" />
              </div>
              <div className="mc-field">
                <label htmlFor="cart-email">{t.fEmail}<em>{t.required}</em></label>
                <input id="cart-email" type="email" value={form.email} onChange={set("email")} autoComplete="email" />
              </div>
              <div className="mc-field">
                <label htmlFor="cart-phone">{t.fPhone}</label>
                <input id="cart-phone" type="tel" value={form.phone} onChange={set("phone")} autoComplete="tel" />
              </div>
            </div>

            <div className="mc-field mc-field--wide">
              <label htmlFor="cart-note">{t.fNote}</label>
              <textarea id="cart-note" rows={4} value={form.note} onChange={set("note")} placeholder={t.fNotePlaceholder} />
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
            <p className="mc-note">
              {picked.length === 0 ? t.needPick : ready ? t.to(contactEmail) : t.fillFirst}
            </p>
            {href.length > MAIL_LIMIT && <p className="cart-warn">{t.tooLong}</p>}
          </form>
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ *
 * The basket → text
 * ------------------------------------------------------------------ */

/**
 * The enquiry, as plain text.
 *
 * Same grammar as the MyChamber enquiry it sits beside: headings in brackets,
 * one fact per line, written for a person to read in an inbox rather than
 * parsed by anything. Each item is numbered, because a reply that says "the
 * second one" has to have something to count.
 *
 * The product page goes in as an absolute URL. The engineer answering this has
 * the catalogue, but the link is what makes a designation unambiguous when a
 * reader has added a model whose name reads like three others.
 */
function mailBody(lang: Lang, items: readonly CartItem[], form: Form): string {
  const t = copy[lang];
  const lines: string[] = [t.mailTitle, ""];

  lines.push(`[${t.mailItems(items.length)}]`);
  items.forEach((item, i) => {
    lines.push(`${i + 1}. ${item.name}${item.desc ? ` — ${item.desc}` : ""}`);
    for (const line of item.spec ?? []) lines.push(`   ${line}`);
    for (const line of item.config ?? []) lines.push(`   ${t.config}: ${line}`);
    if (item.from) lines.push(`   ${t.from}: ${item.from}`);
    if (item.href) lines.push(`   ${siteOrigin}${item.href}`);
  });
  lines.push("");

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
