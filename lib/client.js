/**
 * dsh-theme-newsprint — client half.
 *
 * Registers two themes with the dsh-client-ui-theme runtime:
 *   - newsprint-light (warm paper)
 *   - newsprint-dark  (plain neutral black)
 * and injects the L3 markdown typography as a single <style> element. The
 * disposers from ctx.theme.register() plus the style removal run on the
 * plugin's fiber dispose (when dshmarket flips `disabled: true` or the
 * plugin is removed), so a clean uninstall restores the official look.
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

/** Two themes: one per color scheme. */
const SKINS = [
  Object.freeze({ id: "newsprint-light", colorScheme: "light", tokens: LIGHT_TOKENS }),
  Object.freeze({ id: "newsprint-dark",  colorScheme: "dark",  tokens: DARK_TOKENS  }),
];

/** L3 markdown typography — the newsprint character lives in these strokes. */
const PATCHES_CSS = `/**
 * Newsprint Serif (报纸衬线) — L3 free-selector patches.
 *
 * The loader force-scopes everything here under \`html[data-dsh-skin="newsprint"]\`,
 * which lifts each rule one class-step above the shell's own sheets. That lift is
 * load-bearing: the official markdown rules are \`._markdown_<hash> h1\` (0,1,1),
 * so an unscoped rule of equal specificity would be decided by source order alone.
 *
 * Anchors are stable attributes, never hashed class names. The markdown container
 * compiles to a CSS-Modules hash (\`._markdown_kcgor_5\` in the current build), so a
 * literal \`.markdown\` selector matches nothing, and \`[class*=...]\` would break on
 * every rebuild. \`[data-chat-anchor-key]\` marks each conversation row (shell) and
 * \`[data-dsh-part="message-body"]\` the assistant body (shell + skin-center
 * semantic adapter); \`.md-code-block\` is a \`:global()\` class the shell emits
 * verbatim, so it is stable in a way hashed names are not.
 *
 * These rules are the Typora newsprint signature: a hairline under h1, normal-weight
 * h3 against weighted h1/h2, a heavy left rule on blockquotes, uppercase table heads
 * and zebra rows. Every colour is a skin token, so both schemes follow automatically.
 */

/* —— h1: hairline rule underneath, normal weight, generous air above —— */
[data-chat-anchor-key] h1,
[data-dsh-part='message-body'] h1 {
  font-weight: normal;
  border-bottom: 1px solid var(--newsprint-rule);
  padding-bottom: 0.5em;
  margin-top: 2em;
  margin-bottom: 1em;
  line-height: 1.3;
}

[data-chat-anchor-key] h2,
[data-dsh-part='message-body'] h2 {
  margin-top: 2em;
  margin-bottom: 0.75em;
}

/* —— h3 back to normal weight: the contrast is carried by h1/h2 —— */
[data-chat-anchor-key] h3,
[data-dsh-part='message-body'] h3 {
  font-weight: normal;
  margin-top: 2em;
  margin-bottom: 0.75em;
}

[data-chat-anchor-key] h4,
[data-dsh-part='message-body'] h4 {
  margin-top: 2em;
  margin-bottom: 0.5em;
}

/* —— body rhythm —— */
[data-chat-anchor-key] p,
[data-dsh-part='message-body'] p,
[data-chat-anchor-key] blockquote,
[data-dsh-part='message-body'] blockquote,
[data-chat-anchor-key] pre,
[data-dsh-part='message-body'] pre {
  margin-bottom: 1.5em;
}

/* —— blockquote: italic, heavy left rule, muted ink —— */
[data-chat-anchor-key] blockquote,
[data-dsh-part='message-body'] blockquote {
  font-style: italic;
  border-left: 5px solid var(--newsprint-quote-border);
  color: var(--newsprint-quote-text);
  margin-left: 0;
  padding-left: 1em;
}

/* —— links: underline on interaction only —— */
[data-chat-anchor-key] a,
[data-dsh-part='message-body'] a {
  color: var(--dsw-alias-link);
  text-decoration: none;
}

[data-chat-anchor-key] a:hover,
[data-chat-anchor-key] a:active,
[data-dsh-part='message-body'] a:hover,
[data-dsh-part='message-body'] a:active {
  text-decoration: underline;
}

/* —— lists —— */
[data-chat-anchor-key] ul,
[data-chat-anchor-key] ol,
[data-dsh-part='message-body'] ul,
[data-dsh-part='message-body'] ol {
  margin: 0 0 1.5em 1.5em;
  padding-left: 0;
}

/* —— tables: uppercase heads, zebra rows —— */
[data-chat-anchor-key] table,
[data-dsh-part='message-body'] table {
  font-size: 1em;
  border-collapse: collapse;
}

[data-chat-anchor-key] thead,
[data-dsh-part='message-body'] thead {
  background-color: var(--newsprint-thead-bg);
}

[data-chat-anchor-key] thead th,
[data-chat-anchor-key] tfoot th,
[data-dsh-part='message-body'] thead th,
[data-dsh-part='message-body'] tfoot th {
  text-transform: uppercase;
  font-weight: bold;
}

[data-chat-anchor-key] tr:nth-child(even),
[data-dsh-part='message-body'] tr:nth-child(even) {
  background-color: var(--newsprint-row-alt);
}

/* —— horizontal rule —— */
[data-chat-anchor-key] hr,
[data-dsh-part='message-body'] hr {
  border-top: none;
  border-right: none;
  border-left: none;
  border-bottom: 1px solid var(--newsprint-rule);
  background: transparent;
  margin: 1.5em 0;
}

/* —— code blocks —— */
.md-code-block,
[data-chat-anchor-key] pre,
[data-chat-anchor-key] pre code,
[data-dsh-part='message-body'] pre,
[data-dsh-part='message-body'] pre code {
  background-color: var(--dsw-alias-markdown-code-block);
}

[data-chat-anchor-key] pre,
[data-dsh-part='message-body'] pre {
  padding: 0.75em 1em;
  border-radius: 4px;
}

/* The banner row carrying the copy button. In dark mode its background sits very
 * close to the code body, so a separator keeps the row legible in both schemes.
 * [data-code-block-banner] is the hook CodeBlock reserves for host styles. */
[data-code-block-banner] {
  border-bottom: 1px solid var(--dsw-alias-border-l2);
}

/* —— inline code —— */
[data-chat-anchor-key] :not(pre) > code,
[data-dsh-part='message-body'] :not(pre) > code {
  background-color: var(--dsw-alias-markdown-inline-code);
  padding: 0 0.25em;
  border-radius: 2px;
}

/* —— task lists —— */
[data-chat-anchor-key] input[type='checkbox'],
[data-dsh-part='message-body'] input[type='checkbox'] {
  margin-right: 0.5em;
}

/* —— image captions —— */
[data-chat-anchor-key] img + em,
[data-dsh-part='message-body'] img + em {
  color: var(--newsprint-image-caption);
}
`;

/** Stable element id so the dispose step is symmetric. */
const STYLE_ID = "dsh-theme-newsprint-patches";

/** Client plugin entry — runs once when the bundle mounts. */
export function apply(ctx) {
  // Defensive: the host's ThemeRuntime.register throws on a duplicate id.
  // A third-party plugin could plausibly claim "newsprint-light" first
  // (same pattern as dsh-dream-skin). Skip the conflicting theme(s) and
  // still mount the others + the L3 patches.
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

  // Inject the L3 typography once. The selector set anchors on stable
  // data-attributes (data-chat-anchor-key / data-dsh-part="message-body" /
  // .md-code-block) so it does not collide with the hashed CSS-Modules
  // .markdown class the official shell compiles to.
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
  }, "dsh-theme-newsprint: theme registration + L3 patches");
}
