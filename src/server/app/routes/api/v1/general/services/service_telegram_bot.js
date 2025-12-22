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

        const thumbnail
            = videoData.vid_thumbnail
            ? `${settings.DOMAIN_NAME}/api/v1/videos/thumbnails/${videoData.vid_thumbnail}`
            : 'Ver video';
        const vid_url = `${settings.DOMAIN_NAME}/video/${videoData.vid_id_public}`;

        const message = `
        🎬 <b>NUEVO VIDEO</b>

        <b>Título:</b> ${videoData.vid_title}
        🔗 <a href="${vid_url}">Ver video</a>
        `.trim();

        return this.sendHtmlMessage(message);
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

module.exports = new TelegramService();