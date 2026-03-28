// DeskFix Waitlist API Server
// 等待列表后端服务

const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 8086;

// 中间件
app.use(cors());
app.use(express.json());

// 初始化数据库
const db = new sqlite3.Database(path.join(__dirname, 'waitlist.db'), (err) => {
    if (err) {
        console.error('数据库连接失败:', err.message);
    } else {
        console.log('已连接到 SQLite 数据库');
        // 创建表
        db.run(`CREATE TABLE IF NOT EXISTS waitlist (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            posture_issue TEXT,
            time_commitment TEXT,
            price_range TEXT,
            source TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('创建表失败:', err.message);
            } else {
                console.log('等待列表数据表已就绪');
            }
        });
    }
});

// 提交等待列表
app.post('/api/waitlist', (req, res) => {
    const { email, posture_issue, time_commitment, price_range, source } = req.body;
    
    // 验证邮箱
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ 
            success: false, 
            error: '请输入有效的邮箱地址' 
        });
    }
    
    const sql = `INSERT INTO waitlist (email, posture_issue, time_commitment, price_range, source) 
                 VALUES (?, ?, ?, ?, ?)`;
    
    db.run(sql, [email, posture_issue || null, time_commitment || null, price_range || null, source || null], 
        function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(409).json({ 
                        success: false, 
                        error: '该邮箱已注册等待列表' 
                    });
                }
                return res.status(500).json({ 
                    success: false, 
                    error: '提交失败，请稍后重试' 
                });
            }
            
            console.log(`新等待列表用户：${email} (ID: ${this.lastID})`);
            res.status(201).json({ 
                success: true, 
                message: '🎉 感谢加入 DeskFix 等待列表！',
                id: this.lastID
            });
        }
    );
});

// 获取等待列表统计（管理后台用）
app.get('/api/waitlist/stats', (req, res) => {
    const stats = {};
    
    // 总用户数
    db.get('SELECT COUNT(*) as count FROM waitlist', (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        stats.total = row.count;
        
        // 按体态问题统计
        db.all('SELECT posture_issue, COUNT(*) as count FROM waitlist GROUP BY posture_issue', 
            (err, rows) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                stats.by_posture_issue = rows;
                
                // 按来源统计
                db.all('SELECT source, COUNT(*) as count FROM waitlist GROUP BY source', 
                    (err, rows) => {
                        if (err) {
                            return res.status(500).json({ error: err.message });
                        }
                        stats.by_source = rows;
                        
                        // 最近 7 天新增
                        db.get(`SELECT COUNT(*) as count FROM waitlist 
                                WHERE created_at >= datetime('now', '-7 days')`, 
                            (err, row) => {
                                if (err) {
                                    return res.status(500).json({ error: err.message });
                                }
                                stats.last_7_days = row.count;
                                
                                res.json(stats);
                            }
                        );
                    }
                );
            }
        );
    });
});

// 获取所有等待列表用户（管理后台用，支持分页）
app.get('/api/waitlist/users', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;
    
    db.all(`SELECT * FROM waitlist ORDER BY created_at DESC LIMIT ? OFFSET ?`, 
        [limit, offset], 
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            
            // 获取总数
            db.get('SELECT COUNT(*) as count FROM waitlist', (err, row) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                
                res.json({
                    total: row.count,
                    page: page,
                    limit: limit,
                    users: rows
                });
            });
        }
    );
});

// 导出 CSV
app.get('/api/waitlist/export', (req, res) => {
    db.all('SELECT * FROM waitlist ORDER BY created_at DESC', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        // 生成 CSV
        const csvHeader = 'ID,邮箱，体态问题，时间承诺，价格区间，来源，创建时间\n';
        const csvRows = rows.map(row => 
            `${row.id},"${row.email}","${row.posture_issue || ''}","${row.time_commitment || ''}","${row.price_range || ''}","${row.source || ''}","${row.created_at}"`
        ).join('\n');
        
        const csv = csvHeader + csvRows;
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="deskfix-waitlist.csv"');
        res.send(csv);
    });
});

// 健康检查
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'deskfix-waitlist' });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`DeskFix 等待列表服务运行在 http://localhost:${PORT}`);
    console.log(`API 端点:`);
    console.log(`  POST /api/waitlist - 提交等待列表`);
    console.log(`  GET  /api/waitlist/stats - 获取统计`);
    console.log(`  GET  /api/waitlist/users - 获取用户列表`);
    console.log(`  GET  /api/waitlist/export - 导出 CSV`);
});
