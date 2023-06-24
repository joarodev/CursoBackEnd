const express = require('express')
const routerIndex = require('./routers/index.router')
//SERVER
const { connectDB, port} = require('./config/configServer')
//CONFIG
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const cors = require("cors")
//PASSPORT
const passport = require("passport")
const { initPassport } = require('./config/passport.config')
//Passport JWT
const { 
    initPassportJWT, 
    initPassportGitHub } = require('./jwt/passport-jwt')
//VIEWS
const hbs = require('express-handlebars')
//DONENV

require("dotenv").config()
const {envConfig} = require("./config/config")

const app = express()
const PORT = envConfig.PORT

connectDB()
//CONFIG:
app.use(express.json())
app.use(express.urlencoded({extended: true}))
const path = require('path')
app.use(express.static(path.join(__dirname,'public')))
app.use(cookieParser('secretCoder'))
app.use(logger("dev"))
app.use(cors())

//Passport init
initPassport()
initPassportJWT()
initPassportGitHub()
app.use(passport.initialize())

app.engine('hbs', hbs.engine({extname: 'hbs', defaultLayout: 'main', layoutDir: __dirname + '/views/layouts'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//Routes
app.use("/",routerIndex)

app.listen(PORT, (err)=> {
    if (err) console.log('Erro en el servidor', err)
    console.log(`Escuchando en el puerto: ${PORT}`)
    console.log(`Server host: ${envConfig.HOST_URL}${PORT}`)
})
