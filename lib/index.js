/**
 * dsh-theme-newsprint — host half.
 *
 * Cordis-shim form: this package declares only `dsh.bundle` (no
 * `dsh.client` block) and the host half is intentionally a no-op.
 * Everything visual lives in lib/client.js, which runs in the browser
 * once the loader mounts the entry. dshmarket recognises this loader
 * entry as a theme by virtue of being in the awesome-dsh-plugin registry
 * (when shipped there) and toggles its `disabled` flag on activate /
 * deactivate. With the entry disabled, no fiber is created; with it
 * enabled, the client's apply() runs and injects one <style>.
 */
export const name = "dsh-theme-newsprint"
export function apply() {}
