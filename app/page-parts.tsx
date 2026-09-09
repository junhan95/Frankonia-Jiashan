import { asset, localeRoute, type Lang } from "./site-config";
import SiteLink from "./site-link";
import type { PageBody, Plate, SpecTable } from "./page-body";

/**
 * The bands a `PageBody` renders as, shared by the chamber and test-system
 * branches. The shape they read is in page-body.ts, which says why it is shared
 * and what is not; this file is the render half, split off for the same reason
 * every branch here splits `-sections.ts` from `-content.tsx`.
 *
 * These take their headings as props rather than reading a `copy` table of
 * their own: the two branches cite different sources — one the 2026 catalogue,
 * the other the head office's own product pages — and the line that says so
 * belongs with the branch that knows.
 */

/** The opening paragraphs, and the plates under them. On an index this is
 *  everything above the model list; on a page with no list, the next band
 *  follows straight on. */
export function Lead({ body }: { body: PageBody }) {
  return (
    <>
      <div className="prose">
        {body.lead.map((p) => <p key={p}>{p}</p>)}
      </div>
      {body.figure && <Figure plate={body.figure} wide />}
      {body.figureRow && (
        <div className="figure-row">
          {body.figureRow.map((plate) => <Figure key={plate.src} plate={plate} />)}
        </div>
      )}
    </>
  );
}

/**
 * A plate.
 *
 * A wide plate is capped at its own natural width rather than the 900px
 * `.figure-wide` allows: the military plate is 744px across in the catalogue
 * and the EFS probe 360px, and stretching either to fill the measure would
 * print a soft image at a size the source cannot support. Enlarging a source is
 * the one thing the asset ledgers rule out (`withoutEnlargement`), and the rule
 * holds at render time too.
 *
 * 900 is the text's measure — see `.figure-wide` in globals.css for why the
 * plates share it.
 */
export function Figure({ plate, wide = false }: { plate: Plate; wide?: boolean }) {
  return (
    <figure
      className={wide ? "figure figure-wide" : "figure"}
      style={wide ? { maxWidth: Math.min(plate.w, 900) } : undefined}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset(plate.src)}
        alt={plate.alt ?? ""}
        width={plate.w}
        height={plate.h}
        loading="lazy"
        decoding="async"
      />
      {plate.caption && <figcaption>{plate.caption}</figcaption>}
    </figure>
  );
}

/**
 * The specification tables for the page.
 *
 * These carry what a model list cannot: the sizes a chamber is built in, the
 * gain an amplifier holds across its band. `kicker`, `title` and `note` come
 * from the branch — the note names the source a reader should compare their
 * quotation against, and that differs by branch.
 */
export function Tables({
  lang,
  tables,
  kicker,
  title,
  note,
}: {
  /** Only `SpecTable.link` needs it, but a table that carries one is data and
   *  the band cannot know in advance which page will have it. */
  lang: Lang;
  tables: readonly SpecTable[];
  kicker: string;
  title: string;
  note: string;
}) {
  return (
    <>
      <div className="sec-head">
        <span className="kicker">{kicker}</span>
        <h2>{title}</h2>
        <p>{note}</p>
      </div>
      {tables.map((table, i) => (
        <div key={table.title}>
          {/* Every table keeps its own title, including the first: the band
              heading names the band, and a page can carry ten tables under
              it. */}
          <h3 className="sub-head" style={i > 0 ? { marginTop: "56px" } : undefined}>{table.title}</h3>
          <div className="spec-wrap">
            <table className="spec-table">
              <thead>
                <tr>
                  {table.head.map((h, c) => (
                    /* An empty heading is a row-label column, which has no name
                       of its own — the load machine tables and every instrument
                       table read down, not across. It still needs a cell for the
                       column to exist. */
                    <th key={h || `c${c}`} scope="col">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, c) => <td key={`${row[0]}-${c}`}><Cell text={cell} /></td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {table.note && <p className="spec-note">{table.note}</p>}
          {/* Under the note, not above it: the note qualifies the figures the
              reader has just read, and the link is what to do next. */}
          {table.link && (
            <SiteLink className="go sec-go" href={localeRoute(lang, table.link.path)}>
              {table.link.label}<span aria-hidden="true">→</span>
            </SiteLink>
          )}
        </div>
      ))}
    </>
  );
}

/** A cell splits on a newline: the figure first, then the lines the source sets
 *  under it in smaller type. Written as one string in the data because that is
 *  how the source reads — a dimension and its qualifier are one statement, not
 *  two columns. */
function Cell({ text }: { text: string }) {
  const [main, ...sub] = text.split("\n");
  return (
    <>
      {main}
      {sub.map((line) => <small key={line}>{line}</small>)}
    </>
  );
}

/**
 * A checked list, and the paired-column framing over it.
 *
 * Moved here from company-content.tsx when the chamber model pages needed the
 * same two columns for the head office's Typical Product Standards — emission
 * on one side, immunity on the other, which is exactly the shape the philosophy
 * page already had.
 *
 * The tick is a different glyph from the one `Groups` draws below. They were
 * authored separately and both are in production; making them one is a visual
 * change to the company pages, which is a design decision and not part of
 * moving a component. Left as found.
 */
export function CheckList({ items }: { items: readonly string[] }) {
  return (
    <ul className="check-list">
      {items.map((item) => (
        <li key={item}>
          <svg className="chk" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M2 8.6l4 4 8-9.2" />
          </svg>
          {item}
        </li>
      ))}
    </ul>
  );
}

/**
 * One column of a checked pair.
 *
 * `head` takes a tuple where the source splits the heading and puts the weight
 * on the second half — "Frankonia **stands for**" — and a plain string where it
 * does not. The standards lists are one word each ("Emission", "Immunity"),
 * and a tuple of `["", "Emission"]` would be a worse way to say that.
 */
export function CheckColumn({
  head,
  items,
}: {
  head: string | readonly [string, string];
  items: readonly string[];
}) {
  return (
    <div className="check-col">
      <h3>
        {typeof head === "string" ? <b>{head}</b> : <>{head[0]}<b>{head[1]}</b></>}
      </h3>
      <CheckList items={items} />
    </div>
  );
}

/** The source's own titled groups as check lists, then its closing line. */
export function Groups({ body }: { body: PageBody }) {
  return (
    <>
      {body.groups.map((group, i) => (
        <div key={group.title} style={i > 0 ? { marginTop: "56px" } : undefined}>
          <div className="sec-head">
            <h2>{group.title}</h2>
          </div>
          <ul className="check-list">
            {group.items.map((item) => (
              <li key={item}>
                <svg className="chk" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3.2 3.2L13 5" /></svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
      {/* The line that closes the benefit list. It used to be a `.callout` —
          a filled grey tile with a primary rule, which is the right treatment
          for a pull-quote inside prose and the wrong one directly under a
          hairline list: HQ read it as "the grey line looks a bit out of place"
          in the August review and asked for a proposal. This is it — the same
          sentence, carried on the list's own grammar rather than in a box of
          its own. */}
      {body.close && <p className="callout callout--close">{body.close}</p>}
    </>
  );
}
