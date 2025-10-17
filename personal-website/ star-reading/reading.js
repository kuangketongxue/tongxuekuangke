// 文章列表（每天更新时，在这里添加新文章的日期和标题）
const articles = [
  { date: '20251017', title: 'AI时代的阅读方式' },
  { date: '20251016', title: '如何培养终身学习习惯' },
  // 新增文章时按这个格式添加
];

// 加载文章列表
function loadArticleList() {
  const listContainer = document.getElementById('article-list');
  // 按日期倒序排序（最新的在前面）
  articles.sort((a, b) => b.date - a.date).forEach(article => {
    const item = document.createElement('div');
    item.className = 'article-item';
    item.innerHTML = `
      <h3>${article.title}</h3>
      <p>日期：${formatDate(article.date)}</p>
    `;
    // 点击加载文章内容
    item.onclick = () => loadArticleContent(article.date, article.title);
    listContainer.appendChild(item);
  });
}

// 格式化日期（20251017 → 2025-10-17）
function formatDate(dateStr) {
  return `${dateStr.slice(0,4)}-${dateStr.slice(4,6)}-${dateStr.slice(6,8)}`;
}

// 加载文章内容（读取Markdown文件）
function loadArticleContent(date, title) {
  const contentContainer = document.getElementById('article-content');
  contentContainer.innerHTML = '<p>加载中...</p>';
  
  // 读取对应的Markdown文件（需放在articles目录）
  fetch(`articles/${date}.md`)
    .then(res => {
      if (!res.ok) throw new Error('文章不存在');
      return res.text();
    })
    .then(markdown => {
      // 将Markdown转为HTML并显示
      contentContainer.innerHTML = `
        <h2>${title}</h2>
        <p>日期：${formatDate(date)}</p>
        <hr>
        ${marked.parse(markdown)}
      `;
      // 滚动到内容区域
      contentContainer.scrollIntoView({ behavior: 'smooth' });
    })
    .catch(err => {
      contentContainer.innerHTML = `<p>错误：${err.message}</p>`;
    });
}

// 页面加载时显示列表
loadArticleList();
