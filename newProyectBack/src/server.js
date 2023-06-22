const express = require('express')
const routerIndex = require('./routers/index.router')
//SERVER
const { connectDB } = require('./config/configServer')
//CONFIG
const logger = require('morgan')
const cookieParser = require('cookie-parser')
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
const dotenv = require('dotenv')
//COMMANDER
const { commander } = require('./utils/commander')
const { mode } = commander.opts()

const cors = require("cors")


//Configuración dotenv
dotenv.config({
    path: mode === 'development' ? './.env.development' : './.env.production',     
})

const app = express()
const PORT = 8080

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
})
