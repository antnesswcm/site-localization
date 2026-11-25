# 维护认知 · 站点汉化 / Site Localization

先读本文件和 [README](<README.md>)，再读相关源码；历史测试不代表当前验证。

## 产品与颗粒度

- 项目只用本地可审查规则改善网页 UI 阅读，不是在线翻译或网络运维工具。不得修改账户、设备、权限、密钥或网站业务数据。
- 开发对象是**通用框架 + 完整站点配置**；默认只发布一个自包含用户脚本。词、句、正则、元素、保护规则都是完整配置内部手段，不是用户安装单位。
- 目前只有 Tailscale 正式适配。不顺手扩站/补词；小词条任务不做全站审计。
- 0.4.0 直接重构，用户明确无需兼容/迁移。不要恢复旧键、旧 singleton、双入口或兼容分支。

## 分层与默认改动位置

- [内核](<src/engine.js>)：文本/提示属性增量执行、条件恢复、订阅；不创建 UI、不读写存储、不维护实例 singleton。
- [调度](<src/framework/runtime.js>)：选唯一匹配配置、SPA 同站不重装、退出恢复、history 清理。
- [会话](<src/framework/site-session.js>)：连接内核与 DockOrb、汉/原下一步动作、GM 状态、隐藏/恢复菜单、主题、完整销毁。勿将通用球交互重新塞入这里。
- [站点配置](<src/sites/tailscale/config.mjs>)：翻译内容、语义范围、保护、明确主题信号。字段校验在 [校验模块](<tools/validate-config.mjs>)。
- [DockOrb](<vendor/dockorb/manifest.json>) 固定离线快照在私有作用域运行。不得手改 vendor；组件问题回 DockOrb 仓库，升级快照时同步摘要与完整许可。
- [构建](<build.mjs>) 从 [元数据](<package.json>) 生成 [统一产物](<dist/local-ui-zh.user.js>)，不能手改 dist；新增公共文件要加入 [白名单](<.gitignore>)。

## 安全执行边界

- 明确 HTTP(S) 主机/路径匹配，多配置冲突拒绝启动。
- 仅文本节点及 title/placeholder/aria-label；不改 input.value、URL、textarea、contenteditable、代码/策略 JSON、用户内容。
- 短精确文本（≤32 字符且≤3词）及无 selector 动态规则须在语义 UI 范围。显式 selector 不自动安全；设备名、账户菜单由配置保护。
- 正则锚定/full-match，禁止 m/y。配置本地可信，不从网页或远程响应构造代码。
- 不替换 innerHTML，保持节点身份/监听器。恢复仅在字段仍等于最后译文时执行，不能覆盖应用后写值。脱离/重插遵循同语义。
- 增量监听合并处理，不退回全页轮询。history 包装保留 this/args/return，停止不能覆盖后装包装。
- 不承诺 Shadow DOM/iframe/Canvas/跨节点整句/复杂兄弟/:has 翻译；DockOrb 的 Shadow UI 本身不属于翻译范围。

## UI、状态、许可

- 主球汉/原表示下一步动作，actions 默认空；鼠标主点击不展开，短触屏切换/长按更多。隐藏入口不改变语言，通过 GM 菜单恢复。不得添加无关业务面板或成功反馈。
- 网页配置的正向主题标识或单一 computed color-scheme 优先；未知/冲突回退系统，不猜背景色。
- namespace `site-localization`，语言 GM 键 `site-localization:enabled:<id>`，共享位置 `site-localization:orb-position`。启动读、实际拖动释放写，无页面 localStorage 回退，无已开页实时同步。缺失/拒绝 GM 时安全默认，但不能宣称持久化成功。
- 单文件无 @require/CDN/远程配置下载。项目 MIT，DockOrb/Lucide/Feather 许可与来源见 [声明](<THIRD-PARTY-NOTICES.md>)；不能遗漏 ISC/MIT 或复制无授权代码/词库。

## 验证、工作流与资产

- Node 22+、无需安装依赖；执行 `npm run check`，检查生成产物、源码 diff 和安全负例。
- 路由 stub 不证明 DOM；匿名 [内核 fixture](<tests/dom-fixture.js>) 与 [会话 fixture](<tests/session-fixture.js>) 用隔离 about:blank/GM mock，不代表真实用户脚本沙箱持久化。
- 浏览器先读 skill，使用同一目标空间；真实导航等待加载状态，保护输入/用户名称/URL，不点击业务写入。临时注入不等于已安装；自动加载/GM 权限/CSP 应以真实管理器安装另行证明。
- 记录当轮事实和限制于 [测试说明](<TESTING.md>)，不复用旧结果，不把本地通过称为远程 CI 成功。
- Issue 只写具体 feature/bug、重现和验收，需求变化更新；目录和通用维护流程写文档。分支/worktree/PR 交付，不未经授权合并、安装、release 或配置自动更新。
- 内部 `.local/` 有用私有记录、`.del/` 废弃资产、`.worktrees/` 分支工作树；不再外建混合归档。禁止永久删除；移动前核对绝对源/目标，不覆盖、不动他人资产。
- 不提交凭据、浏览器档案、真实设备/账户、机器绝对路径或私有结果。Git 忽略不替代公开 diff 审查。

**完整站点配置是适配单元，框架是执行层，DockOrb 是离线组件，一个脚本是用户入口。**
