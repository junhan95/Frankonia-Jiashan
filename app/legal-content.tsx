import PageShell from "./page-shell";
import { closingLine } from "./page-closing";
import StructuredData from "./structured-data";
import { legalMeta, legalPath, type LegalSection } from "./legal-sections";
import { contactEmail, enquiryCc, type Lang } from "./site-config";

type Section = { title: string; paragraphs?: readonly string[]; fields?: readonly (readonly [string, string])[] };
const company = "Jiashan Frankonia EMC Co., Ltd.";
const address = "No.55, Hongqiao Rd, Zone 4, Jiashan, Zhejiang 314100, China";
const sources = [
  ["中华人民共和国个人信息保护法 / Personal Information Protection Law", "https://www.cac.gov.cn/2021-08/20/c_1631050028355286.htm"],
  ["网络数据安全管理条例 / Network Data Security Management Regulations", "https://www.cac.gov.cn/2024-09/30/c_1729384452307680.htm"],
  ["促进和规范数据跨境流动规定 / Cross-border data flow provisions", "https://www.cac.gov.cn/2024-03/22/c_1712776611775634.htm"],
  ["非经营性互联网信息服务备案管理办法 / Non-commercial internet information service filing rules", "https://www.beijing.gov.cn/zhengce/zhengcefagui/qtwj/202308/t20230830_3236516.html"],
  ["GitHub Pages — Data collection", "https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#data-collection"],
  ["GitHub Privacy Statement", "https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement"],
] as const;

