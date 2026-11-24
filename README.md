# 站点汉化 / Site Localization

**一个用户脚本，通用汉化框架 + 完整站点配置。**

A local, dependency-free userscript framework for site-specific Chinese UI localization. Develop the framework and complete site configurations separately; install one bundled userscript.

版本 **0.3.0** · MIT · 首个正式适配：**Tailscale 管理台**。

## 安装与更新

1. 在 Tampermonkey 等用户脚本管理器中新建脚本，粘贴 [统一产物](<dist/local-ui-zh.user.js>) 的完整内容并保存。
2. 打开或刷新 `https://console.tailscale.com/admin/machines`，使用悬浮贴边开关切换中英。
3. 不要同时启用其他 Tailscale 汉化脚本。

**从「网页汉化 · 本地框架」升级：打开原条目的编辑器，替换内容并保存，不再新建另一份。** 改名可能影响管理器按名称识别的导入行为；本项目保留 `@namespace local-ui-translator`、`tailscale-zh-cn` 配置 id 和既有语言偏好键。若导入生成两份条目，请停用旧条目。

目前不配置自动更新地址；后续手动更新同一个脚本。正式发布远程入口后再设置固定的 `@updateURL` / `@downloadURL`。

## 悬浮贴边开关

这是通用框架 UI：位置与交互不使用目标站点的布局/选择器配置；外壳主题识别由完整站点配置声明：

- 外层36px「汉/原」贴边控件，默认贴右边中部，与视口边缘间距为0px；只有超过6px阈值开始实际拖动才展开为圆形，普通按下、阈值内微移和点击释放均保持外侧平直、内侧圆弧的贴边轮廓。内层使用独立26px圆形 `span` 底座，始终为固定粉色 `#ED6D8F`，文字固定深色 `#3c2030`，不跟随系统主题变色；标识为14px、字重500，使用 Microsoft YaHei / PingFang / sans-serif 字体及 flex 居中，视觉中心待用户确认。
- 外壳优先跟随网页的明确主题，无可靠标记或标记冲突时回退系统主题；完整站点配置声明 `theme: { root: 'html', darkClass: 'dark', useColorScheme: true }`。仅从配置指定的 `html` / `body` 读取正向主题 class 和 CSS 单值 `color-scheme: light` / `dark`；`normal`、`light dark` 等不作明确主题证据。系统主题 change 与配置 root 的 class/style 变化会动态更新；不猜背景、不轮询，不增加生产环境手动主题按钮。本地预览的页面主题 select 仅供测试，内圆颜色与14px文字始终固定。
- 鼠标或触屏拖动后，松手吸附最近的左/右边缘；普通点击切换语言，超过6px的拖动不会误触切换。静止及按下但未跨越6px拖动阈值时使用 `pointer`，实际拖动时使用 `crosshair`，释放后恢复 `pointer`；不使用 `grab` / `grabbing`。
- 仅支持指针（鼠标/触屏）操作；开关 `tabIndex=-1`，不进入 Tab 顺序，不提供 Alt 调位或 Enter/空格切换。
- 位置按“左右边 + 归一化高度”通过 `GM_getValue` / `GM_setValue` 保存到同一个脚本级键 `local-ui-translator:toggle-position`，供支持站点共享。装载时读取一次，拖动释放时保存，不实时同步其他已打开窗口；没有按 origin 的存储回退。语言偏好仍使用原站点 id 与兼容键，不随位置存储改动。
- 窗口缩放保持控件可见，主体替换重挂载，停止时取消拖动并清理监听。存储禁用/损坏不影响使用。
- 使用 layout viewport；目标页面强制 CSS、祖先 transform、移动端软键盘/visual viewport 的特殊影响尚不保证。

当前产物声明 `@sandbox raw` 及 `GM_getValue` / `GM_setValue` 授权，但尚未在真实油猴安装中验证此组合。此前44px方案及36px尺寸/光标方案的检查均为历史本地证据：后者曾有离线50/50、Ego匿名40/40和原生鼠标检查通过，构建32,880字节；不代表后续固定粉色、14px居中字样及点击轮廓修复的结果。固定粉色、14px及点击轮廓修复阶段曾有离线50/50、匿名Ego47/47、构建32,889字节和原生鼠标检查通过，390×844截图承载几何居中通过；这些是新增网页主题优先方案之前的历史结果，不作为本轮总数。据主 agent 本轮实测，`npm run check` 68/68（23路由+45Node）、主题fixture26/26、悬浮fixture47/47通过，产物34,848字节；主题fixture先wait 10秒超时，随后读取原Promise确认成功，未重复计通过。本地preview原生select+CDP验证网页light/系统dark、网页dark/系统light及未知系统回退通过。真实Tailscale临时注入最新产物后，浏览器模拟light时实际html class为空/computed light，模拟dark时html.dark/computed dark，外壳同步；名称、链接、输入值保持、单开关及DNS实际SPA主题维持通过。真实站点未测手动主题与相反系统组合，相反主题仅在本地preview验证；临时注入不是真实GM实装。文字视觉中心、用户 UI/UX 验收及真实GM实装仍待确认，保持 `nomerge`。详情见 [测试记录](<TESTING.md>)。

## 两类开发对象

### 通用框架

