import { chambersPath } from "./chamber-sections";
import { legalPath } from "./legal-sections";
import { companySections, sectionMeta, sectionPath } from "./company-sections";
import { contactPath } from "./contact-sections";
import { testSystemsPath } from "./test-system-sections";
import SiteLink from "./site-link";
import { localeRoute, type Lang } from "./site-config";

/** The group's four public accounts, in the order the HQ site lists them.
    Glyphs are 24×24 filled marks — the brand forms, not the outline icons
    the rest of the site draws, because a stroked "f" stops reading as
    Facebook. */
const socials = [
  {
    name: "Facebook",
    href: "https://de-de.facebook.com/frankoniagroup/",
    path: "M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.6a22 22 0 0 0-2.4-.12c-2.4 0-4.05 1.47-4.05 4.16v2.26H7.5V13h2.75v8h3.25z",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/frankoniagroup/",
    path: "M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM3 21h4V9H3v12zM9.5 9v12h4v-6.4c0-1.7.32-3.35 2.43-3.35 2.08 0 2.07 1.95 2.07 3.46V21h4v-7.1c0-3.47-.75-6.14-4.8-6.14-1.95 0-3.26 1.07-3.8 2.08h-.05V9h-3.85z",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/frankonia.emc",
    path: "M12 2c-2.7 0-3.06.01-4.12.06-1.06.05-1.79.22-2.42.46-.66.26-1.22.6-1.77 1.15-.55.55-.89 1.11-1.15 1.77-.24.63-.41 1.36-.46 2.42C2.01 8.94 2 9.3 2 12s.01 3.06.06 4.12c.05 1.06.22 1.79.46 2.42.26.66.6 1.22 1.15 1.77.55.55 1.11.89 1.77 1.15.63.24 1.36.41 2.42.46 1.06.05 1.42.06 4.12.06s3.06-.01 4.12-.06c1.06-.05 1.79-.22 2.42-.46.66-.26 1.22-.6 1.77-1.15.55-.55.89-1.11 1.15-1.77.24-.63.41-1.36.46-2.42.05-1.06.06-1.42.06-4.12s-.01-3.06-.06-4.12c-.05-1.06-.22-1.79-.46-2.42a4.9 4.9 0 0 0-1.15-1.77 4.9 4.9 0 0 0-1.77-1.15c-.63-.24-1.36-.41-2.42-.46C15.06 2.01 14.7 2 12 2zm0 1.8c2.67 0 2.99.01 4.04.06.97.04 1.5.21 1.86.35.47.18.8.4 1.15.75.35.35.57.68.75 1.15.14.36.31.89.35 1.86.05 1.05.06 1.37.06 4.04s-.01 2.99-.06 4.04c-.04.97-.21 1.5-.35 1.86-.18.47-.4.8-.75 1.15-.35.35-.68.57-1.15.75-.36.14-.89.31-1.86.35-1.05.05-1.37.06-4.04.06s-2.99-.01-4.04-.06c-.97-.04-1.5-.21-1.86-.35a3.1 3.1 0 0 1-1.15-.75 3.1 3.1 0 0 1-.75-1.15c-.14-.36-.31-.89-.35-1.86-.05-1.05-.06-1.37-.06-4.04s.01-2.99.06-4.04c.04-.97.21-1.5.35-1.86.18-.47.4-.8.75-1.15.35-.35.68-.57 1.15-.75.36-.14.89-.31 1.86-.35 1.05-.05 1.37-.06 4.04-.06zm0 3.06a5.14 5.14 0 1 0 0 10.28 5.14 5.14 0 0 0 0-10.28zm0 8.47a3.33 3.33 0 1 1 0-6.67 3.33 3.33 0 0 1 0 6.67zm6.54-8.67a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z",
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@FrankoniaEMC",
    path: "M23 12s0-3.2-.4-4.74a2.5 2.5 0 0 0-1.76-1.76C19.3 5.1 12 5.1 12 5.1s-7.3 0-8.84.4A2.5 2.5 0 0 0 1.4 7.26C1 8.8 1 12 1 12s0 3.2.4 4.74c.22.85.87 1.5 1.76 1.74 1.54.42 8.84.42 8.84.42s7.3 0 8.84-.4a2.5 2.5 0 0 0 1.76-1.76C23 15.2 23 12 23 12zM9.75 15.02V8.98L15.5 12l-5.75 3.02z",
  },
];

/** Shared dark footer. */
export default function SiteFooter({ lang, t }: { lang: Lang; t: FooterCopy }) {
  return (
    <footer>
      <div className="wrap">
        <div className="foot">
          <div>
            <h5>FRANKONIA</h5>
            <p className="foot-desc">{t.ftDesc}</p>
            <address className="foot-addr">
              {t.ftAddr.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </address>
          </div>
          <div>
            <h5>{t.ftCompany}</h5>
            <ul>
              {companySections.map((s) => (
                <li key={s}>
                  <SiteLink href={localeRoute(lang, sectionPath(s))}>{sectionMeta[lang][s].label}</SiteLink>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5>{t.ftSol}</h5>
            <ul>
              {/* The chamber branch has its own overview now; the landing's
                  #chambers band is a summary of it, not the destination. */}
              <li><SiteLink href={localeRoute(lang, chambersPath)}>{t.ftL1}</SiteLink></li>
              <li><SiteLink href={localeRoute(lang, testSystemsPath)}>{t.ftL2}</SiteLink></li>
              <li><SiteLink href={localeRoute(lang, "/cybershield")}>CyberShield</SiteLink></li>
            </ul>
          </div>
          <div>
            <h5>{t.ftLink}</h5>
            <ul>
              <li><a href="https://frankonia-solutions.com/" target="_blank" rel="noopener">{t.ftHq}</a></li>
              <li><SiteLink href={localeRoute(lang, contactPath)}>{t.ftContact}</SiteLink></li>
              {/* Both were promised by the footer long before they existed —
                  the privacy entry pointed at `#`, which on 84 pages is a link
                  that does nothing. */}
              <li><SiteLink href={localeRoute(lang, legalPath("imprint"))}>{t.ftImprint}</SiteLink></li>
              <li><SiteLink href={localeRoute(lang, legalPath("privacy"))}>{t.ftPriv}</SiteLink></li>
            </ul>
          </div>
        </div>
        <div className="copy">
          {/* 1987 — the founding year, matching the product site's own footer
              ("© 1987 Frankonia Group") rather than the current year. */}
          <span>© 1987 Frankonia. All rights reserved.</span>
          <div className="copy-end">
            <ul className="foot-social">
              {socials.map((s) => (
                <li key={s.name}>
                  {/* The glyph carries no text, so the link's name comes from
                      the label — untranslated, since all four are proper
                      nouns on both language trees. */}
                  <a href={s.href} target="_blank" rel="noopener" aria-label={`Frankonia ${s.name}`}>
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d={s.path} /></svg>
                  </a>
                </li>
              ))}
            </ul>
            <span>Frankonia Jiashan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export type FooterCopy = {
  ftDesc: string; ftAddr: readonly string[]; ftCompany: string; ftSol: string;
  ftL1: string; ftL2: string; ftLink: string; ftHq: string;
  ftContact: string; ftImprint: string; ftPriv: string;
};
