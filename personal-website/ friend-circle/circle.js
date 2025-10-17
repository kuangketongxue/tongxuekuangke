// 加载朋友圈动态
function loadPosts() {
  const Post = AV.Object.extend('Post');
  const query = new AV.Query(Post);
  query.equalTo('type', 'friendCircle'); // 只加载朋友圈类型
  query.include('author'); // 关联查询作者信息
  query.descending('createdAt'); // 最新的在前面
  query.find().then(posts => {
    const postList = document.getElementById('post-list');
    postList.innerHTML = ''; // 清空列表
    posts.forEach(post => {
      const data = post.toJSON();
      // 渲染单条动态
      postList.innerHTML += `
        <div class="post-item" id="post-${data.objectId}">
          <div class="post-meta">
            <strong>${data.author.username}</strong> · ${new Date(data.createdAt).toLocaleString()}
          </div>
          <div class="post-content">${data.content}</div>
          <div class="interaction">
            <button onclick="likePost('${data.objectId}')">
              点赞(${data.likeCount || 0})
            </button>
            <button onclick="showComments('${data.objectId}')">
              评论(${data.commentCount || 0})
            </button>
          </div>
          <div class="comment-list" id="comments-${data.objectId}"></div>
          <div class="comment-input">
            <input type="text" placeholder="写评论..." id="comment-input-${data.objectId}">
            <button onclick="addComment('${data.objectId}')">发送</button>
          </div>
        </div>
      `;
    });
  });
}

// 点赞功能
function likePost(postId) {
  const user = AV.User.current();
  if (!user) { alert('请先登录！'); return; }
  
  const Like = AV.Object.extend('Like');
  const query = new AV.Query(Like);
  query.equalTo('postId', postId);
  query.equalTo('userId', user.id);
  query.find().then(likes => {
    if (likes.length > 0) {
      // 已点赞，取消点赞
      likes[0].destroy().then(() => {
        updatePostLikeCount(postId, -1);
      });
    } else {
      // 未点赞，添加点赞
      const like = new Like();
      like.set('postId', postId);
      like.set('userId', user.id);
      like.save().then(() => {
        updatePostLikeCount(postId, 1);
      });
    }
  });
}

// 更新点赞数
function updatePostLikeCount(postId, change) {
  const post = AV.Object.createWithoutData('Post', postId);
  post.increment('likeCount', change);
  post.save().then(() => {
    loadPosts(); // 重新加载列表
  });
}

// 显示评论
function showComments(postId) {
  const Comment = AV.Object.extend('Comment');
  const query = new AV.Query(Comment);
  query.equalTo('postId', postId);
  query.include('author');
  query.find().then(comments => {
    const commentList = document.getElementById(`comments-${postId}`);
    commentList.innerHTML = '';
    comments.forEach(comment => {
      const data = comment.toJSON();
      commentList.innerHTML += `
        <div class="comment-item">
          <strong>${data.author.username}</strong>：${data.content}
        </div>
      `;
    });
  });
}

// 添加评论
function addComment(postId) {
  const user = AV.User.current();
  if (!user) { alert('请先登录！'); return; }
  
  const content = document.getElementById(`comment-input-${postId}`).value;
  if (!content) return;
  
  const Comment = AV.Object.extend('Comment');
  const comment = new Comment();
  comment.set('postId', postId);
  comment.set('content', content);
  comment.set('author', user);
  comment.save().then(() => {
    // 更新评论数
    const post = AV.Object.createWithoutData('Post', postId);
    post.increment('commentCount', 1);
    post.save().then(() => {
      document.getElementById(`comment-input-${postId}`).value = '';
      loadPosts(); // 重新加载
    });
  });
}

// 页面加载时加载动态
loadPosts();
