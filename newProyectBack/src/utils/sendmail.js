const nodemailer = require("nodemailer")
const { envConfig } = require("../config/config")

const transport = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: envConfig.GMAIL_USER_APP,
        pass: envConfig.GMAIL_PASS_APP 
    }
})

exports.sendMail = async (destino, subjet, html) => {
    return  await transport.sendMail({
        from: "Coder test <projectodigitalgen@gmail.com>",
        to: destino , //usuario al que quieren mandar el mail
        subject: subjet,
        html:` 
        <div>
            <h1>Esto es un test<h1>
        </div>
        `,
        attachments:[{
            filename: "nombre.jpg",
            path: __dirname+"/nombre.jpg",
            cid: "nodejs"
        }] //pasarle archivos o imagenes
    })

}