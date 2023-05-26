//EXPRESS INIT
const express = require('express')

//Routers
const RoutersIndex = require('./routers/index.router')

//Handlebars
const routerHandlebars = require("./routers/views.handlebars")
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


//File Storage
//const { create } = require("connect-mongo")

//Passport
/* const { initPassport, initPassportGitHub } = require('./config/passport.config')
const passport = require('passport')
*/

//Passport JWT
const { initPassportJWT } = require('./passport-jwt/passport.config')

//PUERTO------------------------------------------------------------------
const app = express()
const PORT = 8080
const httpServer = app.listen(PORT, () => {
    console.log(`Escuchando en el puerto ${httpServer.address().port}`)
});
//PUERTO------------------------------------------------------------------

//CONFIGS:
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/static",express.static(__dirname+'/public'))
app.use(cookieParser("palabraSecreta"))

//session I
/* app.use(session({
    secret: "secretCoder",
    resave: true,
    saveUninitialized: true
}))
 */

// File storage ------------------------------------------------------------------
/* ARCHIVO */
app.use(session({
    store: new fileStore({
        ttl: 100000*60,
        path: "./session",
        retries: 0
    }),
    secret: "secretCoder",
    resave: true,
    saveUninitialized: true,
}))

/* MONGO ATLAS */
/* app.use(session({
    store: create({
        mongoUrl: "mongodb+srv://joarodDB:JoaRodDB3333@cluster0.rmh4eh5.mongodb.net/productsApp?retryWrites=true&w=majority",
        mongoOptions: {
            useNewUrlParser: true,
            //useUnifiedTopology
        },
        ttl: 100000*60
    }),
    secret: "secretCoder",
    resave: false,
    saveUninitialized: false,
})) */


//Passport------------------------------------------------------------------
/* initPassport()
passport.use(passport.initialize())
passport.use(passport.session()) */
//Passport------------------------------------------------------------------

//PassportGithub
//initPassportGitHub()

//Passport JWT----------------------------------------------------------------
//app.use(initPassport())


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
app.use("/", routerHandlebars)
app.use("/api", RoutersIndex)
//ROUTES------------------------------------------------------------------

//ERROR:
httpServer.on('error', (error) => {
    console.log('Error', error)
});









