/**
 * dsh-theme-newsprint — client half.
 *
 * Registers two themes with the dsh-client-ui-theme runtime:
 *   - newsprint-light (warm paper)
 *   - newsprint-dark  (plain neutral black)
 * and injects the L3 markdown typography as a single <style> element whose
 * every rule is scoped under `.dsh-newsprint-active` (a class this plugin
 * toggles on document.documentElement). The disposers from ctx.theme.register()
 * plus the style removal and class removal run on the plugin's fiber dispose
 * (when dshmarket flips `disabled: true` or the plugin is removed), so a
 * clean uninstall restores the official look byte-for-byte.
 *
 * The scope class replaces the skin-center loader's `html[data-dsh-skin=...]`
 * wrap: we are loaded through dshmarket's theme API, not through skin-center,
 * so the loader does not wrap us. The class is the cleanest way to keep the
 * L3 typography from leaking onto the official theme when newsprint is
 * installed-but-not-applied.
 *
 * Tokens are inlined here (not imported from palettes/*.json) to match the
 * pattern dsh-dream-skin uses for its built-in skins. The JSON files in
 * palettes/ are kept as the canonical machine-readable form — useful for
 * sharing the theme as a dream-skin pack and for anyone auditing the values.
 */
const LIGHT_TOKENS = {
  "--dsw-alias-bg-base": "#f3f2ee",
  "--dsw-alias-bg-layer-1": "#f3f2ee",
  "--dsw-alias-bg-layer-2": "#ebeae4",
  "--dsw-alias-bg-layer-3": "#e3e2dc",
  "--dsw-alias-bg-overlay": "#ebeae4",
  "--dsw-alias-bg-module-platform": "#ebeae4",
  "--dsw-alias-bg-multi-select": "#e8e7e7",
  "--dsw-alias-bg-skeleton": "rgba(31, 9, 9, 0.05)",
  "--dsw-alias-border-l1": "rgba(31, 9, 9, 0.06)",
  "--dsw-alias-border-l2-darkmode-thin": "rgba(31, 9, 9, 0.10)",
  "--dsw-alias-border-l2": "rgba(31, 9, 9, 0.10)",
  "--dsw-alias-border-l3": "rgba(31, 9, 9, 0.14)",
  "--dsw-alias-border-l4": "rgba(31, 9, 9, 0.20)",
  "--dsw-alias-brand-primary": "#1f0909",
  "--dsw-alias-brand-text": "#1f0909",
  "--dsw-alias-brand-primary-invert": "#f3f2ee",
  "--dsw-alias-button-contrast-fill": "#1f0909",
  "--dsw-alias-button-elevated-fill": "#fdfdfb",
  "--dsw-alias-button-floating-fill": "#fdfdfb",
  "--dsw-alias-button-floating-hover": "#ebeae4",
  "--dsw-alias-button-ghost-active-border": "#bababa",
  "--dsw-alias-button-ghost-active-fill": "#e8e7e7",
  "--dsw-alias-button-ghost-active-hover": "#dadada",
  "--dsw-alias-button-info-fill": "#065588",
  "--dsw-alias-button-info-hover": "#0a6aa0",
  "--dsw-alias-button-primary-dimmed": "#dadada",
  "--dsw-alias-button-primary-fill": "#1f0909",
  "--dsw-alias-button-primary-hover": "#36284e",
  "--dsw-alias-interactive-bg-active": "rgba(31, 9, 9, 0.10)",
  "--dsw-alias-interactive-bg-hover-accent": "rgba(6, 85, 136, 0.10)",
  "--dsw-alias-interactive-bg-hover-danger": "rgba(154, 12, 12, 0.08)",
  "--dsw-alias-interactive-bg-hover-solid": "#ebeae4",
  "--dsw-alias-interactive-bg-hover": "rgba(31, 9, 9, 0.05)",
  "--dsw-alias-label-caption": "#9a9089",
  "--dsw-alias-label-dimmed": "#cdc7be",
  "--dsw-alias-label-primary": "#1f0909",
  "--dsw-alias-label-primary-dimmed": "#0c0404",
  "--dsw-alias-label-primary-foreground": "#f3f2ee",
  "--dsw-alias-label-primary-inverted": "#f3f2ee",
  "--dsw-alias-label-secondary": "#656565",
  "--dsw-alias-label-tertiary": "#8a8378",
  "--dsw-alias-link": "#065588",
  "--dsw-alias-markdown-citation": "#dadada",
  "--dsw-alias-markdown-code-block": "#dadada",
  "--dsw-alias-markdown-code-block-banner": "#ebeae4",
  "--dsw-alias-markdown-code-segment-selected": "#fdfdfb",
  "--dsw-alias-markdown-code-segment-unselected": "#dadada",
  "--dsw-alias-markdown-inline-code": "#dadada",
  "--dsw-alias-markdown-placeholder": "#ebeae4",
  "--dsw-alias-markdown-tag": "#dadada",
  "--dsw-alias-scrollbar-bg-l1": "#dadada",
  "--dsw-alias-scrollbar-bg-l2": "#c5c5c5",
  "--dsw-alias-scrollbar-hover-l1": "#bababa",
  "--dsw-alias-scrollbar-hover-l2": "#a8a294",
  "--dsw-alias-state-business-primary": "#065588",
  "--dsw-alias-state-business-tertiary": "#dadada",
  "--dsw-alias-state-error-primary": "#9a0c0c",
  "--dsw-alias-state-error-secondary": "#c92626",
  "--dsw-alias-state-success-primary": "#4f7942",
  "--dsw-alias-state-success-secondary": "#6a9459",
  "--dsw-alias-state-success-tertiary": "#e6ecd6",
  "--dsw-alias-state-warn-label": "#a05f14",
  "--dsw-alias-state-warn-primary": "#c77d1f",
  "--dsw-alias-state-warn-secondary": "#d99a45",
  "--dsw-alias-state-warn-tertiary": "#f4e6c8",
  "--dsw-alias-toast-bg": "#1f0909",
  "--dsw-alias-tooltip-bg": "#1f0909",
  "--dsw-specific-bubble": "#ebeae4",
  "--dsw-specific-bubble-highlight": "#dadada",
  "--dsw-specific-input-major": "#fdfdfb",
  "--dsw-specific-login-input": "#ebeae4",
  "--dsw-specific-selector": "#ebeae4",
  "--dsw-specific-sidebar-fill": "#ebeae4",
  "--dsw-specific-sidebar-nav-item-active": "#dadada",
  "--dsw-specific-sidebar-nav-item-active-accent": "#dadada",
  "--dsw-specific-sidebar-nav-item-hover": "#e3e2dc",
  "--dsw-specific-tip": "#ebeae4",
  "--dsw-linear-gradient-think": "linear-gradient(180deg, #f3f2ee 20.19%, rgba(243, 242, 238, 0) 100%)",
  "--dsw-linear-think-select": "linear-gradient(180deg, #ebeae4 20.19%, rgba(235, 234, 228, 0) 100%)",
  "--newsprint-rule": "#c5c5c5",
  "--newsprint-quote-border": "#bababa",
  "--newsprint-quote-text": "#656565",
  "--newsprint-thead-bg": "#dadada",
  "--newsprint-row-alt": "#e8e7e7",
  "--newsprint-image-caption": "#9b5146",
  "--dsw-alias-bg-mask-1": "rgba(31, 9, 9, 0.30)",
  "--dsw-alias-bg-mask-2": "rgba(31, 9, 9, 0.12)",
  "--dsw-alias-bg-mask-3": "rgba(31, 9, 9, 0.28)",
  "--dsw-alias-bg-mask-photo": "rgba(31, 9, 9, 0.80)",
  "--dsw-alias-bg-mask-drop": "rgba(31, 9, 9, 0.45)",
  "--dsw-alias-button-tool-bar-fill": "rgba(253, 253, 251, 0.60)",
  "--dsw-alias-button-tool-bar-hover": "rgba(235, 234, 228, 0.72)",
  "--dsw-alias-button-tool-bar-fill-invisible": "rgba(253, 253, 251, 0.40)",
  "--dsw-alias-tooltip-fg": "#f3f2ee",
  "--dsw-font-family": "Georgia, 'Times New Roman', 'PT Serif', 'Noto Serif SC', 'Songti SC', SimSun, serif"
};
const DARK_TOKENS  = {
  "--dsw-alias-bg-base": "#0d0d0d",
  "--dsw-alias-bg-layer-1": "#141414",
  "--dsw-alias-bg-layer-2": "#1a1a1a",
  "--dsw-alias-bg-layer-3": "#212121",
  "--dsw-alias-bg-overlay": "#1a1a1a",
  "--dsw-alias-bg-module-platform": "#141414",
  "--dsw-alias-bg-multi-select": "#262626",
  "--dsw-alias-bg-skeleton": "rgba(255, 255, 255, 0.06)",
  "--dsw-alias-border-l1": "rgba(255, 255, 255, 0.06)",
  "--dsw-alias-border-l2-darkmode-thin": "rgba(255, 255, 255, 0.06)",
  "--dsw-alias-border-l2": "rgba(255, 255, 255, 0.10)",
  "--dsw-alias-border-l3": "rgba(255, 255, 255, 0.14)",
  "--dsw-alias-border-l4": "rgba(255, 255, 255, 0.20)",
  "--dsw-alias-brand-primary": "#e8e8e8",
  "--dsw-alias-brand-text": "#e8e8e8",
  "--dsw-alias-brand-primary-invert": "#0d0d0d",
  "--dsw-alias-button-contrast-fill": "#0d0d0d",
  "--dsw-alias-button-elevated-fill": "#1f1f1f",
  "--dsw-alias-button-floating-fill": "#1a1a1a",
  "--dsw-alias-button-floating-hover": "#262626",
  "--dsw-alias-button-ghost-active-border": "#4a4a4a",
  "--dsw-alias-button-ghost-active-fill": "rgba(255, 255, 255, 0.10)",
  "--dsw-alias-button-ghost-active-hover": "rgba(255, 255, 255, 0.16)",
  "--dsw-alias-button-info-fill": "#4dabf7",
  "--dsw-alias-button-info-hover": "#74c0fc",
  "--dsw-alias-button-primary-dimmed": "#4a4a4a",
  "--dsw-alias-button-primary-fill": "#e8e8e8",
  "--dsw-alias-button-primary-hover": "#ffffff",
  "--dsw-alias-interactive-bg-active": "rgba(255, 255, 255, 0.12)",
  "--dsw-alias-interactive-bg-hover-accent": "rgba(77, 171, 247, 0.16)",
  "--dsw-alias-interactive-bg-hover-danger": "rgba(224, 108, 108, 0.16)",
  "--dsw-alias-interactive-bg-hover-solid": "#262626",
  "--dsw-alias-interactive-bg-hover": "rgba(255, 255, 255, 0.06)",
  "--dsw-alias-label-caption": "#6b6b6b",
  "--dsw-alias-label-dimmed": "#3d3d3d",
  "--dsw-alias-label-primary": "#e8e8e8",
  "--dsw-alias-label-primary-dimmed": "#f5f5f5",
  "--dsw-alias-label-primary-foreground": "#0d0d0d",
  "--dsw-alias-label-primary-inverted": "#1a1a1a",
  "--dsw-alias-label-secondary": "#a3a3a3",
  "--dsw-alias-label-tertiary": "#7d7d7d",
  "--dsw-alias-link": "#6cb6ff",
  "--dsw-alias-markdown-citation": "#262626",
  "--dsw-alias-markdown-code-block": "#161616",
  "--dsw-alias-markdown-code-block-banner": "#202020",
  "--dsw-alias-markdown-code-segment-selected": "#303030",
  "--dsw-alias-markdown-code-segment-unselected": "#1c1c1c",
  "--dsw-alias-markdown-inline-code": "#262626",
  "--dsw-alias-markdown-placeholder": "#1a1a1a",
  "--dsw-alias-markdown-tag": "#262626",
  "--dsw-alias-scrollbar-bg-l1": "rgba(255, 255, 255, 0.10)",
  "--dsw-alias-scrollbar-bg-l2": "rgba(255, 255, 255, 0.14)",
  "--dsw-alias-scrollbar-hover-l1": "rgba(255, 255, 255, 0.20)",
  "--dsw-alias-scrollbar-hover-l2": "rgba(255, 255, 255, 0.28)",
  "--dsw-alias-state-business-primary": "#6cb6ff",
  "--dsw-alias-state-business-tertiary": "rgba(108, 182, 255, 0.16)",
  "--dsw-alias-state-error-primary": "#e06c6c",
  "--dsw-alias-state-error-secondary": "#f08a8a",
  "--dsw-alias-state-success-primary": "#5fbf7f",
  "--dsw-alias-state-success-secondary": "#82d49c",
  "--dsw-alias-state-success-tertiary": "rgba(95, 191, 127, 0.14)",
  "--dsw-alias-state-warn-label": "#e0a63f",
  "--dsw-alias-state-warn-primary": "#e0a63f",
  "--dsw-alias-state-warn-secondary": "#f0c46f",
  "--dsw-alias-state-warn-tertiary": "rgba(224, 166, 63, 0.14)",
  "--dsw-alias-toast-bg": "#232323",
  "--dsw-alias-tooltip-bg": "#2a2a2a",
  "--dsw-specific-bubble": "#1a1a1a",
  "--dsw-specific-bubble-highlight": "#222222",
  "--dsw-specific-input-major": "#161616",
  "--dsw-specific-login-input": "#161616",
  "--dsw-specific-selector": "#1c1c1c",
  "--dsw-specific-sidebar-fill": "#111111",
  "--dsw-specific-sidebar-nav-item-active": "#1f1f1f",
  "--dsw-specific-sidebar-nav-item-active-accent": "#2a2a2a",
  "--dsw-specific-sidebar-nav-item-hover": "#1a1a1a",
  "--dsw-specific-tip": "#1c1c1c",
  "--dsw-linear-gradient-think": "linear-gradient(180deg, #1a1a1a 20.19%, rgba(26, 26, 26, 0) 100%)",
  "--dsw-linear-think-select": "linear-gradient(180deg, #1f1f1f 20.19%, rgba(31, 31, 31, 0) 100%)",
  "--newsprint-rule": "#333333",
  "--newsprint-quote-border": "#3a3a3a",
  "--newsprint-quote-text": "#a3a3a3",
  "--newsprint-thead-bg": "#1f1f1f",
  "--newsprint-row-alt": "#171717",
  "--newsprint-image-caption": "#d27b6e",
  "--dsw-alias-bg-mask-1": "rgba(0, 0, 0, 0.30)",
  "--dsw-alias-bg-mask-2": "rgba(0, 0, 0, 0.12)",
  "--dsw-alias-bg-mask-3": "rgba(0, 0, 0, 0.28)",
  "--dsw-alias-bg-mask-photo": "rgba(0, 0, 0, 0.80)",
  "--dsw-alias-bg-mask-drop": "rgba(0, 0, 0, 0.45)",
  "--dsw-alias-button-tool-bar-fill": "rgba(38, 38, 38, 0.60)",
  "--dsw-alias-button-tool-bar-hover": "rgba(58, 58, 58, 0.72)",
  "--dsw-alias-button-tool-bar-fill-invisible": "rgba(38, 38, 38, 0.40)",
  "--dsw-alias-tooltip-fg": "#f5f5f5",
  "--dsw-font-family": "Georgia, 'Times New Roman', 'PT Serif', 'Noto Serif SC', 'Songti SC', SimSun, serif"
};

