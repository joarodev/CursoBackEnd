const { createTransport } = require('nodemailer')
const { envConfig } = require("../config/config")

const transport = createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: envConfig.GMAIL_EMAIL_APP,
        pass: envConfig.GMAIL_PASS_APP
    }
})

let from = `Servicio de email <${envConfig.GMAIL_EMAIL_APP}>`

exports.sendEmail = async (email, subject, html) => {
    return await transport.sendMail({
        from,
        to: email,
        subject,
        html
    })
}

exports.sendEmailResetPassword = async (email, token) => {
    return await transport.sendMail({
        from,
        to: email,
        subjet: "Recuperación de contraseña",
        html: `
        <h2>Hola,</h2>
        <h4>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:</h4>
        <a href="http://localhost:8080/api/session/reset-password/${token}">Restablecer contraseña</a>
        <p>Si no solicitaste restablecer tu contraseña, ignora este correo.</p>
      `,
    })
}

exports.sendEmailExpirateAccount = async (email, subject, name, date) => {
    return await transport.sendMail({
        from,
        to: email,
        subject,
        html: `
        <h2>Hola ${name}.</h2>
        <h4>Su ultima conección a la plataforma fue "${date}", 
        pese a su inactividad en la plataforma hemos decidido eliminar su cuenta.</h4>
      `,
    })
}

        /* const nodemailer = require("nodemailer")
        
        const transport = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            auth: {
                user: envConfig.GMAIL_MAIL_ADMIN,
                pass: envConfig.GMAIL_PASS_APP
            }
        })
        
        let from = `Servicio de email <${envConfig.GMAIL_MAIL_ADMIN}`
        
        exports.sendMail = async (destino, subjet, html) => {
            return await transport.sendMail({
                from,
                destino,
                subjet,
                html,
                /* attachments:[{
                    filename: "nombre.jpg",
                    path: __dirname+"/nombre.jpg",
                    cid: "nodejs"
                }] //pasarle archivos o imagenes
            })
        
        }*/