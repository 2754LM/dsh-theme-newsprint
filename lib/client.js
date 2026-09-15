window.__ModuleLoader__.load({ id: "dsh-theme-newsprint", factory: (require) => {
var module = { exports: {} }; var exports = module.exports;
/**
 * dsh-theme-newsprint — client half (cordis-shim form).
 *
 * This plugin is intentionally a *cordis埋点 plugin*, not a dshmarket theme
 * that goes through `ctx.theme.register`. The reason is durability: dsh's
 * `@deepseek-ai/dsh-client-ui-theme` runtime has been refactored before
 * (e.g. the 0.1.5-rc.2 split that moved sessions/workspaces out of
 * `dsh-client-runtime`), and any plugin that depends on it will break the
 * next time. This one does not: it injects a single `<style>` element on
 * mount and removes it on dispose. No `@deepseek-ai/*` client peer, no
 * theme runtime API, no registry, no JS execution beyond DOM mutation.
 *
 * The only scheme shipped is light (warm paper). The dark scheme is
 * intentionally NOT overridden: dsh's own `[data-ds-dark-theme]` flow
 * takes over, producing the stock neutral-black UI in dark mode. This is
 * deliberate — the user explicitly asked for "warm paper light, plain
 * black dark", and the simplest realisation is to ship one scheme and
 * defer the other to dsh.
 *
 * Scope is gated by a `dsh-newsprint-active` class on
 * `document.documentElement`. The class is added on apply() and removed
 * on the fiber-dispose hook. Every rule in PATCHES_CSS is prefixed with
 * this class, so installing the plugin does not change the look of the
 * official theme; only activating it does. dshmarket's loader flips the
 * plugin entry's `disabled` flag to enable / disable, which fires
 * apply() / dispose transitively.
 *
 * Anchor selectors are stable attributes, not hashed class names. The
 * markdown container compiles to a CSS-Modules hash (`._markdown_kcgor_5`
 * in the current build), so a literal `.markdown` selector matches
 * nothing, and `[class*=...]` would break on every rebuild.
 * `[data-chat-anchor-key]` marks each conversation row (shell),
 * `[data-dsh-part="message-body"]` the assistant body (shell + skin-
 * center semantic adapter), `.md-code-block` is a `:global()` class the
 * shell emits verbatim, and `[data-code-block-banner]` is the hook
 * CodeBlock reserves for host styles.
 */

/* —— LIGHT TOKEN SET — the only scheme this plugin ships. ————————————
 * Two shape notes:
 *   - 95 official `--dsw-*` names are present (the "L1" surface of dsh).
 *     11 of them ("never derived": masks / toolbar overlays / tooltip fg
 *     / font-family) are the compensation that prevents an unremapped
 *     token from falling back to the official light values when dsh's
 *     own runtime forgets to derive them.
 *   - 5 `--newsprint-*` private tokens carry the things that have no
 *     official slot: the paper rule colour, the quote border/text, the
 *     zebra row tint, the thead background, the image caption tone.
 *     Only PATCHES_CSS reads them; nothing in dsh does.
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
  "--dsw-alias-bg-mask-1": "rgba(31, 9, 9, 0.30)",
  "--dsw-alias-bg-mask-2": "rgba(31, 9, 9, 0.12)",
  "--dsw-alias-bg-mask-3": "rgba(31, 9, 9, 0.28)",
  "--dsw-alias-bg-mask-photo": "rgba(31, 9, 9, 0.80)",
  "--dsw-alias-bg-mask-drop": "rgba(31, 9, 9, 0.45)",
  "--dsw-alias-button-tool-bar-fill": "rgba(253, 253, 251, 0.60)",
  "--dsw-alias-button-tool-bar-hover": "rgba(235, 234, 228, 0.72)",
  "--dsw-alias-button-tool-bar-fill-invisible": "rgba(253, 253, 251, 0.40)",
  "--dsw-alias-tooltip-fg": "#f3f2ee",
  /* —— font-family: the only token we declare that dsh also re-derives.
   *    We pin it to the same Georgia stack on both `body` and the message
   *    body, so a future dsh refactor that changes how the markdown font
   *    is sourced cannot silently drop the serif. */
  "--dsw-font-family": "Georgia, 'Times New Roman', 'PT Serif', 'Noto Serif SC', 'Songti SC', SimSun, serif",
  /* —— private `--newsprint-*` tokens; only PATCHES_CSS reads them. ——— */
  "--newsprint-rule": "#c5c5c5",
  "--newsprint-quote-border": "#bababa",
  "--newsprint-quote-text": "#656565",
  "--newsprint-thead-bg": "#dadada",
  "--newsprint-row-alt": "#e8e7e7",
  "--newsprint-image-caption": "#9b5146"
}

/* —— Helper: serialise the token map to a `:root, body { ... }` block. */
function tokenBlock(selectors, tokens) {
  const decls = Object.keys(tokens)
    .map((k) => "  " + k + ": " + tokens[k] + ";")
    .join("\n")
  return selectors + " {\n" + decls + "\n}"
}

/* THEME_CSS: light tokens on html.dsh-newsprint-active and body, plus a
 * forced serif font on the body. The dark scheme is intentionally NOT
 * shipped — dsh's own [data-ds-dark-theme] flow takes over, producing the
 * stock neutral-black UI in dark mode. We avoid concatenating CSS with
 * `+` because a stray comment between the operands is enough to make
 * the bundle's parser throw `Unexpected token 'const'` and take the
 * whole 13MB merged client script down with it. */
const THEME_CSS = [
  tokenBlock("html.dsh-newsprint-active, html.dsh-newsprint-active body", LIGHT_TOKENS),
  "html.dsh-newsprint-active body { font-family: var(--dsw-font-family); }"
].join("\n")

/* —— L3 MARKDOWN TYPOGRAPHY — the newsprint character. ————————————————
 * Every rule is prefixed with `.dsh-newsprint-active` so installing the
 * plugin without enabling it does not leak blockquote italics or
 * uppercase table heads onto the official theme. The class is added by
 * apply() and removed by the fiber-dispose hook.
 */
const PATCHES_CSS = `
/* —— font pierce (defensive — dsh markdown normally inherits from
 *    --dsw-font-family via gradient-shadow.css:87, but we don't trust
 *    that one-line alias to survive the next refactor). */
html.dsh-newsprint-active [data-dsh-part='message-body'],
html.dsh-newsprint-active [data-chat-anchor-key] {
  font-family: var(--dsw-font-family);
}

/* —— h1: hairline rule underneath, normal weight, generous air above */
html.dsh-newsprint-active [data-chat-anchor-key] h1,
html.dsh-newsprint-active [data-dsh-part='message-body'] h1 {
  font-weight: normal;
  border-bottom: 1px solid var(--newsprint-rule);
  padding-bottom: 0.5em;
  margin-top: 2em;
  margin-bottom: 1em;
  line-height: 1.3;
}

html.dsh-newsprint-active [data-chat-anchor-key] h2,
html.dsh-newsprint-active [data-dsh-part='message-body'] h2 {
  margin-top: 2em;
  margin-bottom: 0.75em;
}

/* —— h3 back to normal weight: the contrast is carried by h1/h2 */
html.dsh-newsprint-active [data-chat-anchor-key] h3,
html.dsh-newsprint-active [data-dsh-part='message-body'] h3 {
  font-weight: normal;
  margin-top: 2em;
  margin-bottom: 0.75em;
}

html.dsh-newsprint-active [data-chat-anchor-key] h4,
html.dsh-newsprint-active [data-dsh-part='message-body'] h4 {
  margin-top: 2em;
  margin-bottom: 0.5em;
}

/* —— body rhythm */
html.dsh-newsprint-active [data-chat-anchor-key] p,
html.dsh-newsprint-active [data-dsh-part='message-body'] p,
html.dsh-newsprint-active [data-chat-anchor-key] blockquote,
html.dsh-newsprint-active [data-dsh-part='message-body'] blockquote,
html.dsh-newsprint-active [data-chat-anchor-key] pre,
html.dsh-newsprint-active [data-dsh-part='message-body'] pre {
  margin-bottom: 1.5em;
}

/* —— blockquote: italic, heavy left rule, muted ink */
html.dsh-newsprint-active [data-chat-anchor-key] blockquote,
html.dsh-newsprint-active [data-dsh-part='message-body'] blockquote {
  font-style: italic;
  border-left: 5px solid var(--newsprint-quote-border);
  color: var(--newsprint-quote-text);
  margin-left: 0;
  padding-left: 1em;
}

/* —— links: underline on interaction only */
html.dsh-newsprint-active [data-chat-anchor-key] a,
html.dsh-newsprint-active [data-dsh-part='message-body'] a {
  color: var(--dsw-alias-link);
  text-decoration: none;
}

html.dsh-newsprint-active [data-chat-anchor-key] a:hover,
html.dsh-newsprint-active [data-chat-anchor-key] a:active,
html.dsh-newsprint-active [data-dsh-part='message-body'] a:hover,
html.dsh-newsprint-active [data-dsh-part='message-body'] a:active {
  text-decoration: underline;
}

/* —— lists */
html.dsh-newsprint-active [data-chat-anchor-key] ul,
html.dsh-newsprint-active [data-chat-anchor-key] ol,
html.dsh-newsprint-active [data-dsh-part='message-body'] ul,
html.dsh-newsprint-active [data-dsh-part='message-body'] ol {
  margin: 0 0 1.5em 1.5em;
  padding-left: 0;
}

/* —— tables: uppercase heads, zebra rows */
html.dsh-newsprint-active [data-chat-anchor-key] table,
html.dsh-newsprint-active [data-dsh-part='message-body'] table {
  font-size: 1em;
  border-collapse: collapse;
}

html.dsh-newsprint-active [data-chat-anchor-key] thead,
html.dsh-newsprint-active [data-dsh-part='message-body'] thead {
  background-color: var(--newsprint-thead-bg);
}

html.dsh-newsprint-active [data-chat-anchor-key] thead th,
html.dsh-newsprint-active [data-chat-anchor-key] tfoot th,
html.dsh-newsprint-active [data-dsh-part='message-body'] thead th,
html.dsh-newsprint-active [data-dsh-part='message-body'] tfoot th {
  text-transform: uppercase;
  font-weight: bold;
}

html.dsh-newsprint-active [data-chat-anchor-key] tr:nth-child(even),
html.dsh-newsprint-active [data-dsh-part='message-body'] tr:nth-child(even) {
  background-color: var(--newsprint-row-alt);
}

/* —— horizontal rule */
html.dsh-newsprint-active [data-chat-anchor-key] hr,
html.dsh-newsprint-active [data-dsh-part='message-body'] hr {
  border-top: none;
  border-right: none;
  border-left: none;
  border-bottom: 1px solid var(--newsprint-rule);
  background: transparent;
  margin: 1.5em 0;
}

/* —— code blocks */
html.dsh-newsprint-active .md-code-block,
html.dsh-newsprint-active [data-chat-anchor-key] pre,
html.dsh-newsprint-active [data-chat-anchor-key] pre code,
html.dsh-newsprint-active [data-dsh-part='message-body'] pre,
html.dsh-newsprint-active [data-dsh-part='message-body'] pre code {
  background-color: var(--dsw-alias-markdown-code-block);
}

html.dsh-newsprint-active [data-chat-anchor-key] pre,
html.dsh-newsprint-active [data-dsh-part='message-body'] pre {
  padding: 0.75em 1em;
  border-radius: 4px;
}

/* [data-code-block-banner] is the hook CodeBlock reserves for host
 * styles. The banner row sits very close to the code body in some
 * schemes, so a separator keeps the row legible. */
html.dsh-newsprint-active [data-code-block-banner] {
  border-bottom: 1px solid var(--dsw-alias-border-l2);
}

/* —— inline code */
html.dsh-newsprint-active [data-chat-anchor-key] :not(pre) > code,
html.dsh-newsprint-active [data-dsh-part='message-body'] :not(pre) > code {
  background-color: var(--dsw-alias-markdown-inline-code);
  padding: 0 0.25em;
  border-radius: 2px;
}

/* —— task lists */
html.dsh-newsprint-active [data-chat-anchor-key] input[type='checkbox'],
html.dsh-newsprint-active [data-dsh-part='message-body'] input[type='checkbox'] {
  margin-right: 0.5em;
}

/* —— image captions */
html.dsh-newsprint-active [data-chat-anchor-key] img + em,
html.dsh-newsprint-active [data-dsh-part='message-body'] img + em {
  color: var(--newsprint-image-caption);
}
`

/* —— Stable element id so the dispose step is symmetric. */
const STYLE_ID = "dsh-theme-newsprint-styles"
const SCOPE_CLASS = "dsh-newsprint-active"

/** Client plugin entry — runs once when the cordis loader mounts the entry. */
function apply(ctx) {
  try {
    if (typeof document === "undefined" || !document.documentElement) {
      // SSR or pre-document — nothing we can do.
      return
    }
    document.documentElement.classList.add(SCOPE_CLASS)

    let style = null
    if (!document.getElementById(STYLE_ID)) {
      style = document.createElement("style")
      style.id = STYLE_ID
      style.textContent = THEME_CSS + PATCHES_CSS
      document.head.appendChild(style)
    }

    // Single effect owns all teardown; runs on fiber dispose.
    ctx.effect(() => () => {
      if (style && style.parentNode) style.parentNode.removeChild(style)
      else if (typeof document !== "undefined") {
        const leftover = document.getElementById(STYLE_ID)
        if (leftover && leftover.parentNode) leftover.parentNode.removeChild(leftover)
      }
      if (document.documentElement) {
        document.documentElement.classList.remove(SCOPE_CLASS)
      }
    }, "dsh-theme-newsprint: token remap + L3 patches (cordis-shim)")
  } catch (err) {
    try { console.warn("[dsh-theme-newsprint] apply failed:", err && err.message) } catch {}
  }
}

exports.apply = apply;
return module.exports; } });