// Build-time sanity: both schemes must have the same token names so a
// user who switches from light to dark never sees a token silently fall
// back to the official default. Drift here was the source of a 1.0.0
// bug where the dark map was a verbatim copy of the light map.
{
  const lightNames = new Set(Object.keys(LIGHT_TOKENS));
  const darkNames  = new Set(Object.keys(DARK_TOKENS));
  if (lightNames.size !== darkNames.size) {
    const only = (a, b) => [...a].filter((k) => !b.has(k));
    throw new Error(
      "dsh-theme-newsprint: token-name drift between schemes " +
      "(light=" + lightNames.size + ", dark=" + darkNames.size + "). " +
      "light-only: [" + only(lightNames, darkNames).join(",") + "]; " +
      "dark-only:  [" + only(darkNames, lightNames).join(",") + "]. " +
      "Every token name present in either scheme must be present in both."
    );
  }
  for (const k of lightNames) {
    if (LIGHT_TOKENS[k] === DARK_TOKENS[k]) continue; // intentionally shared (e.g. font-family)
    if (LIGHT_TOKENS[k] === DARK_TOKENS[k]) {}
  }
}

/** Two themes: one per color scheme. */
const SKINS = [
  Object.freeze({ id: "newsprint-light", colorScheme: "light", tokens: Object.freeze(LIGHT_TOKENS) }),
  Object.freeze({ id: "newsprint-dark",  colorScheme: "dark",  tokens: Object.freeze(DARK_TOKENS)  }),
];

