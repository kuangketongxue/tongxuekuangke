// 配置区域
const CONFIG = {
    // 动态密码配置
    passwordConfig: {
        // 密码有效期（单位：小时）
        validHours: 24,
        // 密码更新时间（每天凌晨0点更新）
        updateHour: 0,
        // 密码种子（用于生成密码，定期更换这个值）
        seed: "EXAM2024SECRET"
    },
    
    // 会话有效期（24小时）
    sessionDuration: 24 * 60 * 60 * 1000,
    
    // 外部链接配置
    links: {
        gaokao: {
            chinese: "https://example.com/gaokao/chinese",
            math: "https://example.com/gaokao/math",
            english: "https://example.com/gaokao/english",
            chemistry: "https://example.com/gaokao/chemistry",
            politics: "https://example.com/gaokao/politics",
            physics: "https://example.com/gaokao/physics"
        },
        kaoyan: {
            "kaoyan-1": "https://example.com/kaoyan/resource1",
            "kaoyan-2": "https://example.com/kaoyan/resource2",
            "kaoyan-3": "https://example.com/kaoyan/resource3"
        }
    }
};

// 生成当前有效密码
function generateCurrentPassword() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    // 基于日期生成密码：EXAM + 年月日 + 简单hash
    const dateStr = `${year}${month}${day}`;
    const hash = simpleHash(dateStr + CONFIG.passwordConfig.seed);
    
    return `EXAM${dateStr}${hash}`;
}

// 简单哈希函数
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(36).substring(0, 4).toUpperCase();
}

// 显示当前有效密码（管理员功能）
function showCurrentPassword() {
    const currentPassword = generateCurrentPassword();
    const nextUpdate = getNextUpdateTime();
    
    console.log('='.repeat(50));
    console.log('📋 当前有效密码信息');
    console.log('='.repeat(50));
    console.log(`🔑 当前密码: ${currentPassword}`);
    console.log(`⏰ 下次更新: ${nextUpdate}`);
    console.log(`📅 今天日期: ${new Date().toLocaleDateString('zh-CN')}`);
    console.log('='.repeat(50));
    
    return currentPassword;
}

// 获取下次密码更新时间
function getNextUpdateTime() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(CONFIG.passwordConfig.updateHour, 0, 0, 0);
    
    return tomorrow.toLocaleString('zh-CN');
}

// 检查登录状态
function checkLoginStatus() {
    const loginTime = localStorage.getItem('examLoginTime');
    const loginDate = localStorage.getItem('examLoginDate');
    const currentTime = new Date().getTime();
    const currentDate = new Date().toDateString();
    
    if (loginTime && loginDate) {
        const timeElapsed = currentTime - parseInt(loginTime);
        
        // 检查是否跨天（密码已更新）
        if (loginDate !== currentDate) {
            console.log('⚠️ 密码已更新，请重新登录');
            logout();
            return false;
        }
        
        // 如果在有效期内，直接显示主内容
        if (timeElapsed < CONFIG.sessionDuration) {
            showMainContent();
            return true;
        } else {
            localStorage.removeItem('examLoginTime');
            localStorage.removeItem('examLoginDate');
        }
    }
    
    return false;
}

// 密码验证函数
function checkPassword() {
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');
    const inputPassword = passwordInput.value.trim();
    const currentPassword = generateCurrentPassword();
    
    if (inputPassword === currentPassword) {
        // 密码正确，保存登录信息
        const currentTime = new Date().getTime();
        const currentDate = new Date().toDateString();
        
        localStorage.setItem('examLoginTime', currentTime.toString());
        localStorage.setItem('examLoginDate', currentDate);
        
        errorMessage.style.display = 'none';
        showMainContent();
        passwordInput.value = '';
        
        console.log('✅ 登录成功！');
    } else {
        // 密码错误
        errorMessage.textContent = '密码错误或已过期，请联系管理员获取最新密码';
        errorMessage.style.display = 'block';
        passwordInput.value = '';
        passwordInput.focus();
        
        passwordInput.style.animation = 'shake 0.5s';
        setTimeout(() => {
            passwordInput.style.animation = '';
        }, 500);
        
        console.log('❌ 密码错误！');
        console.log(`💡 提示：如果是管理员，请在控制台输入 showCurrentPassword() 查看当前密码`);
    }
}

// 显示主内容
function showMainContent() {
    const loginContainer = document.getElementById('loginContainer');
    const mainContainer = document.getElementById('mainContainer');
    
    loginContainer.style.display = 'none';
    mainContainer.style.display = 'block';
    
    initializeLinks();
    
    // 显示密码有效期提示
    showPasswordExpireNotice();
}

// 显示密码过期提醒
function showPasswordExpireNotice() {
    const nextUpdate = getNextUpdateTime();
    console.log(`ℹ️ 当前密码有效至: ${nextUpdate}`);
}

// 初始化所有链接
function initializeLinks() {
    const subjectLinks = document.querySelectorAll('.subject-link');
    
    subjectLinks.forEach(link => {
        const subject = link.getAttribute('data-subject');
        
        if (CONFIG.links.gaokao[subject]) {
            link.href = CONFIG.links.gaokao[subject];
            link.target = "_blank";
        } else if (CONFIG.links.kaoyan[subject]) {
            link.href = CONFIG.links.kaoyan[subject];
            link.target = "_blank";
        } else {
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
    localStorage.removeItem('examLoginTime');
    localStorage.removeItem('examLoginDate');
    
    document.getElementById('mainContainer').style.display = 'none';
    document.getElementById('loginContainer').style.display = 'block';
    document.getElementById('password').value = '';
    
    console.log('👋 已退出登录');
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('password');
    
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkPassword();
            }
        });
        passwordInput.focus();
    }
    
    checkLoginStatus();
    
    // 自动检查密码是否过期（每小时检查一次）
    setInterval(() => {
        const loginDate = localStorage.getItem('examLoginDate');
        const currentDate = new Date().toDateString();
        
        if (loginDate && loginDate !== currentDate) {
            alert('密码已更新，请重新登录获取最新内容');
            logout();
        }
    }, 60 * 60 * 1000); // 每小时检查一次
});

// 添加抖动动画
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

// 管理员工具：在浏览器控制台使用
console.log('💡 管理员提示：在控制台输入 showCurrentPassword() 查看当前有效密码');
