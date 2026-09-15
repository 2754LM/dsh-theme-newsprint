/**
 * dsh-theme-newsprint — host half.
 *
 * A pure theme plugin has no host-side work: the browser half does all the
 * registering via the dsh-client-ui-theme runtime. The host loader entry only
 * needs to exist so dshmarket can see the plugin and flip its `disabled`
 * flag on activate / deactivate.
 */
export const name = "dsh-theme-newsprint";
export function apply() {}
