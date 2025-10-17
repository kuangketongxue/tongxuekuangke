// 付费内容访问控制
const PREMIUM_PAGES = ['ai-rss', 'exam'];
const ACCESS_CODE = 'qingyin'; // 设置访问码

function checkPremiumAccess() {
    const currentPath = window.location.pathname;
    const isPremiumPage = PREMIUM_PAGES.some(page => currentPath.includes(page));
    
    if (isPremiumPage) {
        const hasAccess = localStorage.getItem('premiumAccess') === 'true';
        
        if (!hasAccess) {
            showAccessPrompt();
        }
    }
}

function showAccessPrompt() {
    const code = prompt('此内容需要会员访问码，请输入访问码：');
    
    if (code === ACCESS_CODE) {
        localStorage.setItem('premiumAccess', 'true');
        alert('验证成功！欢迎访问会员内容');
    } else if (code !== null) {
        alert('访问码错误！');
        window.location.href = '../';
    } else {
        window.location.href = '../';
    }
}

// 页面加载时检查
document.addEventListener('DOMContentLoaded', checkPremiumAccess);
