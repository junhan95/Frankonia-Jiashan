/**
 * Resolve hook: lets `node --test` import the app's TypeScript modules.
 *
 * Node strips types from a `.ts` file on its own, but its resolver will not
 * guess an extension — and the app writes `import "./chamber-sections"`, the
 * way TypeScript and the bundler expect. Rather than give one module a
 * `.ts`-suffixed import that no other module in the codebase has, this fills
 * the extension in when, and only when, plain resolution has already failed.
 */
export async function resolve(specifier, context, next) {
  try {
    return await next(specifier, context);
  } catch (error) {
    if (specifier.startsWith(".") && !/\.[cm]?[jt]sx?$/.test(specifier)) {
      return next(`${specifier}.ts`, context);
    }
    throw error;
  }
}
