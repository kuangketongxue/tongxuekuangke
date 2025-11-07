// api/submit-message.js
export default async function handler(req, res) {
    // 设置CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // 处理OPTIONS预检请求
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // 只允许POST请求
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { userName, userEmail, messageContent } = req.body;

        // 验证必填字段
        if (!userName || !messageContent) {
            return res.status(400).json({ error: '昵称和留言内容不能为空' });
        }

        // 获取客户端信息
        const userAgent = req.headers['user-agent'] || '未知';
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '未知';
        
        // 构建Issue内容
        const issueBody = `**昵称:** ${userName}
**邮箱:** ${userEmail || '未提供'}
**时间:** ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}
**IP地址:** ${ip}
**浏览器:** ${userAgent}

---

${messageContent}`;

        // 调用GitHub API
        const response = await fetch(
            `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/issues`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `token ${process.env.GITHUB_TOKEN}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github.v3+json'
                },
                body: JSON.stringify({
                    title: `💬 留言来自: ${userName}`,
                    body: issueBody,
                    labels: ['留言', '待处理']
                })
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error('GitHub API Error:', errorData);
            throw new Error('GitHub API请求失败');
        }

        const data = await response.json();
        
        return res.status(200).json({ 
            success: true, 
            message: '留言发送成功',
            issueNumber: data.number 
        });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ 
            error: '服务器错误，请稍后重试',
            details: error.message 
        });
    }
}
