import PageShell, { type HeadShot } from "./page-shell";
import StructuredData from "./structured-data";
import { contactMeta, contactPath, offices } from "./contact-sections";
import { closingLine } from "./page-closing";
import { downloadsPath } from "./downloads-sections";
import { mychamberMeta, mychamberPath } from "./mychamber-sections";
import SiteLink from "./site-link";
import { localeRoute, type Lang } from "./site-config";

/* The contact page.

   It exists because the site had five ways in and one door: every "Get a
   Quote" on every page scrolled to the red band at the foot of the landing
   page, which offered the general sales address and the German switchboard.
   The head office publishes four entities on its own contact page and there is
   a Korean office besides, so the band now invites the enquiry and this page
   answers who receives it.

   Two bands, and the second is the one that does the work. A list of addresses
   is a page a reader leaves as uncertain as they arrived — the question behind
   "who do I write to" is almost always "what do I even ask for". So the offices
   come first, and then the three things that turn a first mail into a first
   answer rather than a first question back. */

const copy = {
  zh: {
    eyebrow: "CONTACT",
    title: "联系我们",
    intro:
      "您可以在您的需求没有完全解决的阶段联系我们。一旦您知道两件事：您需要通过哪些标准以及正在测试什么，我们就可以一起缩小其余范围。",
    officesKicker: "OFFICES",
    officesTitle: "全球五处办公室",
    officesLead:
      "总部和设计/项目管理位于德国海德克，项目由附近的工作场所处理。无论您发送到哪个地址，都会交付给负责的工程师。",
    /** The Korean office has no premises to publish yet. Said outright rather
     *  than left as a blank line, which reads as a field someone forgot. */
    addressPending: "地址待公布",
    askKicker: "WHAT TO SEND",
    askTitle: "提供这三项信息，让首次回复更有针对性。",
    askLead:
      "暂时没有完整信息也可以联系我们。以下内容有助于我们理解您的需求，提前提供可减少反复沟通。",
    ask: [
      [
        "01",
        "必须通过的标准",
        "ECE R10 · CISPR 25 · ISO 11452 · MIL-STD-461 · IEC/EN 61000-4-3 — 测试必须证明的内容决定了测量距离和吸波材料规格，它们共同决定了暗室尺寸。",
      ],
      [
        "02",
        "被测设备和静区",
        "最大测试物体的尺寸和重量以及所需的测量距离（1.0·3.0·5.0·10.0 m）。对于单个零件，它终止于 1.0 m 的腔室，对于车辆，它延伸至 ø6.0 m 的静区。",
      ],
      [
        "03",
        "安装空间及安排",
        "确保内部尺寸和楼层高度、送货路线、楼层负载和目标完成时间。特别是如果它建在运营建筑物内，则无需动火即可并行施工，因为它仅用螺栓而不是焊接紧固。",
      ],
    ],
    goMychamber: "缩小它是哪个暗室",
    goDownloads: "先看目录",
  },
  en: {
    eyebrow: "CONTACT",
    title: "Contact",
    intro:
      "You do not need a finished specification to get in touch. Two things — which standard the test has to satisfy, and what is being tested — are enough to start narrowing down the rest together.",
    officesKicker: "OFFICES",
    officesTitle: "Five offices",
    officesLead:
      "The head office, with design and project management, is in Heideck, Germany; the office nearest you takes the project. Whichever address you write to, it reaches the engineer who answers it.",
    addressPending: "Address to follow",
    askKicker: "WHAT TO SEND",
    askTitle: "Three things that make the first reply a useful one",
    askLead:
      "Send what you have — the list below is what we would ask for anyway, and putting it in the first mail removes a round trip.",
    ask: [
      [
        "01",
        "The standard it has to meet",
        "ECE R10 · CISPR 25 · ISO 11452 · MIL-STD-461 · IEC/EN 61000-4-3 — what the test has to prove sets the measurement distance and the absorber lining, and those two set the size of the chamber.",
      ],
      [
        "02",
        "The EUT and the quiet zone",
        "Dimensions and weight of the largest device under test, and the measurement distance you need (1, 3, 5 or 10.0 m). A single component ends at a 1.0 m chamber; a vehicle takes it up to a ø6.0 m quiet zone.",
      ],
      [
        "03",
        "The room and the schedule",
        "Internal dimensions and clear height of the space you have, the access route, the floor loading, and when it has to be finished — particularly if it goes inside a building that stays in use. Nothing is welded, so the room goes up without hot work.",
      ],
    ],
    goMychamber: "Start by narrowing down the chamber",
    goDownloads: "Browse the catalogues first",
  },
} as const;

