// 等待 Telegram Web App 准备就绪
Telegram.WebApp.ready();

// 获取分享按钮
const shareButton = document.getElementById('shareButton');

// 分享按钮点击事件处理程序
shareButton.addEventListener('click', () => {
    // 显示分享弹窗
    Telegram.WebApp.showPopup({
        title: "Share this content",
        message: "Do you want to share this content?",
        buttons: [
            {
                id: "share",
                type: "default",
                text: "Share",
            },
            {
                id: "cancel",
                type: "default",
                text: "Cancel",
            },
        ],
    }).then(buttonId => {
        if (buttonId === "share") {
            // 定义分享内容
            const shareOptions = {
                url: "https://example.com",  // 分享的链接
                text: "Check out this awesome content!",  // 分享的文本内容
            };

            // 调用分享 API
            Telegram.WebApp.shareInvoice(shareOptions)
                .then(result => {
                    console.log("Share successful:", result);
                })
                .catch(error => {
                    console.error("Share failed:", error);
                });
        } else {
            console.log("Share canceled");
        }
    });
});
