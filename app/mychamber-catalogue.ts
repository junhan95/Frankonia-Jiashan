import {
  chamberModels,
  modelBody,
  typeMeta,
  typePath,
  type ChamberModel,
} from "./chamber-sections";
import { modelShots } from "./chamber-gallery";
import { industryLabel } from "./industries";
import { treeModels, type CatalogueEntry } from "./mychamber-advisor";
import { asset, localeRoute, type Lang } from "./site-config";

/**
 * The join between the catalogue (chamber-sections.ts) and the advisor's index
 * of it (mychamber-advisor.ts).
 *
 * It lives in its own module for two reasons. It has to run on the server:
 * chamber-sections.ts carries both locales of every model page's prose, tens of
 * kilobytes of it, and importing that from a client module would ship all of it
 * to the browser to read four fields off each model — what crosses the boundary
 * is the 32 rows below and nothing else. And it has to be importable without
 * JSX, so the matrix conformance test can build the same catalogue the page
 * builds and score against it.
 */

/**
 * The photograph on a result card is the model's own — the same plate the
 * model page leads with, and the first frame its row on the type index opens
 * onto.
 *
 * It used to be a photograph of the model's category with a line underneath
 * saying so, because when MyChamber was built the repository held no imagery
 * per model. It does now: docs/source/chambers-model-assets.md records a plate
 * for all twenty-six model pages, re-collected from the head office's own
 * pages. Walking eight questions down to one designation and then being shown
 * a different room than that designation's page shows is the one mismatch this
 * page cannot afford, so the card reads its picture off the same table the
 * page does rather than keeping a second, coarser answer of its own.
 *
 * `modelShots` is what does the reading, so the two stay together by
 * construction — including the reverberation chambers, where seven models share
 * a page and its plates split by stirrer: the XL and the XXL lead with the
 * large disc under the ceiling, the other five with the Z-fold standing against
 * the wall. Taking the first plate is taking whichever of those two is this
 * model's.
 */
const shotFor = (lang: Lang, model: ChamberModel) => {
  const figure = modelBody[lang][model.slug]?.figure;
  if (!figure) {
    throw new Error(
      `mychamber-catalogue: ${model.name} (${model.slug}) has no ${lang} model-page plate to put on its result card.`,
    );
  }
  const [lead] = modelShots(lang, model, figure);
  return { src: asset(lead.src), w: lead.w, h: lead.h, alt: lead.alt };
};

/**
 * Every designation the decision tree ends in has to be a chamber the site
 * actually carries. A leaf naming a model that is not in `chamberModels` would
 * render as an empty result — the kind of omission nobody notices — so it stops
 * the build instead.
 *
 * The reverse is not an error. The Chamber Matrix does not place the Shielded
 * Room: it is the shell the range is built on rather than an EMC test site, and
 * MyChamber leaves it to its own product page. Which catalogue models the tree
 * reaches, and which it deliberately does not, is pinned in
 * tests/mychamber-matrix.test.mjs.
 */
const missing = treeModels().filter((name) => !chamberModels.some((m) => m.name === name));
if (missing.length > 0) {
  throw new Error(
    `mychamber-advisor: the decision tree ends in ${missing.join(", ")}, which is not in chamberModels.`,
  );
}

export const buildCatalogue = (lang: Lang): CatalogueEntry[] =>
  chamberModels.map((model) => ({
    name: model.name,
    desc: model.desc,
    industry: model.industry,
    industryLabel: industryLabel[lang][model.industry],
    type: model.type,
    typeLabel: typeMeta[lang][model.type].label,
    spec: model.spec,
    href: localeRoute(lang, typePath(model.type)),
    shot: shotFor(lang, model),
  }));
