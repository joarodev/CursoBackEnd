const express = require('express')
const routerIndex = require('./routers/index.router')
const { connectDB } = require('./config/configServer')

const cookieParser = require('cookie-parser')

const passport = require("passport")
const { initializePassport } = require('./config/passport.config')

const handlebars = require('express-handlebars')

const app = express()
const PORT = 8080

connectDB()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/static',express.static(__dirname+'/public'))
//app.use(logger("dev"))
app.use(cookieParser())

initializePassport()
app.use(passport.initialize())


//HANDLEBARS_____________________________________________
app.engine("handlebars", handlebars.engine())
app.set("views", __dirname+ '/views')
app.set('view engine', 'handlebars')
//HANDLEBARS_____________________________________________

//Routes
app.use("/",routerIndex)

app.listen(PORT, (err)=> {
    if (err) console.log('Erro en el servidor', err)
    console.log(`Escuchando en el puerto: ${PORT}`)
})