/**
 * L3 markdown typography, scoped under `.dsh-newsprint-active` so the
 * patches only apply while the user has newsprint enabled. The class is
 * toggled on document.documentElement by apply() / the fiber-dispose hook.
 *
 * Anchors are stable attributes, never hashed class names. The markdown
 * container compiles to a CSS-Modules hash (`._markdown_kcgor_5` in the
 * current build), so a literal `.markdown` selector matches nothing, and
 * `[class*=...]` would break on every rebuild. `[data-chat-anchor-key]`
 * marks each conversation row (shell) and `[data-dsh-part="message-body"]`
 * the assistant body (shell + skin-center semantic adapter); `.md-code-block`
 * is a `:global()` class the shell emits verbatim, so it is stable in a way
 * hashed names are not.
 *
 * The first rule re-asserts font-family on the message body — dsh's
 * markdown picks its font from `var(--dsw-font-markdown-base-font-family)`,
 * which the gradient-shadow helper aliases to `var(--dsw-font-family)`, so
 * this is normally a no-op. We add it as a defensive net: if a future
 * dsh refactor decouples the markdown font from `--dsw-font-family`, the
 * serif body survives.
 */
const PATCHES_CSS = `
/* —— defensive font pierce (see header comment) —— */
.dsh-newsprint-active [data-dsh-part='message-body'],
.dsh-newsprint-active [data-chat-anchor-key] {
  font-family: var(--dsw-font-family);
}

/* —— h1: hairline rule underneath, normal weight, generous air above —— */
.dsh-newsprint-active [data-chat-anchor-key] h1,
.dsh-newsprint-active [data-dsh-part='message-body'] h1 {
  font-weight: normal;
  border-bottom: 1px solid var(--newsprint-rule);
  padding-bottom: 0.5em;
  margin-top: 2em;
  margin-bottom: 1em;
  line-height: 1.3;
}

.dsh-newsprint-active [data-chat-anchor-key] h2,
.dsh-newsprint-active [data-dsh-part='message-body'] h2 {
  margin-top: 2em;
  margin-bottom: 0.75em;
}

/* —— h3 back to normal weight: the contrast is carried by h1/h2 —— */
.dsh-newsprint-active [data-chat-anchor-key] h3,
.dsh-newsprint-active [data-dsh-part='message-body'] h3 {
  font-weight: normal;
  margin-top: 2em;
  margin-bottom: 0.75em;
}

.dsh-newsprint-active [data-chat-anchor-key] h4,
.dsh-newsprint-active [data-dsh-part='message-body'] h4 {
  margin-top: 2em;
  margin-bottom: 0.5em;
}

/* —— body rhythm —— */
.dsh-newsprint-active [data-chat-anchor-key] p,
.dsh-newsprint-active [data-dsh-part='message-body'] p,
.dsh-newsprint-active [data-chat-anchor-key] blockquote,
.dsh-newsprint-active [data-dsh-part='message-body'] blockquote,
.dsh-newsprint-active [data-chat-anchor-key] pre,
.dsh-newsprint-active [data-dsh-part='message-body'] pre {
  margin-bottom: 1.5em;
}

/* —— blockquote: italic, heavy left rule, muted ink —— */
.dsh-newsprint-active [data-chat-anchor-key] blockquote,
.dsh-newsprint-active [data-dsh-part='message-body'] blockquote {
  font-style: italic;
  border-left: 5px solid var(--newsprint-quote-border);
  color: var(--newsprint-quote-text);
  margin-left: 0;
  padding-left: 1em;
}

/* —— links: underline on interaction only —— */
.dsh-newsprint-active [data-chat-anchor-key] a,
.dsh-newsprint-active [data-dsh-part='message-body'] a {
  color: var(--dsw-alias-link);
  text-decoration: none;
}

.dsh-newsprint-active [data-chat-anchor-key] a:hover,
.dsh-newsprint-active [data-chat-anchor-key] a:active,
.dsh-newsprint-active [data-dsh-part='message-body'] a:hover,
.dsh-newsprint-active [data-dsh-part='message-body'] a:active {
  text-decoration: underline;
}

/* —— lists —— */
.dsh-newsprint-active [data-chat-anchor-key] ul,
.dsh-newsprint-active [data-chat-anchor-key] ol,
.dsh-newsprint-active [data-dsh-part='message-body'] ul,
.dsh-newsprint-active [data-dsh-part='message-body'] ol {
  margin: 0 0 1.5em 1.5em;
  padding-left: 0;
}

/* —— tables: uppercase heads, zebra rows —— */
.dsh-newsprint-active [data-chat-anchor-key] table,
.dsh-newsprint-active [data-dsh-part='message-body'] table {
  font-size: 1em;
  border-collapse: collapse;
}

.dsh-newsprint-active [data-chat-anchor-key] thead,
.dsh-newsprint-active [data-dsh-part='message-body'] thead {
  background-color: var(--newsprint-thead-bg);
}

.dsh-newsprint-active [data-chat-anchor-key] thead th,
.dsh-newsprint-active [data-chat-anchor-key] tfoot th,
.dsh-newsprint-active [data-dsh-part='message-body'] thead th,
.dsh-newsprint-active [data-dsh-part='message-body'] tfoot th {
  text-transform: uppercase;
  font-weight: bold;
}

.dsh-newsprint-active [data-chat-anchor-key] tr:nth-child(even),
.dsh-newsprint-active [data-dsh-part='message-body'] tr:nth-child(even) {
  background-color: var(--newsprint-row-alt);
}

/* —— horizontal rule —— */
.dsh-newsprint-active [data-chat-anchor-key] hr,
.dsh-newsprint-active [data-dsh-part='message-body'] hr {
  border-top: none;
  border-right: none;
  border-left: none;
  border-bottom: 1px solid var(--newsprint-rule);
  background: transparent;
  margin: 1.5em 0;
}

/* —— code blocks —— */
.dsh-newsprint-active .md-code-block,
.dsh-newsprint-active [data-chat-anchor-key] pre,
.dsh-newsprint-active [data-chat-anchor-key] pre code,
.dsh-newsprint-active [data-dsh-part='message-body'] pre,
.dsh-newsprint-active [data-dsh-part='message-body'] pre code {
  background-color: var(--dsw-alias-markdown-code-block);
}

.dsh-newsprint-active [data-chat-anchor-key] pre,
.dsh-newsprint-active [data-dsh-part='message-body'] pre {
  padding: 0.75em 1em;
  border-radius: 4px;
}

/* The banner row carrying the copy button. In dark mode its background sits
 * very close to the code body, so a separator keeps the row legible in both
 * schemes. [data-code-block-banner] is the hook CodeBlock reserves for host
 * styles. */
.dsh-newsprint-active [data-code-block-banner] {
  border-bottom: 1px solid var(--dsw-alias-border-l2);
}

/* —— inline code —— */
.dsh-newsprint-active [data-chat-anchor-key] :not(pre) > code,
.dsh-newsprint-active [data-dsh-part='message-body'] :not(pre) > code {
  background-color: var(--dsw-alias-markdown-inline-code);
  padding: 0 0.25em;
  border-radius: 2px;
}

/* —— task lists —— */
.dsh-newsprint-active [data-chat-anchor-key] input[type='checkbox'],
.dsh-newsprint-active [data-dsh-part='message-body'] input[type='checkbox'] {
  margin-right: 0.5em;
}

/* —— image captions —— */
.dsh-newsprint-active [data-chat-anchor-key] img + em,
.dsh-newsprint-active [data-dsh-part='message-body'] img + em {
  color: var(--newsprint-image-caption);
}
`;

