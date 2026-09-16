# 报纸衬线 · Newsprint Serif

一个 DSH 主题插件，把 [Typora](https://typora.io/) `newsprint` 主题的报纸排版气质搬进 DSH Web GUI。纯 CSS，无 hooks，无图片资产。

![亮色](assets/preview-light.png)

- **亮色** — 暖白纸张 `#f5f3ed`，墨色正文 `#1f0909`，全篇只有一个海蓝强调色 `#065588`；中性色是一份 8 档暖纸阶，见下。
- **暗色** — 暖调暗色报纸：底色 `#1a1815`（暖褐黑，不是 `#000`，也不是蓝黑），暖白墨色 `#ece7dd`，强调色提亮为 `#5aa9d6`。报纸性格保留，不是官方中性黑的直接落地。
- **正文** — 整套换成衬线栈：Georgia → PT Serif → 思源宋体 → 宋体。

## 配色

两套方案共用同一套**角色名**（`paper.*` 是「从最浮起到最硬的线」的表面阶，`ink.*` 是「从最强到最装饰」的墨阶），颜色收敛在 `lib/client.js` 的 `SCHEMES`，改一个值全局跟着走。token 映射写成 `buildTokens(scheme)`，两套方案各生成一份，角色名不重复。

暖纸阶（`SCHEMES.light.paper`）：

| 档 | 值 | 用途 |
| --- | --- | --- |
| `raised` | `#fdfdfa` | 输入框、卡片、选中的代码页签 |
| `base` | `#f5f3ed` | 应用底色与阅读面 |
| `stripe` | `#efeadd` | 斑马行、渐变收尾 |
| `container` | `#ebe7de` | 侧栏、气泡、代码块面板 |
| `emphasis` | `#e0dbcf` | 表头、行内代码、悬停行、滚动条 |
| `selected` | `#d7d0c0` | 选中行、多选高亮 |
| `rule` | `#cfc8b8` | 细线、滚动条槽 |
| `ruleDeep` | `#b3a996` | 滚动条悬停 |

暖暗纸阶（`SCHEMES.dark.paper`），角色顺序与亮色一致，方向相反：

| 档 | 值 | 用途 |
| --- | --- | --- |
| `raised` | `#262320` | 输入框、卡片、选中的代码页签 |
| `base` | `#1a1815` | 应用底色与阅读面 |
| `stripe` | `#1f1d19` | 斑马行、渐变收尾 |
| `container` | `#221f1b` | 侧栏、气泡、代码块面板 |
| `emphasis` | `#2b2823` | 表头、行内代码、悬停行、滚动条 |
| `selected` | `#332f29` | 选中行、多选高亮 |
| `rule` | `#3d3831` | 细线、滚动条槽 |
| `ruleDeep` | `#4e483e` | 滚动条悬停 |

墨阶（括号内为对各自 `base` 的对比度）：

| 角色 | 亮色 | 暗色 |
| --- | --- | --- |
| 正文 `primary` | `#1f0909` (17.2:1) | `#ece7dd` (14.4:1) |
| 次级 `secondary` | `#5a5049` (7.1:1) | `#b8b0a4` (8.3:1) |
| 弱化 `primaryDimmed` | `#6b6156` (5.5:1) | `#a49c90` (6.5:1) |
| 三级 `tertiary` | `#776c62` (4.6:1) | `#948c80` (5.3:1) |
| 题注 `caption` | `#948a7e` (3.0:1) | `#7d766c` (3.9:1) |
| 装饰 `dimmed` | `#c3bbae` | `#57514a` |

唯一强调色是海蓝，亮色 `#065588`（7.1:1），暗色提亮到 `#5aa9d6`（6.8:1）——同一个色相，只是暗底上必须提亮度才读得出来。品牌色和主按钮用墨色；悬停方向随方案反转：亮色**加深**（`#3f2d22`），暗色**提亮**（`#f7f4ec`），因为填充按钮的悬停要更清晰、不是更浑浊。绿 / 琥珀 / 红一律降饱和到印刷油墨档。

三条硬约束：**中性色必须落在暖阶里——纯中性灰（r=g=b）放在暖纸上会显脏，放在暖暗底上会发蓝**；**半透明色一律由 `alpha()` 从当前方案的墨色派生，不手写 rgba**；**题注档（约 3–4:1）只用于元信息，不得用于正文**。

暗色不是亮色的机械反转：底色是暖褐黑而非 `#000`，墨色是暖白而非 `#fff`，暗阶间距比亮阶更宽（约 1.6 vs 1.1 亮度），因为暗色表面在感知上会被压缩，等距会糊成一片。

## 安装

本插件独立，不依赖任何市场、皮肤中心或第三方商店——它就是一个普通的 profile bundle，只用 `dsh plugin` 装。

```sh
# 从仓库装
dsh plugin --profile web add github:2754LM/dsh-theme-newsprint

# 或装预构建包（不拉整个仓库）
dsh plugin --profile web add https://github.com/2754LM/dsh-theme-newsprint/releases/latest/download/dsh-theme-newsprint.tgz
```

装完刷新页面；若主题没出现，重启一次 dsh（bundle 列表在启动时读取）。

## 开发

改配色的最快路径：只改 `lib/client.js` 里的 `SCHEMES`。两套方案共用 `buildTokens()` 的角色映射，所以一个角色只改一处。

改完刷新浏览器即可。插件的 `<style>` 是客户端挂载时注入的，profile 默认 `patchReload: live`，所以**普通刷新就生效，不需要重启 dsh**；只有改动 bundle 列表（`package.json` 的 `dsh.profile.bundles`）或增删插件时才需要重启。

回归测试在真实浏览器里校验两套方案（含排版笔画与 token 翻转），需要本机有 Chrome：

```sh
npm test
```

若 `ws` 不在本包旁边，用 `DSH_ROOT` 指向任一带 `ws` 的 checkout（脚本会从它的 pnpm store 里找）：

```sh
DSH_ROOT=/path/to/deepseek-harness npm test
```

## 启用 / 停用 / 卸载

- **停用 / 重新启用**：编辑 `~/.dsh/profiles/web/cordis.patch.yml`

  ```yaml
  - id: newsprint
    disabled: true    # true = 停用；false 或删掉这一行 = 启用
  ```

  加载器会热重载。装上但未启用时，DSH 整页与官方主题完全一致，没有任何排版泄露。
- **卸载**：

  ```sh
  dsh plugin --profile web remove dsh-theme-newsprint
  ```

> 多主题并存：同时启用两个主题会互相叠加，只留一个启用，其余写上 `disabled: true`。

## 它带来了什么

报纸版面的性格不在配色上，而在**笔画**上。除了把两档配色整套换掉，正文排版也按报纸重做（笔画规则与方案无关，亮暗共用；颜色走 `--newsprint-*` 私有 token，故换档时自动跟着变）：

| 元素 | 处理 |
| --- | --- |
| `h1` | 下方一条 1px 细线，常规字重，上方留 2em |
| `h3` | 回到常规字重 — 对比交给 h1/h2，而不是逐级加粗 |
| `blockquote` | 5px 粗左边框 + 斜体 + 弱化墨色 |
| `thead th` | 大写 |
| `tr:nth-child(even)` | 斑马行 |
| `hr` | 只留一条 1px 底线 |
| 链接 | 静止无下划线，悬停才出现 |
| 代码块 | 用官方 `--dsw-alias-markdown-code-block`，加 `1px` 下边线隔开 banner |
| 行内代码 | 用官方 `--dsw-alias-markdown-inline-code` |
| 任务列表 | checkbox 留 0.5em 右内边距 |
| 图片题注 | 暗砖红调（私有 `--newsprint-image-caption`） |

字体穿透到正文走两条路：

1. `body` 上设 `font-family: var(--dsw-font-family)`（chrome 走这条）；
2. `[data-dsh-part='message-body']` 和 `[data-chat-anchor-key]` 上显式再设一次（markdown 走这条），不赌 DSH 内部那条 `var(--dsw-font-markdown-base-font-family)` 链路以后会不会被重构掉。

锚点选的是稳定属性（`[data-chat-anchor-key]` / `[data-dsh-part='message-body']` / `.md-code-block` / `[data-code-block-banner]`），不选 `.markdown` 哈希类（那玩意编译后会变 `_markdown_<hash>`，字面量选择器永远落空）。

## 形态

`cordis 埋点插件`：package.json 里声明 `dsh.bundle.patch`（自带 `cordis.patch.yml`，插入 loader 条目 `id: newsprint`）与 `dsh.client`（web 平台）。**不依赖** `@deepseek-ai/dsh-client-ui-theme` 运行时，也不调 `ctx.theme.register()`，没有任何市场侧或皮肤中心的运行时依赖。

宿主半边 `apply()` 是空实现；client 半边只做一件事：往 `<head>` 塞一个 `<style id="dsh-theme-newsprint-styles">`（亮档 token + 暗档 token + L3 排版），并在 `html` 上加 `dsh-newsprint-active` 类把作用域限住；fiber dispose 时移除 class 与 `<style>`。

好处是抗 DSH client 拓扑变更——`dsh-client-runtime` 被拆成 controller 那次（0.1.5-rc.2），所有走 `ctx.theme` 的主题插件都翻车了；本插件只往 DOM 注 CSS，免疫。代价是拿不到主题运行时那套亮/暗档切换 API，于是**暗档由 CSS 自己判**：DSH 把 `data-ds-dark-theme` 写在 `<body>` 上（`ui-theme` 的 `boot-theme.ts`），本插件就用属性选择器分流，不去订阅任何主题服务。这也是为什么两个方案的规则必须小心处理特异性：`data-ds-dark-theme` 的暗色块与亮色块同特异性，只能靠 :not() 与显式属性选择器分流。

## 许可

[MIT](LICENSE)。字体均调用系统已有的字族，不内嵌任何字体文件。
