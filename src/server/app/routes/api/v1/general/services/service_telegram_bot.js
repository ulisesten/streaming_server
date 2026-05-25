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
        if (!this.bot) return false;

        let domain = settings.DOMAIN_NAME || 'http://localhost:3000';
        if (!domain.startsWith('http')) domain = `https://${domain}`;
        domain = domain.replace(/\/$/, '');

        const vid_url = `${domain}/video/${videoData.vid_id_public}`;
        let caption = `🎬 <b>NUEVO VIDEO</b>\n\n<b>Título:</b> ${videoData.vid_title}\n`;
        caption += `<a href="${vid_url}">▶️ Ver video</a>`;

        console.log('📢 [TelegramService] Preparando notificación', {
            videoData,
            domain,
            chatId: this.chatId,
            hasBotInstance: Boolean(this.bot)
        });

        try {
            if (videoData.vid_thumbnail) {
                const thumbnailUrl = `${domain}/api/v1/videos/thumbnails/${videoData.vid_thumbnail}`;

                console.log('📸 [TelegramService] Obteniendo thumbnail', { thumbnailUrl });
                const maxAttempts = 3;
                for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
                    try {
                        console.log(`📸 [TelegramService] Intento ${attempt}/${maxAttempts}: sendPhoto(URL)`);
                        const sendPhotoByUrlResult = await this.bot.sendPhoto(this.chatId, thumbnailUrl, {
                            caption: caption,
                            parse_mode: 'HTML'
                        });
                        console.log('📸 [TelegramService] Respuesta sendPhoto(URL)', {
                            ok: Boolean(sendPhotoByUrlResult),
                            attempt,
                            messageId: sendPhotoByUrlResult?.message_id,
                            photoCount: sendPhotoByUrlResult?.photo?.length
                        });
                        console.log('✅ Notificación enviada con thumbnail (url directa)');
                        return true;
                    } catch (urlError) {
                        console.error('⚠️ [TelegramService] Falló sendPhoto(URL)', {
                            attempt,
                            message: urlError?.message,
                            code: urlError?.code
                        });
                        if (attempt < maxAttempts) {
                            await new Promise((resolve) => setTimeout(resolve, 2000));
                        }
                    }
                }
                console.error('⚠️ [TelegramService] Agotados reintentos de sendPhoto(URL), se enviará solo texto');
            } else {
                console.log('ℹ️ [TelegramService] vid_thumbnail vacío, enviando solo texto');
                await this.sendHtmlMessage(caption);
            }
            if (videoData.vid_thumbnail) {
                await this.sendHtmlMessage(caption);
            }
            return true;
        } catch (error) {
            console.error('❌ TelegramService NewVideoNotification Error:', error.message);
            console.error('❌ [TelegramService] Error detallado', {
                name: error?.name,
                code: error?.code,
                stack: error?.stack,
                responseStatus: error?.response?.status,
                responseHeaders: error?.response?.headers,
                responseData: error?.response?.data
            });
            // Fallback a solo texto
            try {
                console.log('ℹ️ [TelegramService] Ejecutando fallback de texto');
                await this.sendHtmlMessage(caption);
                console.log('✅ [TelegramService] Fallback de texto exitoso');
                return true;
            } catch (e) {
                console.error('❌ [TelegramService] Fallback de texto falló', {
                    message: e?.message,
                    stack: e?.stack
                });
                return false;
            }
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

/* const t = new TelegramService();
t.sendNewVideoNotification({
    vid_title: 'Nuevo video de prueba',
    vid_id_public: 'zEp3B_rn-fW',
    vid_thumbnail: 'OPtESlF0bjg'
}); */

module.exports = new TelegramService();