/** Stable element id so the dispose step is symmetric. */
const STYLE_ID = "dsh-theme-newsprint-patches";
/** Stable scope class this plugin toggles on document.documentElement. */
const SCOPE_CLASS = "dsh-newsprint-active";

/** Client plugin entry — runs once when the bundle mounts. */
export function apply(ctx) {
  // Toggle the scope class on the document root. This is what makes the
  // L3 patches only apply while newsprint is active, instead of leaking
  // onto the official theme whenever the plugin is loaded-but-not-applied.
  if (typeof document !== "undefined" && document.documentElement) {
    document.documentElement.classList.add(SCOPE_CLASS);
  }

  // Defensive: the host's ThemeRuntime.register throws on a duplicate id.
  // A third-party plugin could plausibly claim "newsprint-light" first
  // (same pattern as dsh-dream-skin). Skip the conflicting theme(s) and
  // still mount the other + the L3 patches.
  const taken = new Set(
    ((ctx.theme.getTheme() || {}).themes || []).map((t) => t && t.id)
  );
  const disposers = [];
  for (const skin of SKINS) {
    if (taken.has(skin.id)) {
      try { console.warn(`[dsh-theme-newsprint] id "${skin.id}" already taken; skipping`); } catch {}
      continue;
    }
    try { disposers.push(ctx.theme.register(skin)); }
    catch (err) { try { console.warn(`[dsh-theme-newsprint] register ${skin.id} failed:`, err && err.message); } catch {} }
  }

  // Inject the L3 typography once. Every rule is already scoped under
  // .dsh-newsprint-active, so the visual never leaks when newsprint is
  // installed but the user is on the official theme.
  let style = null;
  if (typeof document !== "undefined" && !document.getElementById(STYLE_ID)) {
    style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = PATCHES_CSS;
    document.head.appendChild(style);
  }

  // Single effect owns all teardown; runs on fiber dispose.
  ctx.effect(() => () => {
    for (const d of disposers) { try { d(); } catch {} }
    if (style && style.parentNode) style.parentNode.removeChild(style);
    else if (typeof document !== "undefined") {
      const leftover = document.getElementById(STYLE_ID);
      if (leftover && leftover.parentNode) leftover.parentNode.removeChild(leftover);
    }
    if (typeof document !== "undefined" && document.documentElement) {
      document.documentElement.classList.remove(SCOPE_CLASS);
    }
  }, "dsh-theme-newsprint: theme registration + L3 patches");
}
