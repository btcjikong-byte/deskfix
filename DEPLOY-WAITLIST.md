# DeskFix 等待列表部署指南

**完成时间**: 2026-03-28  
**技术栈**: Node.js + Express + SQLite  
**端口**: 8083

---

## 📁 文件结构

```
deskfix/
├── waitlist/
│   ├── server.js          # 后端 API 服务
│   ├── package.json       # Node.js 依赖
│   ├── index.html         # 管理后台页面
│   └── waitlist.db        # SQLite 数据库（运行后自动生成）
├── waitlist-form.html     # 等待列表表单（嵌入 Landing Page）
└── DEPLOY-WAITLIST.md     # 本文件
```

---

## 🚀 部署步骤

### 步骤 1：安装依赖

```bash
cd /root/.openclaw/workspace/deskfix/waitlist
npm install
```

**安装的依赖**：
- express (Web 框架)
- cors (跨域支持)
- sqlite3 (数据库)

预计时间：1-2 分钟

---

### 步骤 2：启动服务

```bash
# 开发模式（自动重启）
npm run dev

# 或生产模式
npm start
```

**验证服务启动**：
```bash
curl http://localhost:8083/api/health
# 应返回：{"status":"ok","service":"deskfix-waitlist"}
```

---

### 步骤 3：集成到 Landing Page

#### 方案 A：直接嵌入表单（推荐）

1. 打开 `/root/.openclaw/workspace/deskfix/index.html`
2. 在 Hero Section 后（`</section>` 后）添加：
   ```html
   <!-- 插入 waitlist-form.html 的内容 -->
   ```
3. 或者用 iframe 嵌入：
   ```html
   <iframe src="waitlist-form.html" width="100%" height="800" frameborder="0"></iframe>
   ```

#### 方案 B：修改 CTA 按钮链接

将 Hero 的 CTA 按钮改为跳转到表单锚点：
```html
<a href="#waitlist" class="...">Join Waitlist - Get 50% OFF</a>
```

---

### 步骤 4：推送更新到 GitHub Pages

```bash
cd /root/.openclaw/workspace/deskfix
git add index.html waitlist-form.html
git commit -m "Add waitlist form integration"
git push origin main
```

**验证**：
- 访问 https://btcjikong-byte.github.io/deskfix/
- 检查表单是否正常显示
- 测试提交功能

---

## 🔧 管理后台使用

### 访问管理后台

```bash
# 在浏览器打开
http://localhost:8083/
```

或直接在服务器上用浏览器访问（如果有图形界面）。

### 功能

1. **查看统计数据**
   - 总用户数
   - 最近 7 天新增
   - 主要体态问题
   - 主要来源

2. **查看用户列表**
   - 分页浏览所有用户
   - 查看详细信息

3. **导出 CSV**
   - 点击"导出 CSV"按钮
   - 下载 Excel 可打开的文件

---

## 📊 API 端点

### POST /api/waitlist
提交等待列表

**请求**：
```json
{
  "email": "user@example.com",
  "posture_issue": "颈前倾/脖子疼",
  "time_commitment": "5 分钟",
  "price_range": "$5-10/月",
  "source": "Twitter/X"
}
```

**响应**：
```json
{
  "success": true,
  "message": "🎉 感谢加入 DeskFix 等待列表！",
  "id": 1
}
```

### GET /api/waitlist/stats
获取统计数据

**响应**：
```json
{
  "total": 100,
  "last_7_days": 15,
  "by_posture_issue": [
    { "posture_issue": "颈前倾/脖子疼", "count": 45 },
    { "posture_issue": "圆肩/肩膀内扣", "count": 30 }
  ],
  "by_source": [
    { "source": "Twitter/X", "count": 50 },
    { "source": "Reddit", "count": 30 }
  ]
}
```

### GET /api/waitlist/users?page=1&limit=50
获取用户列表（分页）

### GET /api/waitlist/export
导出 CSV 文件

---

## 🛡️ 安全建议

### 生产环境部署

1. **添加认证**
   - 管理后台需要密码保护
   - 使用环境变量存储敏感信息

2. **HTTPS**
   - 如果使用独立域名，启用 HTTPS
   - 使用 Let's Encrypt 免费证书

3. **限流**
   - 防止恶意提交
   - 同一 IP 每小时限制提交次数

4. **数据备份**
   - 定期备份 waitlist.db
   - 导出 CSV 存档

---

## 🔄 开机自启（可选）

### 创建 systemd 服务

```bash
sudo nano /etc/systemd/system/deskfix-waitlist.service
```

**内容**：
```ini
[Unit]
Description=DeskFix Waitlist API
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/.openclaw/workspace/deskfix/waitlist
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

**启用服务**：
```bash
sudo systemctl daemon-reload
sudo systemctl enable deskfix-waitlist
sudo systemctl start deskfix-waitlist
sudo systemctl status deskfix-waitlist
```

---

## 📝 数据库结构

```sql
CREATE TABLE waitlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    posture_issue TEXT,
    time_commitment TEXT,
    price_range TEXT,
    source TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**字段说明**：
- `email`: 用户邮箱（唯一）
- `posture_issue`: 主要体态问题
- `time_commitment`: 每天愿意花的时间
- `price_range`: 愿意支付的价格区间
- `source`: 流量来源
- `created_at`: 注册时间

---

## 🐛 故障排查

### 服务无法启动

**检查 Node.js 版本**：
```bash
node --version
# 需要 v14+
```

**检查端口占用**：
```bash
lsof -i :8083
# 如果有其他进程，修改 server.js 中的 PORT
```

### 表单提交失败

**检查 CORS**：
- GitHub Pages 是 HTTPS，本地是 HTTP
- 浏览器可能阻止混合内容
- 解决：部署到 HTTPS 环境或使用 CORS 代理

**检查 API 地址**：
- 确保 waitlist-form.html 中的 API 地址正确
- 生产环境需要改为实际域名

### 数据库锁定

**删除并重建**：
```bash
rm waitlist.db
npm start
# 会自动创建新数据库
```

---

## 📈 下一步优化

1. **邮件通知**
   - 用户提交后发送确认邮件
   - 使用 SendGrid/Mailgun

2. **数据分析**
   - 集成 Google Analytics
   - 追踪转化率

3. **自动化营销**
   - 产品上线时自动邮件通知
   - 定期发送体态纠正小贴士

4. **A/B 测试**
   - 测试不同表单文案
   - 优化转化率

---

**版本**: v1.0  
**创建时间**: 2026-03-28  
**状态**: 待部署