const content: Record<Lang, Record<LegalSection, readonly Section[]>> = {
  zh: {
    imprint: [
      { title: "网站运营者", fields: [["英文名称", company], ["营业执照登记的中文名称", "[ ]"], ["联系地址", address], ["法定注册地址", "[ ]"], ["电话", "+86 573 8473 1555"], ["业务联系邮箱", contactEmail]] },
      { title: "企业登记与网站备案", fields: [["统一社会信用代码", "[ ]"], ["法定代表人", "[ ]"], ["登记机关", "[ ]"], ["营业执照公示链接", "[ ]"], ["ICP备案适用情况及备案号", "[ ]"], ["公安联网备案适用情况及备案号", "[ ]"], ["其他许可（如适用）", "[ ]"]], paragraphs: ["当前网站使用 GitHub Pages。备案及许可要求须结合运营主体、服务性质、域名及实际接入和托管情况确认；空白不代表已完成备案或获准豁免。"] },
      { title: "网站使用", paragraphs: ["本网站提供 EMC 产品与服务信息。产品资料和选型结果供咨询参考，具体规格、交付与交易条件以双方确认的文件为准。网站询价清单不构成订单。", "网站内容、图片、商标及文件的权利归相应权利人所有。需要超出法律允许范围的使用，请联系权利人取得许可。外部链接网站由各自运营者负责。", "本声明不限制依法不得排除或限制的权利与责任。个人信息处理请参阅本网站隐私政策。"] },
    ],
    privacy: [
      { title: "1. 适用范围与联系方式", paragraphs: ["本政策说明本网站的访问、产品选型与邮件询价处理情况，以《中华人民共和国个人信息保护法》及相关规定为依据。其他集团网站和您使用的邮件服务另有各自的政策。"], fields: [["个人信息处理者（英文名称）", company], ["登记中文名称", "[ ]"], ["联系地址", address], ["业务联系邮箱（可转交隐私请求）", contactEmail], ["个人信息保护联系人及专用联系方式", "[ ]"], ["生效日期", "[ ]"]] },
      { title: "2. 访问网站与托管日志", paragraphs: ["本网站由 GitHub Pages 提供静态托管，没有自行部署的表单接收服务器或用户数据库。浏览器需要向托管服务请求网页和资源。GitHub 官方说明：访问 Pages 时会记录并保存访问者 IP 地址，用于安全目的。", "托管接收方：GitHub；对应服务法人及联系方式：[ ]。除 IP 地址外，本网站涉及的具体日志字段：[ ]；处理地点：[ ]；保留期限及删除方式：[ ]。请同时参阅下方 GitHub 官方说明与隐私声明。"] },
      { title: "3. 浏览器本地存储", paragraphs: ["当前网站代码未设置 Cookie，未接入广告跟踪、统计分析 SDK 或第三方嵌入式地图、视频；字体由网站自身提供。托管服务仍会接收访问请求。", "询价清单使用 localStorage（frankonia.jiashan.mycart.v1）保存所选产品、规格、配置、来源页面、语言和添加时间，以便在同一浏览器中继续选型。清单不会自动上传，没有自动到期时间；可在询价清单中清空或通过浏览器删除本站数据。联系表单字段不写入此清单存储。"] },
      { title: "4. 邮件询价", paragraphs: ["您填写的公司、联系人、邮箱、电话、项目要求、选型答案及备注，用于编写询价邮件。网站打开您的邮件程序，不直接向服务器提交表单；只有您实际发送邮件后，相应收件人才会收到内容。", `普通询价发往 ${contactEmail}。My Chamber 向导及问卷生成的邮件还会预填参照收件人 ${enquiryCc}；发送前可在邮件程序查看、修改或删除收件人及正文。`, "邮件用于回复咨询、技术沟通及报价。邮件服务提供商：[ ]；实际存储地点：[ ]；访问人员范围：[ ]；保存期限、确定方法及到期处理方式：[ ]。请勿在询价中提供身份证件、金融账户、健康信息等无关敏感信息。"] },
      { title: "5. 处理依据与选择", paragraphs: ["各项处理须具备适用的法定依据；依赖同意时，您可撤回同意；依法需要单独同意的事项应单独办理。浏览本政策不等于同意所有处理。", "访问日志、邮件询价及后续业务处理分别适用的依据与同意流程：[ ]。不发送询价邮件不影响浏览产品资料，但我们无法回复未收到的询价。"] },
      { title: "6. 接收方及跨境处理", paragraphs: ["已确认的技术路径包括 GitHub Pages 托管和 My Chamber 邮件中的集团邮箱参照。邮箱本身不足以确认境外接收法人的身份或处理地点。", `集团接收邮箱：${enquiryCc}；法人名称、国家/地区、联系方式：[ ]；目的：技术询价协作；信息范围：您实际发送的询价邮件内容；处理方式、保存期限及向其行使权利的程序：[ ]。`, "托管、邮件服务及其他实际接收方的完整清单与委托/独立处理关系：[ ]。适用的国外提供告知、单独同意、影响评估和出境机制或豁免条件：[ ]。本政策不表示这些程序已完成；发送邮件本身不能代替依法需要的单独同意。"] },
      { title: "7. 您的权利", paragraphs: ["您可依法请求查阅、复制、更正、补充、删除个人信息，限制或拒绝处理、撤回同意，并在符合规定条件时请求转移；也可要求解释处理规则。", `可先向 ${contactEmail} 提交请求，说明请求事项及便于回复的联系方式。身份核验方式、内部处理流程与答复期限：[ ]。请勿主动发送完整身份证件。网站没有注册账户，无需办理网站账号注销。`, "对处理结果有异议，可向履行个人信息保护职责的部门投诉、举报，或依法寻求司法救济。当地受理部门及渠道：[ ]。"] },
      { title: "8. 未成年人、安全与更新", paragraphs: ["本网站面向企业专业用户，不要求提供儿童资料。不满十四周岁儿童信息的实际处理情况、监护人同意及专门规则（如涉及）：[ ]。", "网站通过 HTTPS 提供页面。邮件和后台业务系统的具体访问控制、加密、删除及事件响应措施：[ ]。发生个人信息安全事件时，应依法采取补救和通知措施。", "政策版本更新日期：2026-09-09。后续处理方式变化应同步更新告知；依法需要重新取得同意时，应在相关处理前办理。"] },
    ],
  },
  en: {
    imprint: [
      { title: "Website operator", fields: [["English name", company], ["Chinese name on business licence", "[ ]"], ["Contact address", address], ["Registered address", "[ ]"], ["Telephone", "+86 573 8473 1555"], ["Business email", contactEmail]] },
      { title: "Company registration and website filings", fields: [["Unified Social Credit Code", "[ ]"], ["Legal representative", "[ ]"], ["Registration authority", "[ ]"], ["Business licence disclosure link", "[ ]"], ["ICP filing applicability and number", "[ ]"], ["Public security filing applicability and number", "[ ]"], ["Other licences, if applicable", "[ ]"]], paragraphs: ["This site currently uses GitHub Pages. Filing and licensing requirements must be checked against the operator, services, domain and actual hosting/access arrangements. Blank fields do not indicate registration or exemption."] },
      { title: "Website use", paragraphs: ["This site provides EMC product and service information. Product materials and selection results support enquiries; specifications, delivery and commercial terms are subject to documents agreed by the parties. The enquiry list is not an order.", "Content, images, trademarks and documents belong to their respective rights holders. Obtain permission for uses beyond those permitted by law. Linked sites are operated by their respective providers.", "This notice does not exclude rights or liabilities that cannot lawfully be excluded. See this site's Privacy Policy for personal information processing."] },
    ],
    privacy: [
      { title: "1. Scope and contact", paragraphs: ["This policy covers visits, product selection and email enquiries on this website, with reference to China's Personal Information Protection Law and related rules. Other group sites and your email service have their own policies."], fields: [["Personal information handler (English name)", company], ["Registered Chinese name", "[ ]"], ["Contact address", address], ["Business email (can forward privacy requests)", contactEmail], ["Privacy contact and dedicated contact details", "[ ]"], ["Effective date", "[ ]"]] },
      { title: "2. Visits and hosting logs", paragraphs: ["GitHub Pages hosts this static site. We have no website form-receiving server or user database. Your browser requests pages and resources from the host. GitHub states that Pages visitors' IP addresses are logged and stored for security purposes.", "Hosting recipient: GitHub; applicable service entity and contact details: [ ]. Site-specific log fields beyond IP addresses: [ ]; processing locations: [ ]; retention and deletion arrangements: [ ]. See GitHub's documentation and privacy statement below."] },
      { title: "3. Browser storage", paragraphs: ["The current website code sets no cookies and includes no advertising trackers, analytics SDKs or embedded third-party maps/videos. Fonts are served with the site. The host still receives page requests.", "The enquiry list uses localStorage (frankonia.jiashan.mycart.v1) for selected products, specifications, configurations, source pages, language and addition times, so you can continue selection in the same browser. It is not automatically uploaded and has no automatic expiry. Clear the enquiry list or delete this site's browser data to remove it. Contact form fields are not written to this list storage."] },
      { title: "4. Email enquiries", paragraphs: ["Company, contact name, email, telephone, project requirements, selection answers and notes populate an enquiry email. The website opens your mail program without submitting a form to a server. Recipients receive the content only when you send the email.", `Ordinary enquiries go to ${contactEmail}. My Chamber wizard and questionnaire emails also prefill ${enquiryCc} as a CC recipient. You can review, change or remove recipients and content in your mail program before sending.`, "Emails support responses, technical discussions and quotations. Email service provider: [ ]; actual storage locations: [ ]; staff access: [ ]; retention period, determination criteria and end-of-retention handling: [ ]. Please do not include unrelated sensitive information such as identity documents, financial accounts or health information."] },
      { title: "5. Processing grounds and choices", paragraphs: ["Each processing activity needs an applicable legal basis. Consent can be withdrawn where processing relies on it; matters requiring separate consent need a separate process. Reading this policy does not constitute consent to all processing.", "Applicable grounds and consent procedures for hosting logs, enquiries and subsequent business processing: [ ]. Choosing not to send an enquiry does not prevent browsing, but we cannot answer an enquiry we have not received."] },
      { title: "6. Recipients and cross-border processing", paragraphs: ["Confirmed technical paths include GitHub Pages hosting and the group mailbox copied in My Chamber emails. An email address alone does not establish an overseas recipient's legal identity or processing location.", `Group recipient mailbox: ${enquiryCc}; legal entity, country/region and contact details: [ ]; purpose: technical enquiry collaboration; information: the enquiry content you actually send; processing method, retention and procedure to exercise rights with this recipient: [ ].`, "Complete hosting, email and other actual recipient list, including entrusted/independent processing roles: [ ]. Applicable overseas-transfer notices, separate consent, impact assessment and transfer mechanism or exemption conditions: [ ]. This policy does not confirm completion of these procedures; sending an email does not replace legally required separate consent."] },
      { title: "7. Your rights", paragraphs: ["Subject to law, you can request access, copies, correction, supplementation, deletion, restriction or refusal of processing, withdrawal of consent, conditional transfer, and explanation of processing rules.", `You may initially send a request to ${contactEmail}, describing it and providing reply details. Identity verification, internal handling and response timeframe: [ ]. Do not proactively send complete identity documents. This site has no registered accounts to close.`, "You may complain or report concerns to competent personal information protection authorities or seek judicial relief. Local receiving authority and channel: [ ]."] },
      { title: "8. Minors, security and updates", paragraphs: ["This site serves business professionals and does not request children's information. Actual handling of information about children under 14, guardian consent and dedicated rules, if applicable: [ ].", "Pages are served over HTTPS. Specific email and business-system access controls, encryption, deletion and incident-response measures: [ ]. Personal information incidents require remedial action and notification as applicable by law.", "Policy revision date: 2026-09-09. Changes in processing should be reflected in updated notices; renewed consent, where required, must precede the relevant processing."] },
    ],
  },
};

