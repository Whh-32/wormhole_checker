require('dotenv').config();

const { Telegraf, Markup } = require('telegraf');
const { validateIP } = require('./functions/validateIP')
const bot = new Telegraf(process.env.BOT_TOKEN);
const CHANNEL_ID = '@wormhole_tunnel';

//start bot handler
bot.start((ctx) => {
    main_menu(ctx)
});

//main menu
const main_menu = async (ctx) => {
    try {
        const chatMember = await ctx.telegram.getChatMember(CHANNEL_ID, ctx.from.id);
        if (chatMember.status === 'member' || chatMember.status === 'administrator' || chatMember.status === 'creator') {
            ctx.reply(`خوش اومدی ${chatMember.user.username} عزیز!\n\nبا استفاده از منوی زیر میتوانی از امکانات مدیریت سرور vpn استفاده کنی 👾\n\n- در هر بخش توضیحات تکمیلی برای هر سرویس وجود دارد.`, Markup.inlineKeyboard([
                [Markup.button.callback('برسی دامنه و آیپی ✅', 'ip_and_domain_checker')],
                [Markup.button.callback('پیدا کردن و ست کردن آیپی جدید ⚙️', 'set_ip_or_domain_menu')]
            ]));
        } else {
            ctx.reply('برای استفاده از ربات لطفا در چنل ما عضو شوید.', Markup.inlineKeyboard(Markup.button.url(`https://t.me/wormhole_tunnel`)))
        }
    } catch (error) {
        console.error(error);
        ctx.reply('مشکلی پیش آمده لطفا به پشتیبانی گزارش دهید 🚨');
    }
}

//sub menu ip_and_domain_checker
bot.action('ip_and_domain_checker', (ctx) => {
    ctx.editMessageText('❇️ با استفاده از این سرویس دامنه و یا آیپی مورد نظر شما به صورت لحظه ای مورد برسی قرار میگیرد و در صورت اختلال شدید یا دان شدن آیپی یا دامنه شما به شما آلارم داده میشود.\n\n⚠️ در حال حاضر امکان اتصال چند آیپی و دامنه وجود ندارد و در صورت وارد کردن مجدد دامنه یا آیپی ،دامنه یا آیپی جدید جایگزین میشود.', Markup.inlineKeyboard([
        [Markup.button.callback('📋 برسی دامنه یا آیپی فعال', 'domain_checker')],
        [Markup.button.callback('➕ افزودن دامنه جدید', 'domain_checker')],
        [Markup.button.callback('➕ افزودن آیپی جدید', 'ip_checker')],
        [Markup.button.callback('بازگشت به منو اصلی', 'back_to_main_menu')]
    ]));
});

// get ip address from user
bot.action('ip_checker', (ctx) => {
    ctx.editMessageText('آیپی مورد نظر خود را برای برسی  وارد کنید.');

    bot.on('text', (ctx) => {
        const userInput = ctx.message.text;
        if (validateIP(userInput)) {
            ctx.reply(`✅  آیپی ${userInput} باموفقیت ثبت شد.\n\n🔸 آیپی مورد نظر پس از مدت یک هفته به صورت اتوماتیک از این سرویس لغو میشود و پیامی مبنی بر تمدید برای شما ارسال خواهد شد.\n\n🔹 این فراید برای پایین بردن ترافیک اضافی سمت سرور انجام میشود تا آیپی هایی که بلا استفاده شده اند حذف شوند.`, Markup.inlineKeyboard([
                Markup.button.callback('بازگشت به منو اصلی', 'back_to_main_menu')
            ]));
        } else {
            ctx.reply(`❌ آیپی وارد شده نادرست میباشد.\n\n🔸 آیپی باید شامل اعداد انگلیسی باشد و از رنج آیپی های پرایویت نباشد.\n\nمجدد آیپی خود را به صورت صحیح وارد کنید یا با استفاده از گزینه بازگشت به منو اصلی بازگردید.`, Markup.inlineKeyboard([
                Markup.button.callback('بازگشت به منو اصلی', 'back_to_main_menu')
            ]));
        }
    });
});

//get cdn company
bot.action('set_ip_or_domain_menu', (ctx) => {
    ctx.editMessageText('🌐 از CDN کدام یک از شرکت ها استفاده میکنید.', Markup.inlineKeyboard([
        [Markup.button.callback('Cloudflare', 'cloudflare_cdn')],
        [Markup.button.callback('Gcore', 'gcore_cdn')],
        [Markup.button.callback('بازگشت به منو اصلی', 'back_to_main_menu')]
    ]));
});


//back to mani menu
bot.action('back_to_main_menu', async (ctx) => {
    try {
        await ctx.deleteMessage(); // Delete the current message
        await main_menu(ctx); // Call the main menu function
    } catch (error) {
        console.error(error);
        await ctx.reply('مشکلی پیش آمده لطفا به پشتیبانی گزارش دهید 🚨');
    }
});

bot.launch();

