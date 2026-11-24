# Changelog

## 0.3.0 — 2026-11-24

- 根据用户反馈，框架语言开关调整为外层36px「汉/原」可拖动贴边控件、独立26px圆形 `span` 底座；最新要求为固定底色 `#ED6D8F`、深色文字 `#3c2030`、14px、字重500，Microsoft YaHei / PingFang / sans-serif 字体与 flex 居中，不再跟随系统主题变色。默认右侧中部、0px边距，贴边时外平内圆，内层始终圆形，不耦合站点配置。
- 外壳改为网页明确主题优先、无可靠标记或冲突回退系统。主题识别归完整站点配置，Tailscale 声明 `config.theme = { root: 'html', darkClass: 'dark', useColorScheme: true }`；root 仅 html/body，读取正向主题 class 和 CSS 单值 `color-scheme: light` / `dark`，`normal`、`light dark` 等未知，不把 dark class 缺失视作 light。系统主题 change 及配置 root class/style 变化动态更新；不猜背景、不轮询、不增加生产手动主题按钮，本地 preview 页面主题 select 仅测试。内圆固定颜色和14px文字不变。
- 修复点击引起直角贴边轮廓收起/展开异常：不再于 `pointerdown` 立即展开圆形，仅在 `moveDrag` 超过6px实际拖动阈值后展开；普通按下、阈值内微移和点击释放保持贴边轮廓。
- 静止及按下未跨越6px拖动阈值时使用 `pointer`，实际拖动使用 `crosshair`，释放恢复 `pointer`，不使用 `grab` / `grabbing`。
- 归一化位置使用 `GM_getValue` / `GM_setValue` 保存到同一个脚本级键 `local-ui-translator:toggle-position`，装载读一次、拖动释放保存，不实时同步其他窗口，无 origin fallback；既有站点语言偏好及兼容键不变。
- 移除 Alt 调位和 Enter/空格切换，开关 `tabIndex=-1`、跳过 Tab 顺序，仅鼠标/触屏指针操作。
- 拖动阈值避免误切换，处理视口缩放、主体替换与停止时的交互清理。
- 增加独立匿名悬浮控件与脚本级位置存储回归；44px方案的离线50/50、Ego匿名34/34及两域本地 mock 检查，以及前一轮36px尺寸/光标方案的离线50/50、Ego fixture40/40、原生鼠标检查和32,880字节构建均为历史本地结果。固定粉色、14px居中字样与点击轮廓修复阶段曾有离线50/50、匿名Ego47/47通过，构建32,889字节，这些亦为新增网页主题优先方案之前的历史结果；原生鼠标按下/阈值内微移/释放保持轮廓与位置，仅实际拖动变为50%圆角及crosshair、释放恢复pointer，全部通过；固定粉色rgb(237, 109, 143)与14px确认。390×844截图已读取观察，承载几何居中通过，文字视觉中心及用户UI验收仍待反馈。`@sandbox raw` 与 GM 授权组合尚未真实油猴验证，本地 mock 不是真实 GM 跨站验收。
- 据主 agent 本轮实测，`npm run check` 68/68（23路由+45Node）、主题fixture26/26、悬浮fixture47/47通过，产物34,848字节；主题fixture先wait 10秒超时，随后读取原Promise确认成功，非重复计通过。本地preview原生select+CDP验证 `siteLightOverDark`、`siteDarkOverLight` 和未知系统回退通过。真实Tailscale临时注入最新产物，浏览器模拟light时实际html class为空/computed light，模拟dark时html.dark/computed dark，外壳同步；名称、链接、输入值保持、单开关及DNS实际SPA主题维持通过。未验证真实站点手动主题与相反系统组合，相反主题仅在本地preview验证；临时注入不是真实GM实装，用户视觉验收仍待确认，不解除 `nomerge`。
- 关联 Issue #1。UI/UX 改动须提供本地预览供用户亲自验收，自动测试不替代用户确认；未验收保持 `nomerge`。Issue 聚焦专业需求/bug，任务变更及时更新；项目规范、UI/UX验收原则与文件夹结构保留在文档，不塞入 Issue。
- 明确项目根 `.del/`（废弃资产、不删除）、`.local/`（仍有用的本地资产、不提交）、`.worktrees/`（功能分支工作区）的职责与忽略规则；从主仓库根创建 worktree，迁移用 `git worktree move`，Issue → worktree → PR 不自动合并并保留。

## 0.2.1 — 2026-11-24

- 项目正式命名「站点汉化 / Site Localization」，仓库名 `site-localization`。
- 名称与版本统一由 package.json 管理；保留 namespace、Tailscale 配置 id 和语言偏好键。
- 严格验证站点配置 id、URL 匹配、翻译属性及正则；修复非字符串 id 可通过构建的问题。
- 无 selector 的动态文本规则必须处于 UI 范围，防止误译普通用户计数文本。
- 增加构建校验回归、可复现 DOM fixture、仓库规范和只读 CI。
- 本地真实浏览器历史与用户数据排除在 Git 维护面之外。

## 0.2.0 — 2026-11-24

- 通用框架与完整站点配置分离，发布一个自包含统一用户脚本。
- Tailscale 为首个正式配置；URL 选择、SPA 路由切换和冲突时拒绝启动。

## 0.1.0 — 2026-11-24

- 原创无依赖 DOM 汉化内核和 Tailscale 初版适配。
- 文本节点、提示属性、增量监听、语言切换与条件恢复。
