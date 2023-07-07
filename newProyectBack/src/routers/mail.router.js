const {Router} = require("express")
const { sendSms, sendWhatsapp } = require("../utils/sendSms")
const { sendMail } = require("../utils/sendmail")

const routerMail = Router()

/* const nodemailer = require("nodemailer")
const transport = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: "El correo de gmail de la cuenta", //.config.gmail_user_app
        pass: "La contraseña generada" // config.gemail_pass_app
    }
}) */

/* routerMail.get("/mail", async (req,res) =>{
    let destino = "joaquinrodriguez0012@gmail.com"
    let subjet = "Correo de prueba"
    let html = `
        <div>
            <h1>Esto es un test<h1>
        </div>
        `
    let result = sendMail.
}) */

/* })
routerIndex.get("/mail", async (req, res) => {
    let result = await transport.sendMail({
        from: "Coder test <projectodigitalgen@gmail.com>",
        to: "", //usuario al que quieren mandar el mail
        subject: "Correo de prueba",
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
    res.send("email enviado")
})
routerIndex.get("/sms", async (req, res) => {
    res.send("email enviado")
}) */

routerMail
    .get('/mail', async (req, res) => {
        console.log(__dirname)
        let destino = 'projectodigitalgen@gmail.com'
        let subject = 'Correo de prueba comsión 39750'
        let html = `<div>
            <h1>Esto es un test</h1>
        </div>`
        
        let result = await sendMail(destino, subject, html)
        res.send('Email enviado', result)
    })

    .get("/sms", async (req, res) => {
    let result = await sendSms("Joaquin", "Rodriguez")
    res.send({status: "success", result: "Message sent"})
    })
    .get("/wpp", async (req, res) => {
        await sendWhatsapp("Joaquín", "Rodriguez")
        res.send("wpp enviado")
    })
    
module.exports = routerMail