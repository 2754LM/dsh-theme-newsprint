/**
 * dsh-theme-newsprint — host half.
 *
 * The package declares `dsh.bundle.patch` (cordis.patch.yml, which inserts
 * the loader entry) and `dsh.client` (platform web). This host half is
 * intentionally a no-op: everything visual lives in lib/client.js, which
 * runs in the browser once the loader mounts the entry. Disabling the entry
 * (e.g. `- id: newsprint` + `disabled: true` in a profile patch layer)
 * creates no fiber; enabling it runs the client's apply(), which injects one
 * <style>.
 */
export const name = "dsh-theme-newsprint"
export function apply() {}
