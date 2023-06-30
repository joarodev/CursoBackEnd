
const { Router } = require("express")
//MAIL router
const config = require("../config/objetConfig")
const router = Router()
/* const nodemailer = require("nodemailer")
const transport = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: "El correo de gmail de la cuenta", //.config.gmail_user_app
        pass: "La contraseña generada" // config.gemail_pass_app
    }
}) */

router.get("/mocks", (req, res) =>{

    for(let i = 0; i < 100; i++){
        generateUsers()
    }
    res.send("faker")
})

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