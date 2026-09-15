# 报纸衬线 · Newsprint Serif

一个 DSH 主题插件。把 [Typora](https://typora.io/) `newsprint` 主题的报纸排版气质搬进 DSH Web GUI。

- **亮色** — 暖白纸张 `#f3f2ee`，墨色正文 `#1f0909`，全篇只有一个海蓝强调色 `#065588`。
- **暗色** — 纯黑中性灰，不带暖调。
- **正文** — 整套换成衬线栈：Georgia → PT Serif → 思源宋体 → 宋体。

## 安装

通过 [dshmarket](https://github.com/dsh-market/dsh-market) 装入 `web` profile 后重启，或直接用 CLI：

```sh
dsh plugin --profile web add github:2754LM/dsh-theme-newsprint
```

打开「设置 → 外观」或 dshmarket 主题页，把 *Newsprint Light* 或 *Newsprint Dark* 选为当前主题即可。

## 它带来了什么

报纸版面的性格不在配色上，而在**笔画**上。所以除了把亮、暗两档配色整套换掉，正文排版也按报纸重做：

| 元素 | 处理 |
| --- | --- |
| `h1` | 下方一条 1px 细线，常规字重，上方留 2em |
| `h3` | 回到常规字重 — 对比交给 h1/h2，而不是逐级加粗 |
| `blockquote` | 5px 粗左边框 + 斜体 + 弱化墨色 |
| `thead th` | 大写 |
| `tr:nth-child(even)` | 斑马行 |
| `hr` | 只留一条 1px 底线 |
| 链接 | 静止无下划线，悬停才出现 |

纯 CSS，无 hooks，不加载任何可执行代码。

## 预览图

- `assets/preview-light.png` — 亮色档
- `assets/preview-dark.png` — 暗色档

## 许可

[MIT](LICENSE)。字体均调用系统已有的字族，不内嵌任何字体文件。
