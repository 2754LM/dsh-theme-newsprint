# Newsprint Serif

A DSH theme plugin. It carries the newspaper typography of [Typora](https://typora.io/)'s `newsprint` theme into the DSH Web GUI.

- **Light** — warm paper `#f3f2ee`, ink text `#1f0909`, a single sea-blue accent `#065588`.
- **Dark** — plain neutral black, with no warm cast.
- **Body** — the whole document switches to a serif stack: Georgia → PT Serif → Noto Serif SC → SimSun.

## Install

Install via [dshmarket](https://github.com/dsh-market/dsh-market) into your `web` profile and restart, or directly:

```sh
dsh plugin --profile web add github:2754LM/dsh-theme-newsprint
```

Open **Settings → Appearance** (or the dshmarket Themes tab) and pick *Newsprint Light* or *Newsprint Dark*.

## What it brings

The character of a newspaper layout is not in its colours but in its **strokes**. So besides replacing both the light and dark palettes outright, the body typography is rebuilt the way a newspaper sets type:

| Element | Treatment |
| --- | --- |
| `h1` | a 1px hairline underneath, normal weight, 2em of air above |
| `h3` | back to normal weight — contrast belongs to h1/h2, not to a bolder ramp |
| `blockquote` | 5px left rule, italic, muted ink |
| `thead th` | uppercase |
| `tr:nth-child(even)` | zebra rows |
| `hr` | a single 1px bottom border |
| links | no underline at rest, underlined on hover |

Pure CSS, no hooks, no executable code is loaded.

## Previews

- `assets/preview-light.png` — the light scheme
- `assets/preview-dark.png` — the dark scheme

## License

[MIT](LICENSE). Every font is referenced from the system by family name; no font files are bundled.
