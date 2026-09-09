import { register } from "node:module";
import { pathToFileURL } from "node:url";

/** Loaded through `--import` so the hook is in place before the first test
 *  file resolves its imports. See ts-hooks.mjs. */
register("./ts-hooks.mjs", pathToFileURL(`${import.meta.dirname}/`));
