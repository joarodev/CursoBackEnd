//EXPRESS INIT
const express = require('express')

//Routers
const RoutersIndex = require('./routers/index.router')

//Handlebars
const handlebars = require("express-handlebars")

//Socket.io
const { Server } = require("socket.io")


const { socketProduct } = require('./utils/socketProduct')

//Mongo
const configServer = require('./config/configServer')

//cookie parser
const cookieParser = require('cookie-parser')


//File session
const FileStore = require("session-file-store")
const session = require('express-session')
const fileStore = FileStore(session)

//Mongo storage
const { create } = require("connect-mongo")

//File Storage
//const { create } = require("connect-mongo")

//Passport
const { initPassport, initPassportGitHub } = require('./config/passport.config')
const passport = require('passport')


//Passport JWT
const { initPassportJWT } = require('./passport-jwt/passport.config')

//DONENV
const dotenv = require('dotenv')
//commander
const {commander} = require("./utils/commander")
const {mode} = commander.opts()

//Configuración dotenv                                                                                                                                                                                                                                                  
dotenv.config({
    path: mode === 'development' ? './.env.development': './.env.production' 
})

//cors peticiones de otro dominio
const cors = require("cors")

//PUERTO------------------------------------------------------------------
const app = express()
const PORT = 8080
const httpServer = app.listen(PORT, () => {
    console.log(`Escuchando en el puerto ${PORT}`)
});
//PUERTO------------------------------------------------------------------

//CONFIGS:
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//Static files
const path = require('path')
app.use(express.static(path.join(__dirname,'public')))
app.use(cookieParser("secretCoder"))

//session I
/* app.use(session({
    secret: "secretCoder",
    resave: true,
    saveUninitialized: true
}))
 */

// File storage ------------------------------------------------------------------
/* ARCHIVO FILESTORAGE */
/* app.use(session({
    store: new fileStore({
        ttl: 100000*60,
        path: "./session",
        retries: 0
    }),
    secret: "secretCoder",
    resave: true,
    saveUninitialized: true,
})) */

//Passport------------------------------------------------------------------
initPassport()
initPassportGitHub()
initPassportJWT()
app.use(passport.initialize())
app.use(passport.session())
//Passport------------------------------------------------------------------

//
app.use(session({
    store: create({
        mongoUrl: "mongodb+srv://joarodDB:JoaRodDB3333@cluster0.rmh4eh5.mongodb.net/productsApp?retryWrites=true&w=majority",
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        ttl: 100000*60,
    }),
    secret: "secretCoder",
    resave: false,
    saveUninitialized: false,
}))

//Socket__________________________________________
const io = new Server(httpServer)
socketProduct(io)
//Socket__________________________________________

//MongoDB__________________________________________
configServer.connectDB()
//MongoDB__________________________________________

//HANDLEBARS_____________________________________________
app.engine("handlebars", handlebars.engine())
app.set("views", __dirname+ '/views')
app.set('view engine', 'handlebars')
//HANDLEBARS_____________________________________________

//ROUTES------------------------------------------------------------------
app.use("/", RoutersIndex)
//ROUTES------------------------------------------------------------------

//ERROR:
httpServer.on('error', (error) => {
    console.log('Error', error)
});









