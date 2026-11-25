// SPDX-License-Identifier: MIT
// Original independently authored Tailscale UI dictionary. Schema 1.
const exact = {

    'Network':'网络','Machines':'设备','MACHINE':'设备','Machine':'设备','Apps':'应用','Services':'服务','Users':'用户','Access controls':'访问控制','Logs':'日志','Settings':'设置','Resource hub':'资源中心','Help':'帮助','Free':'免费版',
    'Manage the devices connected to your tailnet.':'管理已连接到你私有网络的设备。','See how to manage devices':'查看设备管理说明','Add device':'添加设备','Filters':'筛选','Learn more':'了解更多','See more':'查看更多',
    'Search by name, owner, tag, version...':'按名称、所有者、标签、版本搜索…','Search by name, owner, tag, version…':'按名称、所有者、标签、版本搜索…',
    'Add devices to your network':'将设备加入你的网络','Operating systems':'操作系统','Cloud providers':'云服务商','Containers':'容器','Add AWS VM':'添加 AWS 虚拟机',
    'Tailscale works best when it’s installed on multiple devices. Explore what you can do with Tailscale in these environments.':'在多台设备上安装 Tailscale，可以发挥更大作用。了解这些环境中的使用方式。',
    'Connected':'已连接','Disconnected':'未连接','Currently connected':'当前在线','Not currently connected':'当前离线','Last seen':'最后在线时间','Last Seen':'最后在线时间','Addresses':'地址','Version':'版本','OS':'操作系统','OS Version':'系统版本','Owner':'所有者','Managed by':'管理者','Tags':'标签','Shared':'已共享','Not shared':'未共享','Enabled':'已启用','Disabled':'已禁用','Auto-update':'自动更新','Property':'属性','Exit node':'出口节点','Subnet':'子网','Connector':'连接器','Ephemeral node':'临时节点',
    'Edit machine name…':'编辑设备名称…','Edit machine IPv4…':'编辑设备 IPv4…','Edit route settings…':'编辑路由设置…','Edit ACL tags…':'编辑 ACL 标签…','Disable key expiry':'禁用密钥过期','Enable key expiry':'启用密钥过期','Share…':'共享…','Remove…':'移除…','View recent activity':'查看近期活动',
    'Cancel':'取消','Save':'保存','Save changes':'保存更改','Apply':'应用','Close':'关闭','Minimize':'最小化','Done':'完成','Continue':'继续','Back':'返回','Copy':'复制','Copied':'已复制','Edit':'编辑','Remove':'移除','Delete':'删除','Enable':'启用','Disable':'禁用','Manage':'管理','Configure':'配置','Reset':'重置','Search':'搜索',
    'DNS settings':'DNS 设置','Nameservers':'DNS 服务器','Global nameservers':'全局 DNS 服务器','Search domains':'搜索域','Add nameserver':'添加 DNS 服务器','Add search domain':'添加搜索域','Override local DNS':'覆盖本地 DNS','Split DNS':'分流 DNS','HTTPS Certificates':'HTTPS 证书',
    'General':'常规','Keys':'密钥','Auth keys':'入网密钥','API access tokens':'API 访问令牌','Generate auth key':'生成入网密钥','Generate access token':'生成访问令牌','Reusable':'可重复使用','Ephemeral':'临时设备','Pre-approved':'预先批准','Expiration':'过期时间','Key expiry':'密钥过期','Device approval':'设备审批','User management':'用户管理','Invite users':'邀请用户','Invite user':'邀请用户','Role':'角色','Status':'状态','Active':'有效','Pending':'待处理','Expired':'已过期',
    'Network flow logs':'网络流量日志','Configuration audit logs':'配置审计日志','Audit logs':'审计日志','View logs':'查看日志','Documentation':'文档','Support':'支持','Sign out':'退出登录','Billing':'账单','Overview':'概览','Access rules':'访问规则','Grants':'授权规则','Tests':'测试','Preview':'预览','JSON editor':'JSON 编辑器','Visual editor':'可视化编辑器',
    'Route settings':'路由设置','Subnet routes':'子网路由','Exit node settings':'出口节点设置','Use as exit node':'用作出口节点','Approved':'已批准','Not approved':'未批准','Advertised routes':'发布的路由','Device details':'设备详情','Details':'详情','Created':'创建时间','Last connected':'最后连接时间','Client version':'客户端版本','Operating system':'操作系统','Authentication':'身份验证','Key expiration':'密钥到期时间',
    'Manage DNS and nameservers of your network.':'管理网络的 DNS 设置和 DNS 服务器。','See how to configure DNS':'查看 DNS 配置方法','Tailnet DNS name':'私有网络 DNS 名称',
    'This unique name is used when registering DNS entries, sharing your device to other tailnets, and issuing TLS certificates.':'此唯一名称用于注册 DNS 记录、向其他私有网络共享设备，以及签发 TLS 证书。',
    'Rename tailnet...':'重命名私有网络…','Manage in Apps':'前往应用管理','Control device and user access to your third-party applications, without requiring any end user configuration.':'管理设备和用户对第三方应用的访问，无需最终用户额外配置。',
    'Set the nameservers used by devices on your network to resolve DNS queries.':'设置网络中设备解析 DNS 查询时使用的 DNS 服务器。','Search Domains':'搜索域','Add search domain...':'添加搜索域…',
    'Set custom DNS search domains. With MagicDNS enabled, your tailnet domain is always the first search domain.':'设置自定义 DNS 搜索域。启用 MagicDNS 时，私有网络域名始终是第一个搜索域。',
    'Automatically register domain names for devices in your tailnet. This lets you to use a machine’s name instead of its IP address.':'自动为私有网络中的设备注册域名，以便通过设备名而非 IP 地址访问。',
    'Disable MagicDNS…':'禁用 MagicDNS…','Enable HTTPS...':'启用 HTTPS…','Allow users to provision HTTPS certificates for their devices.':'允许用户为自己的设备签发 HTTPS 证书。',
    'Manage the users in your network and their permissions.':'管理网络中的用户及其权限。','See how user roles work':'了解用户角色的作用','Search users...':'搜索用户…','USER':'用户',
    'Device management':'设备管理','Policy file management':'策略文件管理','Trust credentials':'信任凭据','Contact preferences':'联系偏好','Authentication keys':'入网密钥','API tokens':'API 令牌','Generate key':'生成密钥',
    'View and manage your Auth keys and API access tokens.':'查看和管理入网密钥与 API 访问令牌。','Your private device keys are not included here: they are always private, stay on your device, and are never shared with Tailscale.':'此处不显示设备私钥：私钥仅保留在设备上，不会提供给 Tailscale。',
    'Authenticate devices without an interactive login.':'无需交互式登录即可授权设备入网。','Generate auth key…':'生成入网密钥…','Generate access token…':'生成访问令牌…','You don’t have any valid auth keys':'当前没有有效的入网密钥','Access tokens give access to the Tailscale API.':'访问令牌用于调用 Tailscale API。','API access token':'API 访问令牌','Revoke…':'撤销…','TYPE':'类型','REVOKE KEY':'撤销密钥'
};