export default function LegalPage({ lang, section }: { lang: Lang; section: LegalSection }) {
  const { label, description } = legalMeta[lang][section];
  return (
    <PageShell lang={lang} eyebrow={section === "imprint" ? "IMPRINT" : "PRIVACY"} title={label}
      intro={lang === "zh" ? "本页以中国大陆相关规定及已核实的网站功能为基础。[ ] 表示尚待确认的资料，本页仍待补全。" : "Based on mainland China rules and verified website functionality. [ ] marks information awaiting confirmation; this notice remains incomplete."}
      closing={closingLine(lang, legalPath(section))}>
      <StructuredData lang={lang} page="path" path={legalPath(section)} trail={[{ name: label, path: legalPath(section) }]} description={description} />
      {content[lang][section].map((item, index) => (
        <section key={item.title} className={index % 2 ? "alt" : undefined}><div className="wrap">
          <div className="sec-head"><h2>{item.title}</h2></div>
          {item.fields && <div className="hairline-list">{item.fields.map(([name, value]) => (
            <div className="hl-row hl-row--name" key={name}><b>{name}</b><span className="hl-desc">{value === contactEmail ? <a href={`mailto:${contactEmail}`}>{value}</a> : value}</span></div>
          ))}</div>}
          {item.paragraphs && <div className="prose">{item.paragraphs.map(p => <p key={p}>{p}</p>)}</div>}
        </div></section>
      ))}
      <section><div className="wrap"><div className="sec-head"><h2>{lang === "zh" ? "参考资料" : "References"}</h2></div>
        <div className="prose"><ul>{sources.filter((_, i) => section === "privacy" ? i !== 3 : i === 3).map(([title, href]) => <li key={href}><a href={href} target="_blank" rel="noopener noreferrer">{title}</a></li>)}</ul></div>
      </div></section>
    </PageShell>
  );
}
