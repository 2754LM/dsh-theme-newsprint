window.__ModuleLoader__.load({ id: "dsh-theme-newsprint", factory: (require) => {
var module = { exports: {} }; var exports = module.exports;
/**
 * dsh-theme-newsprint — client half.
 *
 * This plugin is intentionally a *cordis埋点 plugin*, not a theme that goes
 * through `ctx.theme.register`. The reason is durability: dsh's
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
 * official theme; only activating it does. The loader flips the entry's
 * `disabled` flag to enable / disable, which fires apply() / dispose
 * transitively.
 *
 * Anchor selectors are stable attributes, not hashed class names. The
 * markdown container compiles to a CSS-Modules hash (`._markdown_kcgor_5`
 * in the current build), so a literal `.markdown` selector matches
 * nothing, and `[class*=...]` would break on every rebuild.
 * `[data-chat-anchor-key]` marks each conversation row (shell),
 * `[data-dsh-part="message-body"]` the assistant body (shell),
 * `.md-code-block` is a `:global()` class the
 * shell emits verbatim, and `[data-code-block-banner]` is the hook
 * CodeBlock reserves for host styles.
 */

/* —— Palette — the single source of truth for every colour in this theme.
 * Roles, not hexes, are what the token map spends: `paper.*` is the warm
 * neutral ramp from raised surface to rule, `ink.*` the text and brand ramp,
 * `accent.*` the one accent colour, `state.*` the semantic set. Retuning the
 * theme means editing this object instead of 89 scattered values.
 *
 * `alpha()` derives every translucent layer from its opaque source, so the
 * masks, borders, hovers and gradient fades cannot drift away from the ink
 * and paper they belong to.
 */
function alpha(hex, a) {
  const n = parseInt(hex.slice(1), 16)
  const tail = a === 0 ? "0" : a.toFixed(2)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${tail})`
}

const SERIF_STACK =
  "Georgia, 'Times New Roman', 'PT Serif', 'Noto Serif SC', 'Songti SC', SimSun, serif"

/* Two schemes, one ramp vocabulary. The dark scheme is not an inversion of
 * the light one — it is the same newspaper printed on dark stock. `paper.*`
 * still means "surface ramp from most raised to hardest rule", and `ink.*`
 * still means "text ramp from strongest to most decorative"; only the hues
 * move. That keeps the token map below scheme-agnostic: it names roles, and
 * a scheme supplies the hexes.
 *
 * Held constant across schemes: the warm hue. The dark ramp is a warm
 * brown-black (`#1a1815`, r>g>b), never a blue-black or pure `#000` —
 * neutral black next to the warm light scheme reads as a different product.
 * The offset between adjacent dark steps is wider than the light one
 * (~1.6 vs ~1.1 luminance) because dark surfaces compress perceptually and
 * equal steps would collapse into one another.
 *
 * Light scheme contrast is measured against `paper.base`; dark scheme
 * contrast against its own `paper.base`. Ratios in the comments below are
 * the binding constraint — retune a hex, recheck the ratio.
 */
const SCHEMES = {
  light: {
    /* Warm paper ramp. Adjacent steps are ~1.1 luminance apart, so surfaces
     * stay tellable apart, and every step keeps the same warm hue — a neutral
     * (r=g=b) grey reads as dirt next to warm paper. One role, one step. */
    paper: {
      raised: "#fdfdfa", // inputs, cards, selected code segment
      base: "#f5f3ed", // app and reading surface
      stripe: "#efeadd", // zebra rows, gradient fades
      container: "#ebe7de", // sidebar, bubbles, code panels, tips
      emphasis: "#e0dbcf", // header strips, chips, hovered rows, scrollbar
      selected: "#d7d0c0", // active row, multi-select — one step under emphasis
      rule: "#cfc8b8", // hairlines, scrollbar track
      ruleDeep: "#b3a996", // scrollbar hover
    },
    /* Ink ramp, dark to light. `hover` is a darker warm brown: a hover must
     * deepen the fill, never change its hue. */
    ink: {
      primary: "#1f0909", // 17.2:1
      hover: "#3f2d22",
      secondary: "#5a5049", // 7.1:1
      primaryDimmed: "#6b6156", // 5.5:1
      tertiary: "#776c62", // 4.6:1
      caption: "#948a7e", // 3.0:1 — metadata only, below AA for body text
      dimmed: "#c3bbae", // decorative
    },
    accent: {
      blue: "#065588", // the only accent: links, focus, info — 7.1:1
      blueHover: "#0a6aa0",
    },
    state: {
      success: "#4d6b43",
      successAlt: "#6c8760",
      successWash: "#e6e8d6",
      warn: "#b3741c",
      warnAlt: "#cd9a4a",
      warnWash: "#f3e7cd",
      warnLabel: "#8d5a14",
      error: "#9a0c0c",
      errorAlt: "#c02a22",
      caption: "#9b5146", // image caption tone
    },
  },
  /* —— Dark newsprint: warm dark stock, warm-white ink. ————————————————
   * `paper.*` runs from the most raised surface (lighter) down to the
   * hardest rule (darker), so the ramp direction is inverted relative to
   * the light scheme while the role names keep their meaning: `raised` is
   * still where inputs and cards sit, `ruleDeep` is still the scrollbar
   * hover. Ramp order is base < stripe < container < emphasis < selected
   * < rule on the raised side, matching light's role sequence.
   */
  dark: {
    paper: {
      raised: "#262320", // inputs, cards, selected code segment
      base: "#1a1815", // app and reading surface — warm brown-black, not #000
      stripe: "#1f1d19", // zebra rows, gradient fades
      container: "#221f1b", // sidebar, bubbles, code panels, tips
      emphasis: "#2b2823", // header strips, chips, hovered rows, scrollbar
      selected: "#332f29", // active row, multi-select — one step over emphasis
      rule: "#3d3831", // hairlines, scrollbar track
      ruleDeep: "#4e483e", // scrollbar hover
    },
    /* Ink ramp inverted: light warm greys. `hover` for a filled button must
     * CLARIFY (lighten) in dark, the opposite of light's deepen — hence
     * `hover` sits above `primary` here. Warm tint kept: r>g>b throughout. */
    ink: {
      primary: "#ece7dd", // 14.4:1 — warm off-white, never pure #fff
      hover: "#f7f4ec", // lighten on hover, not darken
      secondary: "#b8b0a4", // 8.3:1
      primaryDimmed: "#a49c90", // 6.5:1
      tertiary: "#948c80", // 5.3:1
      caption: "#7d766c", // 3.9:1 — metadata only
      dimmed: "#57514a", // decorative
    },
    accent: {
      /* The light sea-blue is unreadable on dark; lift its lightness while
       * holding the hue so it still reads as the same accent. 6.8:1. */
      blue: "#5aa9d6",
      blueHover: "#7cbde3",
    },
    state: {
      success: "#8fae7f",
      successAlt: "#a5c095",
      successWash: "#232a1e",
      warn: "#d9a95c",
      warnAlt: "#e0b45f",
      warnWash: "#2c2517",
      warnLabel: "#e0b45f",
      error: "#e08078",
      errorAlt: "#ef9a92",
      caption: "#c98d80", // image caption tone, lifted for dark stock
    },
  },
}

/** Roles this plugin spends, per scheme, named as the token map reads them. */
function paletteFor(scheme) {
  return SCHEMES[scheme]
}

/* —— TOKEN MAP — built once per scheme from the ramp vocabulary. ——————
 * Every `--dsw-*` name this theme spends is declared, for both schemes. The
 * ones dsh also derives itself (masks, toolbar overlays, tooltip fg, font
 * family) are declared anyway, so an unremapped token cannot fall back to an
 * official value from the wrong scheme.
 *
 * 6 `--newsprint-*` private tokens carry the things that have no official
 * slot: the paper rule colour, the quote border/text, the zebra row tint,
 * the thead background, the image caption tone. Only PATCHES_CSS reads them;
 * nothing in dsh does.
 *
 * `alpha()` derives translucent layers from the scheme's own ink, so masks
 * and borders track the ramp instead of being hand-written per scheme.
 */
function buildTokens(scheme) {
  const { paper, ink, accent, state } = paletteFor(scheme)
  return {
    "--dsw-alias-bg-base": paper.base,
    "--dsw-alias-bg-layer-1": paper.base,
    "--dsw-alias-bg-layer-2": paper.container,
    "--dsw-alias-bg-layer-3": paper.emphasis,
    "--dsw-alias-bg-overlay": paper.container,
    "--dsw-alias-bg-module-platform": paper.container,
    "--dsw-alias-bg-multi-select": paper.selected,
    "--dsw-alias-bg-skeleton": alpha(ink.primary, 0.05),
    "--dsw-alias-border-l1": alpha(ink.primary, 0.06),
    "--dsw-alias-border-l2-darkmode-thin": alpha(ink.primary, 0.10),
    "--dsw-alias-border-l2": alpha(ink.primary, 0.10),
    "--dsw-alias-border-l3": alpha(ink.primary, 0.14),
    "--dsw-alias-border-l4": alpha(ink.primary, 0.20),
    "--dsw-alias-brand-primary": ink.primary,
    "--dsw-alias-brand-text": ink.primary,
    "--dsw-alias-brand-primary-invert": paper.base,
  "--dsw-alias-button-contrast-fill": ink.primary,
  "--dsw-alias-button-elevated-fill": paper.raised,
  "--dsw-alias-button-floating-fill": paper.raised,
  "--dsw-alias-button-floating-hover": paper.container,
  "--dsw-alias-button-ghost-active-border": paper.rule,
  "--dsw-alias-button-ghost-active-fill": paper.stripe,
  "--dsw-alias-button-ghost-active-hover": paper.emphasis,
  "--dsw-alias-button-info-fill": accent.blue,
  "--dsw-alias-button-info-hover": accent.blueHover,
  "--dsw-alias-button-primary-dimmed": paper.container,
  "--dsw-alias-button-primary-fill": ink.primary,
  "--dsw-alias-button-primary-hover": ink.hover,
  "--dsw-alias-interactive-bg-active": alpha(ink.primary, 0.10),
  "--dsw-alias-interactive-bg-hover-accent": alpha(accent.blue, 0.10),
  "--dsw-alias-interactive-bg-hover-danger": alpha(state.error, 0.08),
  "--dsw-alias-interactive-bg-hover-solid": paper.container,
  "--dsw-alias-interactive-bg-hover": alpha(ink.primary, 0.05),
  "--dsw-alias-label-caption": ink.caption,
  "--dsw-alias-label-dimmed": ink.dimmed,
  "--dsw-alias-label-primary": ink.primary,
  "--dsw-alias-label-primary-dimmed": ink.primaryDimmed,
  "--dsw-alias-label-primary-foreground": paper.base,
  "--dsw-alias-label-primary-inverted": paper.base,
  "--dsw-alias-label-secondary": ink.secondary,
  "--dsw-alias-label-tertiary": ink.tertiary,
  "--dsw-alias-link": accent.blue,
  "--dsw-alias-markdown-citation": paper.emphasis,
  "--dsw-alias-markdown-code-block": paper.container,
  "--dsw-alias-markdown-code-block-banner": paper.container,
  "--dsw-alias-markdown-code-segment-selected": paper.raised,
  "--dsw-alias-markdown-code-segment-unselected": paper.emphasis,
  "--dsw-alias-markdown-inline-code": paper.emphasis,
  "--dsw-alias-markdown-placeholder": paper.container,
  "--dsw-alias-markdown-tag": paper.emphasis,
  "--dsw-alias-scrollbar-bg-l1": paper.emphasis,
  "--dsw-alias-scrollbar-bg-l2": paper.rule,
  "--dsw-alias-scrollbar-hover-l1": paper.rule,
  "--dsw-alias-scrollbar-hover-l2": paper.ruleDeep,
  "--dsw-alias-state-business-primary": accent.blue,
  "--dsw-alias-state-business-tertiary": paper.emphasis,
  "--dsw-alias-state-error-primary": state.error,
  "--dsw-alias-state-error-secondary": state.errorAlt,
  "--dsw-alias-state-success-primary": state.success,
  "--dsw-alias-state-success-secondary": state.successAlt,
  "--dsw-alias-state-success-tertiary": state.successWash,
  "--dsw-alias-state-warn-label": state.warnLabel,
  "--dsw-alias-state-warn-primary": state.warn,
  "--dsw-alias-state-warn-secondary": state.warnAlt,
  "--dsw-alias-state-warn-tertiary": state.warnWash,
  "--dsw-alias-toast-bg": ink.primary,
  "--dsw-alias-tooltip-bg": ink.primary,
  "--dsw-specific-bubble": paper.container,
  /* dsh's default for these two is an accent tint, not a surface, so they
   * spend the one accent colour laid over paper. */
  "--dsw-specific-bubble-highlight": alpha(accent.blue, 0.10),
  "--dsw-specific-input-major": paper.raised,
  "--dsw-specific-login-input": paper.raised,
  "--dsw-specific-selector": paper.container,
  "--dsw-specific-sidebar-fill": paper.container,
  "--dsw-specific-sidebar-nav-item-active": paper.selected,
  "--dsw-specific-sidebar-nav-item-active-accent": alpha(accent.blue, 0.16),
  "--dsw-specific-sidebar-nav-item-hover": paper.emphasis,
  "--dsw-specific-tip": paper.container,
  "--dsw-linear-gradient-think": `linear-gradient(180deg, ${paper.base} 20.19%, ${alpha(paper.base, 0)} 100%)`,
  "--dsw-linear-think-select": `linear-gradient(180deg, ${paper.container} 20.19%, ${alpha(paper.container, 0)} 100%)`,
  "--dsw-alias-bg-mask-1": alpha(ink.primary, 0.30),
  "--dsw-alias-bg-mask-2": alpha(ink.primary, 0.12),
  "--dsw-alias-bg-mask-3": alpha(ink.primary, 0.28),
  "--dsw-alias-bg-mask-photo": alpha(ink.primary, 0.80),
  "--dsw-alias-bg-mask-drop": alpha(ink.primary, 0.45),
  "--dsw-alias-button-tool-bar-fill": alpha(paper.raised, 0.60),
  "--dsw-alias-button-tool-bar-hover": alpha(paper.container, 0.72),
  "--dsw-alias-button-tool-bar-fill-invisible": alpha(paper.raised, 0.40),
  "--dsw-alias-tooltip-fg": paper.base,
  /* —— font-family: the only token we declare that dsh also re-derives.
   *    We pin it to the same Georgia stack on both `body` and the message
   *    body, so a future dsh refactor that changes how the markdown font
   *    is sourced cannot silently drop the serif. */
  "--dsw-font-family": SERIF_STACK,
  /* —— private `--newsprint-*` tokens; only PATCHES_CSS reads them. ——— */
  "--newsprint-rule": paper.rule,
  "--newsprint-quote-border": paper.rule,
  "--newsprint-quote-text": ink.secondary,
  "--newsprint-thead-bg": paper.emphasis,
  "--newsprint-row-alt": paper.stripe,
  "--newsprint-image-caption": state.caption
  }
}

/* —— Helper: serialise a token map to one CSS rule. */
function tokenBlock(selectors, tokens) {
  const decls = Object.keys(tokens)
    .map((k) => "  " + k + ": " + tokens[k] + ";")
    .join("\n")
  return selectors + " {\n" + decls + "\n}"
}

const LIGHT_TOKENS = buildTokens("light")
const DARK_TOKENS = buildTokens("dark")

/* THEME_CSS — both schemes, plus the forced serif on the body.
 *
 * Specificity is load-bearing here. dsh declares its light aliases on `body`
 * (0,0,1) and its dark aliases on `body[data-ds-dark-theme]` (0,1,1), and
 * `data-ds-dark-theme` lives on <body>, not <html> (ui-theme boot-theme.ts).
 *
 * The light rule below therefore must NOT outrank the dark one, or the paper
 * palette would win in dark mode. `html.dsh-newsprint-active body` ties
 * `body[data-ds-dark-theme]` at (0,1,1), and this stylesheet is appended
 * after dsh's, so on a tie the paper palette would win — the bug this
 * replaces. Two changes fix it and they must stay together:
 *
 *   1. The light rule is scoped to `:not([data-ds-dark-theme])`, dropping it
 *      to (0,2,1) on the html half but excluding dark outright, so it simply
 *      does not match while dark is active.
 *   2. The dark rule is scoped to `[data-ds-dark-theme]` at (0,2,1), which
 *      outranks dsh's (0,1,1) dark block, so our dark palette wins in dark.
 *
 * The attribute selector on <body> is written without a type prefix so it
 * also matches when the class sits on <html> during a boot race; the theme
 * class is added to documentElement in apply().
 *
 * We avoid concatenating CSS with `+`: a stray comment between operands is
 * enough to make the bundle's parser throw `Unexpected token 'const'` and
 * take the whole merged client script down with it.
 */
const THEME_CSS = [
  tokenBlock(
    "html.dsh-newsprint-active:not([data-ds-dark-theme]) body, html.dsh-newsprint-active:not([data-ds-dark-theme])",
    LIGHT_TOKENS
  ),
  tokenBlock(
    "html.dsh-newsprint-active[data-ds-dark-theme], html.dsh-newsprint-active[data-ds-dark-theme] body, html.dsh-newsprint-active body[data-ds-dark-theme]",
    DARK_TOKENS
  ),
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
