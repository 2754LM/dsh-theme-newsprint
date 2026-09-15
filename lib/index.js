/**
 * dsh-theme-newsprint — host half.
 *
 * The package declares `dsh.bundle.patch` (cordis.patch.yml, which inserts
 * the loader entry) and `dsh.client` (platform web). This host half is
 * intentionally a no-op: everything visual lives in lib/client.js, which
 * runs in the browser once the loader mounts the entry. dshmarket
 * recognises this loader entry as a theme through the awesome-dsh-plugin
 * registry and toggles its `disabled` flag on activate / deactivate. With
 * the entry disabled, no fiber is created; with it enabled, the client's
 * apply() runs and injects one <style>.
 */
export const name = "dsh-theme-newsprint"
export function apply() {}
