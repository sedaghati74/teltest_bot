const TelegramBot = require('node-telegram-bot-api');
const path = require('path');
const fs = require('fs');

// توکن شما
const token = '7260182822:AAFz-A0-0OvONva9EL8qSfVuzfb_o5plTww';

// ایجاد یک نمونه از بات
const bot = new TelegramBot(token, { polling: true });

// وقتی کاربر دستور /start رو ارسال میکنه
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    // ایجاد دکمه
    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'کس ننش', callback_data: 'send_video' }]
            ]
        }
    };

    // ارسال پیام خوشامدگویی با دکمه
    bot.sendMessage(chatId, 'خوش آمدید به جمع عاشقان زنازاده. ۱۰ ثانیه فرصت داری تا با کلیک کردن روی دکمه زیر ارادتت رو به رضازاده نشون بدی', options);
});

// وقتی کاربر روی دکمه کلیک می‌کند
bot.on('callback_query', (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;

    if (callbackQuery.data === 'send_video') {
        // مسیر فایل ویدیو
        const videoPath = path.join(__dirname, 'zenazade.mp4');

        // چک کردن اینکه فایل موجود است یا نه
        if (fs.existsSync(videoPath)) {
            bot.sendVideo(chatId, fs.createReadStream(videoPath), {
                caption: '🔥 برای دریافت فیلم کامل این خیانتکار ابتدا به ۱۶۳ کانال ما عضو بشید و بعد از خرید اشتراک ۲۰۰ دلاری بنویسید *ندارم* 🔥',
                parse_mode: 'Markdown'
            })
                .then(() => console.log('ویدیو ارسال شد'))
                .catch((error) => console.error('خطا در ارسال ویدیو:', error));
        } else {
            bot.sendMessage(chatId, 'ویدیو موجود نیست 😕');
        }
    }

    // پاسخ به کلیک روی دکمه
    bot.answerCallbackQuery(callbackQuery.id);
});

// ✅ وقتی کاربر `ندارم` رو می‌نویسه → عکس ارسال میشه
bot.onText(/ندارم/, (msg) => {
    const chatId = msg.chat.id;

    // مسیر فایل عکس
    const photoPath = path.join(__dirname, 'salam.webp');

    fs.access(photoPath, fs.constants.F_OK, (err) => {
        if (!err) {
            bot.sendPhoto(chatId, fs.createReadStream(photoPath), {
                caption: ''
            })
                .then(() => console.log('✅ عکس ارسال شد'))
                .catch((error) => console.error('❌ خطا در ارسال عکس:', error));
        } else {
            bot.sendMessage(chatId, '❌ عکس موجود نیست 😕');
            console.error('❌ فایل پیدا نشد:', err);
        }
    })});