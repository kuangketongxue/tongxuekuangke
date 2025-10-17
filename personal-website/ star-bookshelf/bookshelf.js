// 加载书籍列表
function loadBooks() {
  const Book = AV.Object.extend('Book');
  const query = new AV.Query(Book);
  query.descending('createdAt');
  query.find().then(books => {
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = '';
    books.forEach(book => {
      const data = book.toJSON();
      // 状态样式映射
      const statusMap = {
        reading: { text: '在读', class: 'status-reading' },
        read: { text: '已读', class: 'status-read' },
        want: { text: '想读', class: 'status-want' }
      };
      const status = statusMap[data.status] || statusMap.want;
      
      bookList.innerHTML += `
        <div class="book-item">
          <div class="book-cover">
            ${data.coverUrl ? `<img src="${data.coverUrl}" alt="${data.title}">` : '无封面'}
          </div>
          <div class="book-info">
            <h3>${data.title}</h3>
            <p>作者：${data.author || '未知'}</p>
            <span class="book-status ${status.class}">${status.text}</span>
          </div>
        </div>
      `;
    });
  });
}

loadBooks();
