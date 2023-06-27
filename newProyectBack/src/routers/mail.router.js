const {Router} = require("express")
const { sendSms, sendWhatsapp } = require("../utils/sendSms")
const { sendMail } = require("../utils/sendmail")

const routerMail = Router()

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

routerMail

    .get("/sms", async (req, res) => {
    await sendSms("Joaquin", "Rodriguez")
    res.send("SMS enviado")

    .get("/wspp", async (req, res) => {
        await sendWhatsapp("Joaquín", "Rodriguez")
        res.send("SMS enviado")
    })
    
})
module.exports = routerMail