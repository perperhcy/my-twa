// 等待 Telegram Web App 准备就绪
Telegram.WebApp.ready();

// 获取转发按钮
const forwardButton = document.getElementById('forwardButton');

// 转发按钮点击事件处理程序
forwardButton.addEventListener('click', () => {
    Telegram.WebApp.openTelegramLink('https://t.me/share/url?url=https://t.me/Funtonbot/gameapp?startapp=rp_8681hnq4');
});
