const nodemailer = require("nodemailer")
const { envConfig } = require("../config/config")

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
    return  await transport.sendMail({
        from,
        destino,
        subjet,
        html,
        /* attachments:[{
            filename: "nombre.jpg",
            path: __dirname+"/nombre.jpg",
            cid: "nodejs"
        }] //pasarle archivos o imagenes */
    })

}

//crear un jwt y configurarlo para 1 hora