function checkPaid() {
  const user = AV.User.current();
  if (!user) {
    showUnpaidContent('请先登录后查看');
    return;
  }
  
  user.fetch().then(user => {
    const isPaid = user.get('isPaid') || false;
    const expireTime = user.get('expireTime') || 0;
    const now = new Date().getTime();
    
    if (isPaid && now < expireTime) {
      showPaidContent();
    } else {
      showUnpaidContent('该内容为付费服务，点击下方按钮购买');
    }
  });
}

function showUnpaidContent(message) {
  document.getElementById('content-area').innerHTML = `
    <p>${message}</p>
    <button onclick="showPayment()">立即购买（¥199/年）</button>
  `;
}

// 显示考试资料（付费内容）
function showPaidContent() {
  const materials = [
    { title: '计算机考研历年真题', url: 'https://example.com/exam1.pdf' },
    { title: '英语六级高频词汇', url: 'https://example.com/exam2.pdf' },
    { title: '行测答题技巧笔记', url: 'https://example.com/exam3.pdf' }
  ];
  
  let html = '<h3>考试资料列表</h3>';
  materials.forEach(item => {
    html += `<div class="post-item">
      <a href="${item.url}" target="_blank">${item.title}</a>
    </div>`;
  });
  document.getElementById('content-area').innerHTML = html;
}

function showPayment() {
  alert('支付功能开发中，暂支持线下转账后联系管理员开通');
}

checkPaid();
