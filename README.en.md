# Newsprint Serif

A DSH theme plugin. It carries the newspaper typography of [Typora](https://typora.io/)'s `newsprint` theme into the DSH Web GUI. Pure CSS, no hooks, no image assets.

![Light](assets/preview-light.png)

- **Light** — warm paper `#f5f3ed`, ink text `#1f0909`, a single sea-blue accent `#065588`; the neutrals are one eight-step warm paper ramp, below.
- **Dark** — a warm dark newsprint: stock `#1a1815` (warm brown-black, neither `#000` nor blue-black), warm-white ink `#ece7dd`, accent lifted to `#5aa9d6`. The newsprint character is kept rather than deferred to the stock neutral black.
- **Body** — the whole document switches to a serif stack: Georgia → PT Serif → Noto Serif SC → SimSun.

## Palette

Both schemes share one **role vocabulary** (`paper.*` is the surface ramp from most raised to hardest rule, `ink.*` the text ramp from strongest to most decorative); the colours live in `SCHEMES` in `lib/client.js`, so retuning one value moves the whole app. The token map is built by `buildTokens(scheme)`, so each scheme generates its own set from the same role names.

| Step | Value | Used for |
| --- | --- | --- |
| `raised` | `#fdfdfa` | inputs, cards, the selected code segment |
| `base` | `#f5f3ed` | app background and reading surface |
| `stripe` | `#efeadd` | zebra rows, gradient fades |
| `container` | `#ebe7de` | sidebar, bubbles, code panels |
| `emphasis` | `#e0dbcf` | header strips, inline code, hovered rows, scrollbar |
| `selected` | `#d7d0c0` | active row, multi-select |
| `rule` | `#cfc8b8` | hairlines, scrollbar track |
| `ruleDeep` | `#b3a996` | scrollbar hover |

Ink ramp, with contrast against `base`: primary `#1f0909` 17.2:1, secondary `#5a5049` 7.1:1, dimmed primary `#6b6156` 5.5:1, tertiary `#776c62` 4.6:1, caption `#948a7e` 3.0:1 (metadata only), decorative `#c3bbae`.

The single accent is the sea blue `#065588` (7.1:1), reserved for links, focus and the info state; the brand colour and the primary button are ink, deepening to `#3f2d22` on hover; green, amber and red are all desaturated to a printing-ink register.

Two hard rules: **every neutral must be a step of the warm paper ramp above — a true neutral grey (r=g=b) reads as dirt on warm paper**; and **every translucent colour is derived from its opaque source by `alpha()`, never a hand-written rgba**.

## Install

This plugin is standalone: it depends on no market, skin center, or third-party store. It is an ordinary profile bundle, installed with `dsh plugin` alone.

```sh
# from the repository
dsh plugin --profile web add github:2754LM/dsh-theme-newsprint

# or the prebuilt tarball (no full-repo download)
dsh plugin --profile web add https://github.com/2754LM/dsh-theme-newsprint/releases/latest/download/dsh-theme-newsprint.tgz
```

Refresh the page afterwards; if the theme does not appear, restart dsh once (the bundle list is read at startup).

## Enable / disable / uninstall

- **Disable / re-enable**: edit `~/.dsh/profiles/web/cordis.patch.yml`

  ```yaml
  - id: newsprint
    disabled: true    # true to disable; false or delete the row to enable
  ```

  The loader hot-reloads. With the plugin installed but not enabled, dsh looks exactly like the stock theme — no typography leaks.
- **Uninstall**:

  ```sh
  dsh plugin --profile web remove dsh-theme-newsprint
  ```

> Multiple themes: two enabled themes stack on each other. Keep exactly one enabled and write `disabled: true` for the rest.

## What it brings

The character of a newspaper layout is not in its colours but in its **strokes**. So besides the light palette swap, the body typography is rebuilt the way a newspaper sets type:

| Element | Treatment |
| --- | --- |
| `h1` | a 1px hairline underneath, normal weight, 2em of air above |
| `h3` | back to normal weight — contrast belongs to h1/h2, not to a bolder ramp |
| `blockquote` | 5px left rule, italic, muted ink |
| `thead th` | uppercase |
| `tr:nth-child(even)` | zebra rows |
| `hr` | a single 1px bottom border |
| links | no underline at rest, underlined on hover |
| code blocks | official `--dsw-alias-markdown-code-block` + 1px separator under the banner |
| inline code | official `--dsw-alias-markdown-inline-code` |
| task lists | checkbox with 0.5em right margin |
| image captions | a muted brick-red (private `--newsprint-image-caption`) |

The serif font reaches the body via two paths so neither depends on an undocumented dsh internals line:

1. `font-family: var(--dsw-font-family)` on `body` (chrome picks it up);
2. explicit `font-family` on `[data-dsh-part='message-body']` and `[data-chat-anchor-key']` (markdown picks it up), so a future dsh refactor of `var(--dsw-font-markdown-base-font-family)` cannot silently drop the serif.

Anchor selectors are stable attributes, not hashed class names. `.markdown` is a CSS-Modules class that compiles to a hash (`._markdown_kcgor_5` in the current build), so a literal `.markdown` selector matches nothing, and `[class*=...]` would break on every rebuild. `[data-chat-anchor-key]`, `[data-dsh-part="message-body"]`, `.md-code-block`, and `[data-code-block-banner]` are all stable.

## Form

A `cordis instrumented plugin`: `package.json` declares `dsh.bundle.patch` (its own `cordis.patch.yml`, which inserts the loader entry `id: newsprint`) and `dsh.client` (platform web). It does **not** depend on `@deepseek-ai/dsh-client-ui-theme`, does **not** call `ctx.theme.register()`, and has no runtime dependency on any market or skin center.

The host half's `apply()` is a no-op; the client half does one thing: append a single `<style id="dsh-theme-newsprint-styles">` element to `<head>` with the light tokens + L3 typography, and add a `dsh-newsprint-active` class on `html` to scope it. The fiber-dispose hook removes the class and the `<style>`.

The benefit is durability against dsh client-topology refactors. When `dsh-client-runtime` was split into the two `dsh-api-*` controllers in 0.1.5-rc.2, every plugin that went through `ctx.theme` broke (services collided at fiber time). This plugin only injects CSS into the DOM, so it is immune. The cost is that no "light/dark" picker of the theme runtime can drive it, so the scheme is decided in CSS instead: dsh writes `data-ds-dark-theme` on `<body>` (`boot-theme.ts` in `ui-theme`), and this plugin branches on that attribute without subscribing to any theme service. That is also why the two schemes must handle specificity carefully — the dark block and the light block carry the same specificity by default, so they are separated with `:not()` and an explicit attribute selector.

## License

[MIT](LICENSE). Every font is referenced from the system by family name; no font files are bundled.