// Original site resources; schema 1. No upstream code or dictionary copied.
export default {
  id: 'tailscale-zh-cn',
  name: 'Tailscale',
  matches: ['https://console.tailscale.com/admin/*','https://login.tailscale.com/admin/*'],
  uiSelector: 'a,button,h1,h2,h3,h4,p,label,th,dt,[role="menuitem"],[role="tab"],[role="dialog"],[role="heading"],input',
  ignoreSelector: 'script,style,pre,code,textarea,[contenteditable]:not([contenteditable="false"]),.monaco-editor,.cm-editor,.CodeMirror,[data-site-localization-ui]',
  protectSelector: 'a[href^="/admin/machines/100."],a[aria-label^="Detail view for"],button[aria-label="User menu"],[data-testid*="device-name"],[data-testid*="machine-name"],[data-testid*="user-email"]',
  attributes: ['title','placeholder','aria-label'],
  theme: {root:'html',darkClass:'dark',useColorScheme:true},
  exact,
  rules: [
    {pattern:'^(\\d+) machines?$',replacement:'$1 台设备'},
    {pattern:'^(\\d+) addresses?$',replacement:'$1 个地址'},
    {pattern:'^Read documentation about (Machines(?: filters)?)$',replacement:'阅读设备管理文档'},
    {pattern:'^Read documentation about (DNS|MagicDNS|HTTPS)$',replacement:'阅读 $1 文档'}
  ]
};
