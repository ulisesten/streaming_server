const { Router } = require("express");
const nodemailer = require("nodemailer");
const settings = require("../../../../core/configuration.js");
const { reject } = require("../../../../core/errors.js");

const email = Router();

function hasValue(value) {
    return typeof value === "string" && value.trim().length > 0;
}

function validateEmailRequest(body) {
    if (!hasValue(body.secret_key)) {
        return "La clave es requerida.";
    }

    if (body.secret_key !== settings.CORREO_SECRET_KEY) {
        return "Clave inválida.";
    }

    if (!hasValue(body.to)) {
        return "El destinatario es requerido.";
    }

    if (!hasValue(body.subject)) {
        return "El asunto es requerido.";
    }

    if (!hasValue(body.text) && !hasValue(body.html)) {
        return "El contenido del correo es requerido.";
    }

    return null;
}

function validateCorreoConfig() {
    const requiredSettings = [
        "CORREO_HOST",
        "CORREO_PORT",
        "CORREO_USER",
        "CORREO_PASS"
    ];

    return requiredSettings.filter((setting) => !hasValue(settings[setting]));
}

email.post("/", async function (req, res) {
    const body = req.body || {};
    const error = validateEmailRequest(body);

    if (error) {
        return reject(res, error === "Clave inválida." ? 401 : 400, error);
    }

    const missingSettings = validateCorreoConfig();

    if (missingSettings.length > 0) {
        console.error("Configuración de correo incompleta:", missingSettings.join(", "));
        return reject(res, 500, "Configuración de correo incompleta.");
    }

    try {
        const transporter = nodemailer.createTransport(settings.getCorreoConfig());

        const info = await transporter.sendMail({
            from: body.from || settings.CORREO_USER,
            to: body.to,
            cc: body.cc,
            bcc: body.bcc,
            subject: body.subject,
            text: body.text,
            html: body.html,
            replyTo: body.replyTo
        });

        res.status(200).json({
            msg: "Correo enviado exitosamente.",
            error: 0,
            success: true,
            data: {
                messageId: info.messageId,
                accepted: info.accepted,
                rejected: info.rejected
            }
        });
    } catch (error) {
        console.error("Error enviando correo:", error);
        reject(res, 500, "No se pudo enviar el correo.");
    }
});

module.exports = email;
