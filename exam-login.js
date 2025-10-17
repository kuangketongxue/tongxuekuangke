// 配置区域 - 在这里修改密码和外部链接
const CONFIG = {
    // 访问密码（可以修改）
    password: "exam2024",
    
    // 会话有效期（24小时，单位：毫秒）
    sessionDuration: 24 * 60 * 60 * 1000,
    
    // 外部链接配置
    links: {
        // 高考科目链接
        gaokao: {
            chinese: "https://example.com/gaokao/chinese",      // 语文
            math: "https://example.com/gaokao/math",           // 数学
            english: "https://example.com/gaokao/english",     // 英语
            chemistry: "https://example.com/gaokao/chemistry", // 化学
            politics: "https://example.com/gaokao/politics",   // 政治
            physics: "https://example.com/gaokao/physics"      // 物理
        },
        // 考研资源链接
        kaoyan: {
            "kaoyan-1": "https://example.com/kaoyan/resource1",
            "kaoyan-2": "https://example.com/kaoyan/resource2",
            "kaoyan-3": "https://example.com/kaoyan/resource3"
        }
    }
};

// 检查登录状态
function checkLoginStatus() {
    const loginTime = localStorage.getItem('examLoginTime');
    const currentTime = new Date().getTime();
    
    if (loginTime) {
        const timeElapsed = currentTime - parseInt(loginTime);
        
        // 如果在有效期内，直接显示主内容
        if (timeElapsed < CONFIG.sessionDuration) {
            showMainContent();
            return true;
        } else {
            // 会话过期，清除登录状态
            localStorage.removeItem('examLoginTime');
        }
    }
    
    return false;
}

// 密码验证函数
function checkPassword() {
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');
    const inputPassword = passwordInput.value;
    
    if (inputPassword === CONFIG.password) {
        // 密码正确，保存登录时间
        const currentTime = new Date().getTime();
        localStorage.setItem('examLoginTime', currentTime.toString());
        
        // 隐藏错误信息
        errorMessage.style.display = 'none';
        
        // 显示主内容
        showMainContent();
        
        // 清空密码输入框
        passwordInput.value = '';
    } else {
        // 密码错误
        errorMessage.style.display = 'block';
        passwordInput.value = '';
        passwordInput.focus();
        
        // 添加抖动效果
        passwordInput.style.animation = 'shake 0.5s';
        setTimeout(() => {
            passwordInput.style.animation = '';
        }, 500);
    }
}

// 显示主内容
function showMainContent() {
    const loginContainer = document.getElementById('loginContainer');
    const mainContainer = document.getElementById('mainContainer');
    
    // 隐藏登录界面
    loginContainer.style.display = 'none';
    
    // 显示主内容
    mainContainer.style.display = 'block';
    
    // 初始化链接
    initializeLinks();
}

// 初始化所有链接
function initializeLinks() {
    // 获取所有科目链接
    const subjectLinks = document.querySelectorAll('.subject-link');
    
    subjectLinks.forEach(link => {
        const subject = link.getAttribute('data-subject');
        
        // 根据科目ID设置对应的外部链接
        if (CONFIG.links.gaokao[subject]) {
            link.href = CONFIG.links.gaokao[subject];
            link.target = "_blank"; // 在新标签页打开
        } else if (CONFIG.links.kaoyan[subject]) {
            link.href = CONFIG.links.kaoyan[subject];
            link.target = "_blank";
        } else {
            // 如果没有配置链接，点击时提示
            link.href = "javascript:void(0)";
            link.addEventListener('click', (e) => {
                e.preventDefault();
                alert('该资源链接尚未配置，请联系管理员');
            });
        }
    });
}

// 退出登录
function logout() {
    if (confirm('确定要退出登录吗？')) {
        // 清除登录状态
        localStorage.removeItem('examLoginTime');
        
        // 隐藏主内容
        document.getElementById('mainContainer').style.display = 'none';
        
        // 显示登录界面
        document.getElementById('loginContainer').style.display = 'block';
        
        // 清空密码输入框
        document.getElementById('password').value = '';
    }
}

// 支持回车键登录
document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('password');
    
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkPassword();
            }
        });
        
        // 自动聚焦到密码输入框
        passwordInput.focus();
    }
    
    // 页面加载时检查登录状态
    checkLoginStatus();
});

// 添加抖动动画的CSS（通过JavaScript动态添加）
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);
