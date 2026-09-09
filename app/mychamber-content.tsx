import { buildCatalogue } from "./mychamber-catalogue";
import { mychamberMeta, mychamberPath } from "./mychamber-sections";
import MyChamberWizard from "./mychamber-wizard";
import PageShell, { type HeadShot } from "./page-shell";
import { closingLine } from "./page-closing";
import StructuredData from "./structured-data";
import type { Lang } from "./site-config";

/* The head band. MyChamber is the last entry in the bar and, like CyberShield,
   a branch of one page.
   The FAC-3 panorama from Marktheidenfeld — a different room from the one the
   chambers index opens on, and the same 4:1 frame that survives a band this
   shallow. The branch below asks which chamber is yours; the answer is a room
   like this one. */
const wizardShot: HeadShot = {
  src: "/chambers/images/pano-fac-3.webp", w: 2000, h: 500, at: "50% 42%",
};

/**
 * The MyChamber page. A server component: the catalogue is built here and
 * handed to the wizard as data, so chamber-sections.ts stays out of the client
 * bundle — see the note in mychamber-catalogue.ts.
 */
export default function MyChamberPage({ lang }: { lang: Lang }) {
  const meta = mychamberMeta[lang];

  return (
    <>
      <StructuredData
        lang={lang}
        page="path"
        path={mychamberPath}
        trail={[{ name: meta.label, path: mychamberPath }]}
        description={meta.description}
      />
      <PageShell
        lang={lang}
        eyebrow="MYCHAMBER"
        title={meta.title}
        intro={meta.description}
        shot={wizardShot}
        closing={closingLine(lang, mychamberPath)}
      >
        <MyChamberWizard lang={lang} catalogue={buildCatalogue(lang)} />
      </PageShell>
    </>
  );
}
