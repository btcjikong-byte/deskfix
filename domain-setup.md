# DeskFix 域名注册指南

**推荐域名**：deskfix.app  
**备选域名**：getdeskfix.com / deskfix.io  
**预计成本**：$10-15/年  
**时间**：5 分钟

---

## 🎯 域名选择建议

### 首选：deskfix.app
- ✅ 简洁易记
- ✅ .app 后缀适合应用类产品
- ✅ 与品牌名完全一致
- 💰 约$12/年

### 备选：getdeskfix.com
- ✅ .com 最通用
- ✅ "get"前缀是 SaaS 常见命名方式
- ✅ 如果 deskfix.app 被注册，这是最佳备选
- 💰 约$10/年

### 备选：deskfix.io
- ✅ .io 适合科技产品
- ✅ 简洁
- 💰 约$15/年（稍贵）

---

## 🛒 注册商推荐

### 1. Cloudflare（推荐）
**优点**：
- 按成本价销售（无加价）
- 免费隐私保护
- 免费 DNS 管理
- 界面简洁

**链接**：https://www.cloudflare.com/products/registrar/

**步骤**：
1. 注册/登录 Cloudflare 账号
2. 访问 https://dash.cloudflare.com/sign-up/registrar
3. 搜索 "deskfix.app"
4. 添加到购物车
5. 付款（支持信用卡/PayPal）
6. 完成注册

### 2. Namecheap
**优点**：
- 价格便宜
- 界面友好
- 免费隐私保护（首年）

**链接**：https://www.namecheap.com/

**步骤**：
1. 访问 https://www.namecheap.com/
2. 搜索 "deskfix.app"
3. 点击"Add to Cart"
4. 结账（创建账号 → 付款）
5. 完成注册

### 3. GoDaddy
**优点**：
- 最大注册商
- 支持支付宝

**缺点**：
- 续费较贵
- 附加服务多（注意取消不需要的）

**链接**：https://www.godaddy.com/

---

## 💳 付款准备

**支持的付款方式**：
- 信用卡（Visa/Mastercard/Amex）
- PayPal
- 部分支持支付宝（GoDaddy）

**预计费用**：
- deskfix.app: ~$12/年
- getdeskfix.com: ~$10/年
- deskfix.io: ~$15/年

---

## 🔧 注册后配置

### DNS 设置（指向 GitHub Pages）

注册完成后，需要配置 DNS 让域名指向 GitHub Pages：

1. 登录域名注册商后台
2. 找到 DNS 管理/DNS Settings
3. 添加以下记录：

**A 记录**（4 条）：
```
类型：A
主机：@
值：185.199.108.153
TTL：3600

类型：A
主机：@
值：185.199.109.153
TTL：3600

类型：A
主机：@
值：185.199.110.153
TTL：3600

类型：A
主机：@
值：185.199.111.153
TTL：3600
```

**CNAME 记录**：
```
类型：CNAME
主机：www
值：btcjikong-byte.github.io
TTL：3600
```

### GitHub 仓库配置

1. 访问 https://github.com/btcjikong-byte/deskfix
2. Settings → Pages
3. Custom domain: 输入 `deskfix.app`
4. 点击 Save
5. 勾选 "Enforce HTTPS"（等 DNS 生效后）

---

## ⏱️ 时间线

| 步骤 | 时间 |
|------|------|
| 域名搜索 | 1 分钟 |
| 注册付款 | 2 分钟 |
| DNS 配置 | 2 分钟 |
| GitHub 配置 | 1 分钟 |
| **总计** | **6 分钟** |

**注意**：DNS 生效需要 24-48 小时（通常几小时内生效）

---

## 📝 检查清单

- [ ] 选择域名（deskfix.app 优先）
- [ ] 选择注册商（Cloudflare 推荐）
- [ ] 完成注册付款
- [ ] 配置 DNS（A 记录 + CNAME）
- [ ] GitHub 仓库添加自定义域名
- [ ] 启用 HTTPS
- [ ] 测试访问：https://deskfix.app

---

## 💡 建议

1. **立即注册**：好域名随时可能被抢注
2. **开启自动续费**：避免忘记续费导致域名丢失
3. **开启隐私保护**：避免个人信息公开
4. **保存账号信息**：记录注册商、账号、到期时间

---

## 🆘 遇到问题？

### 域名已被注册
- 尝试备选：getdeskfix.com / deskfix.io
- 或使用 WHOIS 查询联系所有者（可能高价出售）

### DNS 不生效
- 等待 24-48 小时
- 清除浏览器缓存
- 检查 DNS 配置是否正确

### GitHub Pages 不显示
- 确认 DNS 已生效（https://dnschecker.org/）
- 确认 GitHub 仓库已配置自定义域名
- 检查 HTTPS 证书是否签发（几分钟到几小时）

---

**版本**：v1.0  
**创建时间**：2026-03-28  
**状态**：待执行
