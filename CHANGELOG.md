# Changelog

## 0.3.0 — 2026-11-24

- 框架语言开关改为44px「汉/原」可拖动贴边球，默认右侧中部、0px边距；拖动时圆形，释放吸附左右边缘后外平内圆，跟随系统 light/dark，不耦合站点配置。
- 归一化位置使用 `GM_getValue` / `GM_setValue` 保存到同一个脚本级键 `local-ui-translator:toggle-position`，装载读一次、拖动释放保存，不实时同步其他窗口，无 origin fallback；既有站点语言偏好及兼容键不变。
- 移除 Alt 调位和 Enter/空格切换，开关 `tabIndex=-1`、跳过 Tab 顺序，仅鼠标/触屏指针操作。
- 拖动阈值避免误切换，处理视口缩放、主体替换与停止时的交互清理。
- 增加独立匿名悬浮控件与脚本级位置存储回归；最新离线50/50、Ego匿名34/34及两域本地 mock 实际鼠标检查通过。`@sandbox raw` 与 GM 授权组合尚未真实油猴验证，本地 mock 不是真实 GM 跨站验收。
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
