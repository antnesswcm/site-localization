// SPDX-License-Identifier: MIT
// Complete site configuration template, NOT registered or released.
// Replace verified scopes and protect user data before enabling a real site.
export default {
  id: 'replace-site-zh-cn',
  name: 'Replace site',
  matches: ['https://replace.example/ui/*'],
  rootSelector: '#verified-ui-root',
  uiSelector: 'button,label,h1,h2,[role="menuitem"]',
  ignoreSelector: 'pre,code,textarea,[contenteditable],.monaco-editor,.cm-editor',
  protectSelector: '[data-user-content],[data-device-name],[data-secret]',
  attributes: ['title','placeholder','aria-label'],
  exact: {'Save':'保存','Cancel':'取消','Manage your devices.':'管理你的设备。'},
  rules: [
    {pattern:'^(\\d+) items?$',replacement:'$1 项',selector:'[data-item-count]'}
  ]
};
