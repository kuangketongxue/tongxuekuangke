// 检查用户是否付费
function checkPaid() {
  const user = AV.User.current();
  if (!user) {
    showUnpaidContent('请先登录后查看');
    return;
  }
  
  // 获取用户付费状态（isPaid: true/false, expireTime: 有效期）
  user.fetch().then(user => {
    const isPaid = user.get('isPaid') || false;
    const expireTime = user.get('expireTime') || 0;
    const now = new Date().getTime();
    
    if (isPaid && now < expireTime) {
      showPaidContent(); // 已付费且在有效期内
    } else {
      showUnpaidContent('该内容为付费订阅，点击下方按钮购买');
    }
  });
}

// 显示未付费内容
function showUnpaidContent(message) {
  document.getElementById('content-area').innerHTML = `
    <p>${message}</p>
    <button onclick="showPayment()">立即订阅（¥99/年）</button>
  `;
}

// 显示付费内容（AI RSS列表）
function showPaidContent() {
  const rssList = [
    { title: 'AI Research Weekly', url: 'https://example.com/ai-research.rss' },
    { title: '机器学习前沿', url: 'https://example.com/ml-frontier.rss' },
    { title: 'GPT最新进展', url: 'https://example.com/gpt-news.rss' }
  ];
  
  let html = '<h3>订阅源列表</h3>';
  rssList.forEach(item => {
    html += `<div class="post-item">
      <a href="${item.url}" target="_blank">${item.title}</a>
    </div>`;
  });
  document.getElementById('content-area').innerHTML = html;
}

// 显示支付页面（实际项目需集成支付接口）
function showPayment() {
  alert('支付功能开发中，暂支持线下转账后联系管理员开通');
  // 实际应跳转支付链接，支付成功后通过LeanCloud云函数更新用户isPaid状态
}

// 页面加载时检查权限
checkPaid();
