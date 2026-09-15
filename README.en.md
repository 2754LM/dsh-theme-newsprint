# Newsprint Serif

A DSH theme plugin. It carries the newspaper typography of [Typora](https://typora.io/)'s `newsprint` theme into the DSH Web GUI. Pure CSS, no hooks, no image assets.

![Light](assets/preview-light.png)

- **Light** — warm paper `#f3f2ee`, ink text `#1f0909`, a single sea-blue accent `#065588`.
- **Dark** — no second palette is shipped. dsh's own `[data-ds-dark-theme]` flow takes over and gives you the stock neutral-black dark mode, with the same typographic treatment.
- **Body** — the whole document switches to a serif stack: Georgia → PT Serif → Noto Serif SC → SimSun.

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

The benefit is durability against dsh client-topology refactors. When `dsh-client-runtime` was split into the two `dsh-api-*` controllers in 0.1.5-rc.2, every plugin that went through `ctx.theme` broke (services collided at fiber time). This plugin only injects CSS into the DOM, so it is immune. The cost is that we cannot hook into dshmarket's "light/dark theme" picker — so the dark scheme is simply delegated to dsh's official dark.

## License

[MIT](LICENSE). Every font is referenced from the system by family name; no font files are bundled.
