/** Mirrors migration `ROUTES.CLIENT(slug)` but for Next `/solutions/[slug]`. */
export function solutionClientPath(slug: string): string {
  return `/solutions/${slug}`;
}
