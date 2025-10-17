// LeanCloud 配置
const LEANCLOUD_CONFIG = {
    appId: '2pmu0Y0IKEfIKXhdJHNEd1uU-gzGzoHsz',      // 替换为你的 AppId
    appKey: 'cbLreTdVyxyXuWgmfwdQxPFF',    // 替换为你的 AppKey
    serverURL: 'https://2pmu0y0i.lc-cn-n1-shared.com' // 替换为你的 ServerURL
};

// 初始化 LeanCloud
function initLeanCloud() {
    AV.init(LEANCLOUD_CONFIG);
}

// 点赞功能
async function handleLike(type, id) {
    try {
        const Like = AV.Object.extend('Like');
        const query = new AV.Query('Like');
        query.equalTo('type', type);
        query.equalTo('itemId', id);
        
        // 获取用户标识（可以用 localStorage 或 cookie）
        const userId = getUserId();
        query.equalTo('userId', userId);
        
        const existingLike = await query.first();
        
        if (existingLike) {
            // 已点赞，取消点赞
            await existingLike.destroy();
            updateLikeCount(id, -1);
        } else {
            // 未点赞，添加点赞
            const like = new Like();
            like.set('type', type);
            like.set('itemId', id);
            like.set('userId', userId);
            await like.save();
            updateLikeCount(id, 1);
        }
    } catch (error) {
        console.error('点赞操作失败:', error);
    }
}

// 加载互动数据（点赞和评论）
async function loadInteractions(type, id) {
    try {
        // 加载点赞数
        const Like = AV.Object.extend('Like');
        const likeQuery = new AV.Query('Like');
        likeQuery.equalTo('type', type);
        likeQuery.equalTo('itemId', id);
        const likeCount = await likeQuery.count();
        
        // 更新点赞显示
        const likeBtn = document.querySelector(`[data-id="${id}"] .like-count`);
        if (likeBtn) {
            likeBtn.textContent = likeCount;
        }
        
        // 加载评论
        const Comment = AV.Object.extend('Comment');
        const commentQuery = new AV.Query('Comment');
        commentQuery.equalTo('type', type);
        commentQuery.equalTo('itemId', id);
        commentQuery.descending('createdAt');
        const comments = await commentQuery.find();
        
        renderComments(id, comments);
    } catch (error) {
        console.error('加载互动数据失败:', error);
    }
}

// 显示评论区
function showComments(id) {
    const commentsSection = document.getElementById(`comments-${id}`);
    if (commentsSection.style.display === 'none') {
        commentsSection.style.display = 'block';
        loadComments(id);
    } else {
        commentsSection.style.display = 'none';
    }
}

// 渲染评论
function renderComments(id, comments) {
    const commentsSection = document.getElementById(`comments-${id}`);
    if (!commentsSection) return;
    
    commentsSection.innerHTML = `
        <div class="comment-input">
            <input type="text" placeholder="说点什么..." id="comment-input-${id}">
            <button onclick="submitComment('${id}')">发送</button>
        </div>
        <div class="comment-list">
            ${comments.map(comment => `
                <div class="comment-item">
                    <div class="comment-header">
                        <span class="comment-user">${comment.get('nickname') || '匿名用户'}</span>
                        <span class="comment-time">${formatTime(comment.createdAt)}</span>
                    </div>
                    <div class="comment-content">${comment.get('content')}</div>
                </div>
            `).join('')}
        </div>
    `;
}

// 提交评论
async function submitComment(id) {
    const input = document.getElementById(`comment-input-${id}`);
    const content = input.value.trim();
    
    if (!content) {
        alert('请输入评论内容');
        return;
    }
    
    try {
        const Comment = AV.Object.extend('Comment');
        const comment = new Comment();
        comment.set('itemId', id);
        comment.set('content', content);
        comment.set('userId', getUserId());
        comment.set('nickname', getUserNickname());
        
        await comment.save();
        input.value = '';
        
        // 重新加载评论
        const commentQuery = new AV.Query('Comment');
        commentQuery.equalTo('itemId', id);
        commentQuery.descending('createdAt');
        const comments = await commentQuery.find();
        renderComments(id, comments);
    } catch (error) {
        console.error('评论失败:', error);
        alert('评论失败，请重试');
    }
}

// 获取用户ID（简单实现）
function getUserId() {
    let userId = localStorage.getItem('userId');
    if (!userId) {
        userId = 'user_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('userId', userId);
    }
    return userId;
}

// 获取用户昵称
function getUserNickname() {
    let nickname = localStorage.getItem('userNickname');
    if (!nickname) {
        nickname = prompt('请输入您的昵称：') || '匿名用户';
        localStorage.setItem('userNickname', nickname);
    }
    return nickname;
}

// 更新点赞数
function updateLikeCount(id, delta) {
    const likeCount = document.querySelector(`[data-id="${id}"] .like-count`);
    if (likeCount) {
        const current = parseInt(likeCount.textContent) || 0;
        likeCount.textContent = current + delta;
    }
}

// 格式化时间
function formatTime(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}小时前`;
    
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}天前`;
    
    return date.toLocaleDateString('zh-CN');
}
