// 配置项
const CONFIG = {
    password: 'qingyin', // 设置你的密码
    sessionKey: 'examAccess',
    subjects: {
        chinese: '',    // 在这里填入语文资料链接
        math: '',       // 在这里填入数学资料链接
        english: '',    // 在这里填入英语资料链接
        chemistry: '',  // 在这里填入化学资料链接
        politics: '',   // 在这里填入政治资料链接
        physics: ''     // 在这里填入物理资料链接
    }
};

// 页面加载时检查登录状态
window.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = sessionStorage.getItem(CONFIG.sessionKey);
    
    if (isLoggedIn === 'true') {
        // 已登录，显示主内容
        showMainContent();
    } else {
        // 未登录，显示登录框
        showLoginModal();
    }

    // 回车键登录
    document.getElementById('passwordInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            verifyPassword();
        }
    });
});

// 显示登录模态框
function showLoginModal() {
    document.getElementById('loginModal').style.display = 'flex';
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('passwordInput').focus();
}

// 显示主内容
function showMainContent() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
}

// 验证密码
function verifyPassword() {
    const inputPassword = document.getElementById('passwordInput').value;
    const errorMessage = document.getElementById('errorMessage');
    
    if (inputPassword === CONFIG.password) {
        // 密码正确
        sessionStorage.setItem(CONFIG.sessionKey, 'true');
        errorMessage.style.display = 'none';
        showMainContent();
        
        // 清空密码输入框
        document.getElementById('passwordInput').value = '';
    } else {
        // 密码错误
        errorMessage.style.display = 'block';
        document.getElementById('passwordInput').value = '';
        document.getElementById('passwordInput').focus();
        
        // 3秒后隐藏错误提示
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 3000);
    }
}

// 退出登录
function logout() {
    if (confirm('确定要退出吗？')) {
        sessionStorage.removeItem(CONFIG.sessionKey);
        showLoginModal();
    }
}

// 打开科目链接
function openSubject(subjectId, event) {
    event.preventDefault();
    
    const link = CONFIG.subjects[subjectId];
    
    if (link && link.trim() !== '') {
        // 如果链接存在，在新标签页打开
        window.open(link, '_blank');
    } else {
        // 如果链接为空，提示用户
        alert('该科目资料链接尚未配置，请联系管理员添加！');
    }
}

// 防止页面后退到登录状态
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        const isLoggedIn = sessionStorage.getItem(CONFIG.sessionKey);
        if (isLoggedIn === 'true') {
            showMainContent();
        } else {
            showLoginModal();
        }
    }
});
