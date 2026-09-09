import PageShell from "./page-shell";
import { closingLine } from "./page-closing";
import StructuredData from "./structured-data";
import {
  dataProtectionOfficer as dpo,
  entities,
  headOfficeLegal,
  legalMeta,
  legalPath,
  type LegalSection,
} from "./legal-sections";
import type { Lang } from "./site-config";

/* The imprint and the privacy declaration.

   The imprint is the head office's own particulars, carried over unchanged —
   they identify companies, not this website, so they transfer verbatim.

   The privacy declaration does not. The head office's describes cookies, an
   analytics service, a newsletter and a server-side contact form; this site
   has none of those, and saying otherwise would be a false statement about
   data processing rather than a stale sentence. So this page states what this
   site actually does, measured rather than assumed: no cookies, no storage,
   no request to any other host, and a My Chamber enquiry form that composes
   mail in the reader's own client and posts nothing anywhere. The parts that
   belong to the companies rather than to the site — who the controller is,
   who the data protection officer is, what rights a data subject has — follow
   the head office, and the full declaration is linked rather than copied. */

const copy = {
  en: {
    imprint: {
      eyebrow: "IMPRINT",
      title: "Imprint",
      intro: "Information under §5 of the German Telemedia Act (TMG).",
      labels: {
        address: "Address",
        phone: "Phone",
        fax: "Fax",
        email: "Email",
        directors: "Managing Directors",
        vat: "VAT registration no.",
        register: "Registry court",
        weee: "WEEE reg. no.",
      },
      termsHead: "Terms of use",
      terms:
        "The terms governing use of Frankonia's websites — scope, rights of use, intellectual property, liability and export control — are maintained by the head office and apply to this site as published there.",
      termsLink: "Read the terms of use at the head office",
      privacyLink: "Privacy policy for this site",
    },
    privacy: {
      eyebrow: "PRIVACY",
      title: "Privacy Policy",
      intro:
        "What this website does with personal data, and what it does not do. Information under Art. 13 of the General Data Protection Regulation.",
      controllerHead: "1. Controller and data protection officer",
      controllerNote:
        "The data protection officer can be reached at the address above, or by email.",
      visitHead: "2. When you visit this site",
      visit: [
        "This site is a set of static files. No application code runs on the server for it and it keeps no database.",
        "Delivering a page still means your device makes a request, and the hosting provider records that request in a server log: the IP address it came from, the date and time, the file requested, the page you came from, and the browser and operating system your device reports.",
        "That data is processed to deliver the site, to keep it available and stable, and to investigate misuse. The legal basis is Art. 6(1)(f) GDPR — our legitimate interest in operating the site. It is not combined with any other source and is not used to work out who you are.",
      ],
      noneHead: "3. No cookies, no tracking, nothing loaded from elsewhere",
      none: [
        "This site sets no cookies. It writes nothing to local storage, session storage or a local database, and it registers no service worker.",
        "It uses no analytics, no tag manager and no advertising or tracking technology of any kind.",
        "It requests nothing from any other domain. The typefaces are built into the site rather than fetched from Google Fonts, and there are no embedded maps, video players or social widgets. Because no third party is contacted, no third party learns that you were here.",
      ],
      contactHead: "4. Getting in touch",
      contact: [
        "There is no form on this site that sends anything to a server. The email addresses are ordinary mail links, and the enquiry form on the My Chamber page fills in a message in your own mail program: nothing leaves your device through this website.",
        "Your details reach us only when you send that mail yourself. We then use them to answer you and, where your enquiry leads to one, to prepare and perform a contract — Art. 6(1)(b) and (f) GDPR. We keep the correspondence for as long as answering it and the applicable retention rules require.",
      ],
      linksHead: "5. Links to other sites",
      links:
        "This site links to frankonia-solutions.com and to frankonia-cybershield.com. Once you follow such a link the other site takes over, and its own declaration applies to what happens there.",
      rightsHead: "6. Your rights",
      rights: [
        "You have the right to obtain confirmation of whether we process your personal data and to access it, to have inaccurate data corrected, to have data erased or its processing restricted, to receive your data in a portable form, and to object to processing based on legitimate interests.",
        "You may also lodge a complaint with a data protection supervisory authority.",
        "To exercise any of these, write to the data protection officer named above. The complete declaration, covering the head office's own site, its newsletter and business relationships beyond this website, is published by the head office.",
      ],
      rightsLink: "Full data protection declaration at the head office",
      imprintLink: "Imprint",
    },
  },
  zh: {
    imprint: {
      eyebrow: "IMPRINT",
      title: "法律声明",
      intro: "根据德国远程媒体法（TMG）第5条规定的商业信息。",
      labels: {
        address: "地址",
        phone: "电话",
        fax: "传真",
        email: "邮箱",
        directors: "首席执行官",
        vat: "增值税登记号",
        register: "登记法院",
        weee: "WEEE注册号",
      },
      termsHead: "使用条款",
      terms:
        "Frankonia 网站使用条款——适用范围、使用权、知识产权、责任、出口管制——由本公司管理，本公司发布的内容也适用于本网站。",
      termsLink: "查看我们总部的使用条款",
      privacyLink: "本网站的隐私政策",
    },
    privacy: {
      eyebrow: "PRIVACY",
      title: "个人信息处理方针",
      intro:
        "本网站对个人信息做什么和不做什么。此信息符合 GDPR 第 13 条。",
      controllerHead: "1．处理负责人和个人信息保护负责人",
      controllerNote:
        "您可以通过上述地址或电子邮件联系个人信息保护负责人。",
      visitHead: "2．当您访问该网站时",
      visit: [
        "本站是静态文件的集合。为了实现这一点，服务器上没有运行应用程序代码，也没有数据库。",
        "不过，要交付页面，访问者的设备必须发送请求，托管提供商会在服务器日志中记录该请求 - 请求来源的 IP 地址、日期和时间、请求的文件、来自的页面以及设备报告的浏览器和操作系统。",
        "处理这些数据是为了交付网站、维护可用性和稳定性以及调查滥用情况。法律依据是 GDPR 第 6(1)(f) 条——运营网站的合法权益。我们不会将其与任何其他来源结合起来或使用它来确定我们的访客是谁。",
      ],
      noneHead: "3．无cookie、无跟踪、无外部加载",
      none: [
        "本网站不设置cookies。不会向本地存储、会话存储或本地数据库写入任何内容，也不会注册任何 Service Worker。",
        "我们不使用分析工具、标签管理器或任何类型的广告或跟踪技术。",
        "不要向任何其他域发送请求。字体是内置于网站中的，而不是从 Google 字体中获取的，并且没有嵌入式地图、视频播放器或社交小部件。无法访问第三方，因此第三方不会知道您的访问。",
      ],
      contactHead: "4。联系我们",
      contact: [
        "该网站没有向服务器发送内容的表单。电子邮件地址是常规电子邮件链接，“My Chamber”页面上的联系表格填充访问者的电子邮件程序 - 任何内容都不会通过该网站离开设备。",
        "只有当访问者直接发送电子邮件时，您发送的信息才会到达我们。我们用它来给您答复，如果您的询问导致签订合同，我们用它来准备和履行合同——GDPR 第 6(1)(b) 和 (f) 条。传输的文件将根据响应所需的时间以及适用的保留法规的要求保留。",
      ],
      linksHead: "5．外部网站链接",
      links:
        "该网站链接到 Frankonia-solutions.com 和 Frankonia-cybershield.com。当您点击链接时，该网站将从该点开始接管，并且发生的情况受该网站的政策的约束。",
      rightsHead: "6．信息主体的权利",
      rights: [
        "信息主体有权要求确认个人信息是否正在被处理、访问该个人信息、更正不准确的信息、删除或限制处理、以可移植格式提供以及基于合法利益反对处理。",
        "您还有权向个人信息监管机构提出投诉。",
        "为行使您的权利，请向上述个人信息保护负责人提出书面请求。我们的整个政策，包括我们的网站、新闻通讯以及本网站之外的业务关系，均由我们发布。",
      ],
      rightsLink: "公司整体个人信息保护声明",
      imprintLink: "法律声明",
    },
  },
} as const;

