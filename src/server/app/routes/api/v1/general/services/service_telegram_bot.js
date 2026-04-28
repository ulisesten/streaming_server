const TelegramBot = require('node-telegram-bot-api');
const settings = require('../../../../../core/configuration')

class TelegramService {
    constructor() {
        this.token = process.env.TELEGRAM_BOT_TOKEN;
        this.chatId = process.env.TELEGRAM_CHAT_ID;
        this.bot = null;
        
        if (this.token && this.chatId) {
            this.bot = new TelegramBot(this.token, { polling: false });
        }
    }

    async sendMessage(text, options = {}) {
        if (!this.bot) {
            console.warn('Telegram bot no configurado');
            return false;
        }

        try {
            const messageOptions = {
                parse_mode: 'HTML',
                ...options
            };

            const result = await this.bot.sendMessage(this.chatId, text, messageOptions);
            console.log('✅ Mensaje enviado a Telegram');
            return result;
        } catch (error) {
            console.error('❌ Error enviando mensaje a Telegram:', error.message);
            return false;
        }
    }

    async sendHtmlMessage(htmlContent, options = {}) {
        return this.sendMessage(htmlContent, { 
            parse_mode: 'HTML',
            ...options 
        });
    }

    async sendMarkdownMessage(markdownContent, options = {}) {
        return this.sendMessage(markdownContent, { 
            parse_mode: 'MarkdownV2',
            ...options 
        });
    }

    async sendError(error, context = '') {
        const message = `
        🚨 <b>ERROR EN EL SISTEMA</b>

        <b>Contexto:</b> ${context}
        <b>Error:</b> <code>${error.message}</code>
        <b>Timestamp:</b> ${new Date().toISOString()}

        <pre>${error.stack}</pre>
                `.trim();

        return this.sendHtmlMessage(message);
    }

    async sendSuccess(message, title = '✅ ÉXITO') {
        const formattedMessage = `
        ${title}

        ${message}

        <b>Timestamp:</b> ${new Date().toISOString()}
        `.trim();

        return this.sendHtmlMessage(formattedMessage);
    }

    /**
     * @param videoData Object, Members: vid_title, vid_id_public, vid_thumbnail
     */
    async sendNewVideoNotification(videoData) {
        if (!this.bot) {
            console.warn('Telegram bot no configurado');
            return false;
        }


        let domain = settings.DOMAIN_NAME || 'http://localhost:3000';

        if (!domain.startsWith('http')) {
            domain = `https://${domain}`;
        }
        domain = domain.replace(/\/$/, '');

        const thumbnail = videoData.vid_thumbnail ? videoData.vid_thumbnail : null;
        let url_photo = null;
        if (thumbnail) {
            url_photo = `${domain}/api/v1/videos/thumbnails/${thumbnail}.jpg`;
        }
        const vid_url = `${domain}/video/${videoData.vid_id_public}`;

        // Texto de la leyenda (caption) con formato HTML
        let caption = `🎬 <b>NUEVO VIDEO</b>\n\n<b>Título:</b> ${videoData.vid_title}\n`;
        caption += `<a href=\"${vid_url}\">▶️ Ver video</a>`;
        caption = caption.trim();

        console.log('📢 Enviando notificación de nuevo video a Telegram...', url_photo);

        try {
            if (url_photo) {
                // Enviar foto con leyenda y parse_mode HTML
                console.log('Enviando foto a Telegram:', url_photo);
                await this.bot.sendPhoto(this.chatId, url_photo, {
                    caption: caption,
                    parse_mode: 'HTML'
                });
                console.log('✅ Notificación de nuevo video enviada con thumbnail');
            } else {
                // Enviar solo mensaje de texto
                await this.sendHtmlMessage(caption);
                console.log('✅ Notificación de nuevo video enviada sin thumbnail');
            }
            return true;
        } catch (error) {
            console.error('❌ Error enviando notificación de nuevo video:', error.message);
            return false;
        }
    }


    async sendServerStats(stats) {
                const message = `
        📊 <b>ESTADÍSTICAS DEL SERVIDOR</b>

        <b>🕒 Uptime:</b> ${stats.uptime}
        <b>🎬 Videos totales:</b> ${stats.totalVideos}
        <b>👀 Vistas hoy:</b> ${stats.viewsToday}
        <b>💾 Uso de disco:</b> ${stats.diskUsage}
        <b>🚀 Memoria:</b> ${stats.memoryUsage}

        <b>Timestamp:</b> ${new Date().toISOString()}
        `.trim();

        return this.sendHtmlMessage(message);
    }
}

/*const t = new TelegramService();
t.sendNewVideoNotification({
    vid_title: 'Nuevo video de prueba',
    vid_id_public: 'zEp3B_rn-fW',
    vid_thumbnail: 'OPtESlF0bjg'
});*/

module.exports = new TelegramService();