# Testing · 站点汉化 / Site Localization

## 0.4.0 集成回归 · 2026-11-25

Node 22+、无需安装依赖，执行 `npm run check`：

- [调度](<tests/framework-tests.mjs>) **23/23**：匹配/拒绝、同站 SPA 不重装、退出/重入、冲突、history 清理。会话为 stub，不证明 DOM。
- [配置与产物](<tests/build.test.mjs>) **27/27**：配置/主题合法性、元数据、固定 vendor SHA256、完整许可、离线自包含、纯内核无 UI/存储、新 namespace/GM 权限。
- [内核 DOM](<tests/dom-fixture.js>) **23/23**：语义范围正负例、用户内容/输入值、节点身份、增量、条件恢复、订阅与停止。
- [会话 DOM](<tests/session-fixture.js>) **25/25**：私有 DockOrb 单入口、汉/原切换、点击不展开、隐藏不改语言/菜单恢复、GM 新偏好、位置启动读取与无实时同步、明确主题、body 替换重挂与清理。

DOM fixture 只在隔离 about:blank 页运行：先执行最终产物（非匹配页不会自动启动），再执行两个 fixture，传入可序列化配置。runner 提供 GM_getValue/GM_setValue/GM_registerMenuCommand/GM_unregisterMenuCommand 的内存 mock（测试菜单放入 window.__testMenus Map）。先运行内核 fixture，再运行会话 fixture。**mock 不是真实管理器 GM 沙箱验证。**

## 本轮真实页面与预览证据

Ego 独立任务空间，Tailscale 页临时注入最终产物：

- 停止该测试页原有旧版实例，确认新 siteId 正确、一个 DockOrb root、无旧按钮；暗色网页信号对应暗色外壳。
- 原生鼠标点击恢复英文、汉字下一步标签变化、GM mock 写入 false、不展开；再切中文。
- 真实 SPA 从设备页进入 DNS，等待 DNS 内容加载后，正文中文、唯一入口与原标签保持。
- DNS 域名/IP 内容保留；不修改账户或网络设置。
- 设备列表请求出现网站 `timeout of 60000ms exceeded`，故本轮未取得设备行，**不能将空列表比较当作真实设备名验证**。合成用户内容负例由内核 fixture 覆盖。
- 无账户本地预览验证真实鼠标拖动吸左、位置写入、无误切换；正常点击切语言不展开。

本轮**没有永久安装**新脚本，未验证真实 GM 跨域持久化、真实用户脚本沙箱自动加载/CSP 回退。验收后应在管理器只启用当前一份，再整页刷新，禁止以再次注入冒充自动加载。目录/脚本/私有结果只留本地忽略目录，不提交原始账户数据。

## 限制与历史

当前不承诺所有路由/浏览器、Shadow DOM/iframe/Canvas/跨节点翻译、复杂兄弟/:has、高负载性能或真实手机 WebView。DockOrb 的 Shadow UI 不在翻译范围。

0.2.1 的历史结果为调度23、配置22、DOM20，曾正常安装；只作历史记录，不是0.4.0当前能力或安装证据。远程 CI 以对应提交的 Actions 实际结果为准。
