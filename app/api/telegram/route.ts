bot.on('message', (msg: any) => {
    const chatId = msg.chat.id;

    if (msg.text?.startsWith('/connect')) {

        const webAppUrl = `https://wallet.bitte.ai/account/new?password=true`;

        const opts = {
            reply_markup: {
                inline_keyboard: [
                    [{text: "Open Web App", web_app: {url: webAppUrl}}]
                ]
            }
        };
        bot.sendMessage(chatId, messageText, opts);
    } else {
        bot.sendMessage(chatId, 'Send connect to open wallet');
    }
});