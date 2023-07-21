const { envConfig } = require("../config/config");
const twilio = require("twilio")

const twilio_sid = envConfig.TWILIO_ACCOUNT_SID
const twilio_auth_token = envConfig.TWILIO_AUTH_TOKEN
const twilio_phone_number = envConfig.TWILIO_PHONE_NUMBER

console.log(twilio_sid, twilio_auth_token, twilio_phone_number)
//const cliente = twilio(twilio_sid, twilio_auth_token)

exports.sendSms = (nombre, apellido) => cliente.messages
    .create({
        body: `Gracias por tu compra ${nombre} ${apellido}`,
        from: twilio_phone_number,
        to: envConfig.MY_PHONE_NUMBER
    })
/* exports.sendWhatsapp = (nombre, apellido) => cliente.messages.create({
    body: `Gracias por tu compra ${nombre} ${apellido}`,
    from: `whatsapp:+14847499277`,
    to: `whatsapp:${envConfig.MY_PHONE_NUMBER}`
})
 */