/* The head band. The trade-fair stand rather than the head office building:
   this page is five addresses and the people at them, and the stand is the one
   photograph on the site with a conversation in it. The logo wall and the
   product plinths sit right of centre, which is the half of the band the scrim
   clears. Framed above centre to keep the hall's ceiling rig out of it. */
const contactShot: HeadShot = {
  src: "/company/images/events-trade-fair-booth.webp", w: 1600, h: 1200, at: "50% 40%",
};

export default function ContactPage({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const { label, description } = contactMeta[lang];

  return (
    <PageShell
      lang={lang}
      eyebrow={t.eyebrow}
      title={t.title}
      intro={t.intro}
      shot={contactShot}
      closing={closingLine(lang, contactPath)}
      /* The shared band's primary button points at this page, which from this
         page is a link to itself. The two next steps take its place: the
         questionnaire for a reader who does not have a model name yet, and the
         catalogues for one who would rather read first. */
      bandActions={
        <>
          <SiteLink className="btn btn-red" href={localeRoute(lang, mychamberPath)}>
            {mychamberMeta[lang].label}
          </SiteLink>
          <SiteLink className="btn btn-outline" href={localeRoute(lang, downloadsPath)}>
            {t.goDownloads}
          </SiteLink>
        </>
      }
    >
      <StructuredData
        lang={lang}
        page="path"
        path={contactPath}
        trail={[{ name: label, path: contactPath }]}
        description={description}
      />

      <section>
        <div className="wrap">
          <div className="sec-head">
            <span className="kicker">{t.officesKicker}</span>
            <h2>{t.officesTitle}</h2>
            <p>{t.officesLead}</p>
          </div>
          <div className="hairline-list">
            {/* `--name`: the row's left cell holds a registered company name,
                which is far longer than the short labels its nowrap default is
                written for — see globals.css. */}
            {offices.map((o) => (
              <div className="hl-row hl-row--name" key={o.id}>
                <b>{o.name}</b>
                <span className="hl-desc">
                  {o.address ?? t.addressPending}
                  {/* Not `.hl-spec`, which is the line the chamber lists put
                      catalogue figures on: it is --mute on this band, and a
                      reader is meant to click these. `.hl-contact` inherits
                      the descriptor's own colour instead. */}
                  <span className="hl-contact">
                    <a href={`mailto:${o.email}`}>{o.email}</a>
                    <span className="sep" aria-hidden="true">·</span>
                    <a href={o.phoneHref}>{o.phone}</a>
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="alt">
        <div className="wrap">
          <div className="sec-head">
            <span className="kicker">{t.askKicker}</span>
            <h2>{t.askTitle}</h2>
            <p>{t.askLead}</p>
          </div>
          <div className="line-grid three">
            {t.ask.map(([no, name, body]) => (
              <div className="num-col" key={no}>
                <span className="num">{no}</span>
                <h4>{name}</h4>
                <p>{body}</p>
              </div>
            ))}
          </div>
          <SiteLink className="go sec-go" href={localeRoute(lang, mychamberPath)}>
            {t.goMychamber}<span aria-hidden="true">→</span>
          </SiteLink>
        </div>
      </section>
    </PageShell>
  );
}