- [DOM 内核](<src/engine.js>)：文本节点和提示属性汉化、增量监听、中英切换、条件恢复。
- [站点调度](<src/framework/runtime.js>)：URL 选择、SPA 路由响应、同站不重复安装、离开范围恢复、多配置冲突时拒绝启动。

框架不包含 Tailscale 词条和元素选择器。技术全局 API 保留既有名称以避免无意义的兼容迁移。

### 完整站点配置

[Tailscale 配置](<src/sites/tailscale/config.mjs>) 是一个完整维护单位：

| 字段 | 用途 |
|---|---|
| `id` / `name` | 配置身份和显示名称 |
| `matches` | URL 范围，同时生成油猴 `@match` |
| `exact` | 词语、短语和整句 |
| `rules` | 锚定正则和动态文案，可加 `selector` |
| `uiSelector` / `rootSelector` | UI 与可选根范围 |
| `attributes` | 仅 title、placeholder、aria-label |
| `theme` | 外壳网页主题识别声明；root 仅 html/body，明确标记优先、未知或冲突回退系统 |
| `ignoreSelector` / `protectSelector` | 代码、编辑器与用户内容保护 |

词库、元素规则、整句和正则都是配置的内部手段，不是不同安装单位。配置未来可以拆成多文件再导出完整对象；发布仍默认合成一个用户脚本。

## 开发与验证

维护 agent 请先阅读 [项目维护认知](<AGENTS.md>)，对齐项目目标、框架与完整站点配置的改动粒度、安全边界及验证要求。

Node.js **22+**，没有外部依赖，不需要 `npm install`。

```sh
npm run check
# 包含构建、调度/配置/产物回归和最终脚本语法检查

# 只构建单个站点：可选，用户不用同时安装两个产物
node build.mjs --site tailscale-zh-cn
```

[构建入口](<build.mjs>) 从 [项目元数据](<package.json>) 读取名称/版本，把框架与 [站点注册表](<src/sites/index.mjs>) 合成产物；[校验模块](<tools/validate-config.mjs>) 在构建前拒绝错误或不可序列化配置。

[CI](<.github/workflows/ci.yml>) 已配置 Node.js 22/24、固定 action 提交和只读权限，检查测试与已提交产物可复现。推送后由 GitHub Actions 执行，实际结果请查看仓库的 Actions 页面。

新增站点参考 [配置模板](<src/sites/config-template.mjs>)，先确定匹配范围、用户数据保护与语义 UI，再增加汉化并注册、构建、真实浏览器验证。详见 [贡献规范](<CONTRIBUTING.md>) 和 [测试指南](<TESTING.md>)。

## 安全与边界

- 无远程翻译、遥测或动态下载配置；不发送页面内容，不调用站点管理 API。
- 当前只匹配 Tailscale 管理台两个域名的 `/admin/*`，不是全网站匹配。
- 按当前配置保护设备名称和账户菜单；不修改 input.value、textarea、contenteditable、URL 或策略代码。
- 不重建 innerHTML。恢复只在字段仍等于最后译文时进行，不覆盖应用后续写入。
- 无 selector 的动态文本规则必须处于 UI 范围；明确 selector 的规则由配置维护者承担范围判断。
- 缺乏安全语义范围的状态/计数宁可保留英文。用户数据不能仅凭英语词条自动识别。
- 不支持 Shadow DOM、iframe、Canvas、跨节点整句或 CSS 生成文案；不保证全路由和未来网页改版覆盖。
- 选择器依赖仅支持自身/祖先上下文，不追踪复杂兄弟节点或 `:has()` 依赖。

更多信任边界见 [安全策略](<SECURITY.md>)。

## 仓库与许可

公开仓库：[antnesswcm/site-localization](<https://github.com/antnesswcm/site-localization>)。默认分支 `main`。

根项目内 `.del/` 存放废弃资产（只移动、不删除），`.local/` 存放仍有用的本地测试、截图、预览和日志，`.worktrees/` 存放 git worktree 功能分支；三者均由 [发布白名单](<.gitignore>) 明确忽略，不提交。worktree 从主仓库根创建以避免递归，迁移使用 `git worktree move`。功能维护遵循 Issue → worktree → PR，不自动合并，并保留分支与 worktree。

UI/UX 改动必须提供本地预览供用户亲自验收，自动测试不能替代用户确认；未验收保持 `nomerge`，不自动合并。本地预览不提交，可复用的匿名 fixture 可以提交。公共测试只使用合成数据，不提交个人账户、真实页面截图、绝对路径或私有测试结果。

Issue 聚焦专业、具体的需求或 bug 与可检验验收条件，不写模板空话；任务变更及时更新。项目规范、UI/UX 用户验收原则、文件夹结构与资产归属写项目文档，不塞入 Issue；详见 [维护规范](<AGENTS.md>)。

实现与当前配置为独立原创，[MIT 许可证](<LICENSE>)。参考了 [github-chinese](<https://github.com/maboloshi/github-chinese>) 的分离维护思路，未复制其 GPL 实现或词库；用户提供的 [旧 Tailscale 脚本](<https://github.com/gxdung/tailscale-cn/blob/main/tailscale-translator.user.js>) 未发现许可证，也未复制其源码或词库。

油猴机制参见 [官方文档](<https://www.tampermonkey.net/documentation.php>)。版本演进见 [更新记录](<CHANGELOG.md>)。