function SectionHead({ title }: { title: string }) {
  return (
    <div className="sec-head">
      <h2>{title}</h2>
    </div>
  );
}

function Prose({ paras }: { paras: readonly string[] }) {
  return (
    <div className="prose">
      {paras.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </div>
  );
}

/** Label and value on a hairline row — the imprint is a list of named fields
 *  and nothing more, so it is rendered as one rather than as prose. */
function Fields({ rows }: { rows: readonly (readonly [string, React.ReactNode])[] }) {
  return (
    <div className="hairline-list">
      {rows.map(([label, value], i) => (
        <div className="hl-row" key={`${label}-${i}`}>
          <b>{label}</b>
          <span className="hl-desc">{value}</span>
        </div>
      ))}
    </div>
  );
}

function ImprintBody({ lang }: { lang: Lang }) {
  const t = copy[lang].imprint;

  return (
    <>
      {entities.map((e) => (
        <section key={e.name}>
          <div className="wrap">
            <SectionHead title={e.name} />
            <Fields
              rows={[
                [t.labels.address, `${e.street}, ${e.city}, ${e.country}`],
                [t.labels.phone, <a key="p" href={`tel:${e.phone.replace(/[^+\d]/g, "")}`}>{e.phone}</a>],
                [t.labels.fax, e.fax],
                // A working address rather than the head office's `info[at]…`
                // spelling: §5 TMG asks for one that allows immediate contact,
                // and a reader should be able to click it.
                [t.labels.email, <a key="e" href={`mailto:${e.email}`}>{e.email}</a>],
                [t.labels.directors, e.directors],
                [t.labels.vat, e.vat],
                [t.labels.register, e.register],
                ...(e.weee ? [[t.labels.weee, e.weee] as const] : []),
              ]}
            />
          </div>
        </section>
      ))}

      <section className="alt">
        <div className="wrap">
          <SectionHead title={t.termsHead} />
          <Prose paras={[t.terms]} />
          <a className="go sec-go" href={headOfficeLegal.imprint} target="_blank" rel="noopener">
            {t.termsLink}<span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
    </>
  );
}

function PrivacyBody({ lang }: { lang: Lang }) {
  const t = copy[lang].privacy;

  return (
    <>
      <section>
        <div className="wrap">
          <SectionHead title={t.controllerHead} />
          <Fields
            rows={[
              ...entities.map((e) => [e.name, `${e.street}, ${e.city}, ${e.country}`] as const),
              [
                dpo.name,
                <a key="dpo" href={`mailto:${dpo.email}`}>{dpo.email}</a>,
              ],
            ]}
          />
          <Prose paras={[t.controllerNote]} />
        </div>
      </section>

      <section className="alt">
        <div className="wrap">
          <SectionHead title={t.visitHead} />
          <Prose paras={t.visit} />
        </div>
      </section>

      <section>
        <div className="wrap">
          <SectionHead title={t.noneHead} />
          <Prose paras={t.none} />
        </div>
      </section>

      <section className="alt">
        <div className="wrap">
          <SectionHead title={t.contactHead} />
          <Prose paras={t.contact} />
        </div>
      </section>

      <section>
        <div className="wrap">
          <SectionHead title={t.linksHead} />
          <Prose paras={[t.links]} />
        </div>
      </section>

      <section className="alt">
        <div className="wrap">
          <SectionHead title={t.rightsHead} />
          <Prose paras={t.rights} />
          <a className="go sec-go" href={headOfficeLegal.privacy} target="_blank" rel="noopener">
            {t.rightsLink}<span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
    </>
  );
}

export default function LegalPage({ lang, section }: { lang: Lang; section: LegalSection }) {
  const { label, description } = legalMeta[lang][section];
  const t = copy[lang][section];

  return (
    <PageShell lang={lang} eyebrow={t.eyebrow} title={t.title} intro={t.intro} closing={closingLine(lang, legalPath(section))}>
      <StructuredData
        lang={lang}
        page="path"
        path={legalPath(section)}
        trail={[{ name: label, path: legalPath(section) }]}
        description={description}
      />
      {section === "imprint" ? <ImprintBody lang={lang} /> : <PrivacyBody lang={lang} />}
    </PageShell>
  );
}
