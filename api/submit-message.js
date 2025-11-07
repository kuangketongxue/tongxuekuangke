export default async function handler(req, res) {
  // 设置CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // 处理OPTIONS预检请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 只允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method Not Allowed' 
    });
  }

  try {
    const { userName, userEmail, messageContent } = req.body;

    // 验证必填字段
    if (!userName || !messageContent) {
      return res.status(400).json({
        success: false,
        error: '昵称和留言内容不能为空'
      });
    }

    // 这里可以添加数据库存储逻辑
    console.log('收到留言:', {
      userName,
      userEmail,
      messageContent,
      timestamp: new Date().toISOString()
    });

    // 返回成功
    return res.status(200).json({
      success: true,
      message: '留言已收到'
    });

  } catch (error) {
    console.error('处理留言失败:', error);
    return res.status(500).json({
      success: false,
      error: '服务器错误'
    });
  }
}
