// 等待 Telegram Web App 准备就绪
Telegram.WebApp.ready();

// 获取转发按钮
const forwardButton = document.getElementById('forwardButton');

// 转发按钮点击事件处理程序
forwardButton.addEventListener('click', () => {
    // 定义要转发的消息ID和聊天ID
    const messageId = 123; // 需要替换为实际的消息ID
    const chatId = -123456789; // 需要替换为实际的聊天ID

    // 创建转发链接
    const deeplink = `https://t.me/share/url?url=https://example.com&text=Check out this awesome content!`;

    // 打开转发链接
    window.open(deeplink, '_blank');

    // 关闭 Mini App
    Telegram.WebApp.close();
});
