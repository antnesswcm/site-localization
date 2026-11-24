# 站点汉化 / Site Localization

**一个用户脚本，通用汉化框架 + 完整站点配置。**

A local, dependency-free userscript framework for site-specific Chinese UI localization. Develop the framework and complete site configurations separately; install one bundled userscript.

版本 **0.2.1** · MIT · 首个正式适配：**Tailscale 管理台**。

## 安装与更新

1. 在 Tampermonkey 等用户脚本管理器中新建脚本，粘贴 [统一产物](<dist/local-ui-zh.user.js>) 的完整内容并保存。
2. 打开或刷新 `https://console.tailscale.com/admin/machines`，右下角可中英切换。
3. 不要同时启用其他 Tailscale 汉化脚本。

**从「网页汉化 · 本地框架」升级：打开原条目的编辑器，替换内容并保存，不再新建另一份。** 改名可能影响管理器按名称识别的导入行为；本项目保留 `@namespace local-ui-translator`、`tailscale-zh-cn` 配置 id 和既有语言偏好键。若导入生成两份条目，请停用旧条目。

目前不配置自动更新地址；后续手动更新同一个脚本。正式发布远程入口后再设置固定的 `@updateURL` / `@downloadURL`。

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
| `ignoreSelector` / `protectSelector` | 代码、编辑器与用户内容保护 |

词库、元素规则、整句和正则都是配置的内部手段，不是不同安装单位。配置未来可以拆成多文件再导出完整对象；发布仍默认合成一个用户脚本。

## 开发与验证

Node.js **22+**，没有外部依赖，不需要 `npm install`。

```sh
npm run check
# 包含构建、调度/配置/产物回归和最终脚本语法检查

# 只构建单个站点：可选，用户不用同时安装两个产物
node build.mjs --site tailscale-zh-cn
```

[构建入口](<build.mjs>) 从 [项目元数据](<package.json>) 读取名称/版本，把框架与 [站点注册表](<src/sites/index.mjs>) 合成产物；[校验模块](<tools/validate-config.mjs>) 在构建前拒绝错误或不可序列化配置。

[CI](<.github/workflows/ci.yml>) 已配置 Node.js 22/24、固定 action 提交和只读权限，检查测试与已提交产物可复现。远程仓库尚未创建，GitHub CI 尚未运行。

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

仓库名：`site-localization`。当前默认分支 `main`，仅准备本地仓库，不代表已上传 GitHub。

原型与真实浏览器记录保留在本地，但 [发布白名单](<.gitignore>) 不将其纳入 Git。公共测试只使用合成数据，不提交个人账户、截图、绝对路径或测试结果档案。

实现与当前配置为独立原创，[MIT 许可证](<LICENSE>)。参考了 [github-chinese](<https://github.com/maboloshi/github-chinese>) 的分离维护思路，未复制其 GPL 实现或词库；用户提供的 [旧 Tailscale 脚本](<https://github.com/gxdung/tailscale-cn/blob/main/tailscale-translator.user.js>) 未发现许可证，也未复制其源码或词库。

油猴机制参见 [官方文档](<https://www.tampermonkey.net/documentation.php>)。版本演进见 [更新记录](<CHANGELOG.md>)。
