const express = require('express')
const hbs  = require('express-handlebars');
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
//DONENV
    
require("dotenv").config()
const {envConfig} = require("./config/config")
    
    //middleware error
const { errorHandler } = require('./middlewares/error.middleware')
const path = require('path')
const { loggerMiddleware } = require('./middlewares/logger.middleware')

const  {Server: ServerHTTP} = require("http")

//swagger
const swaggerUiExpress = require("swagger-ui-express")
const swaggerjsDoc = require("swagger-jsdoc")

const app = express()
const serverHttp = ServerHTTP(app)
//const io = ServerIO(serverHttp)
const PORT = envConfig.PORT

connectDB()
//CONFIG:
app.use
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname,'public')))
app.use(cookieParser(''))
app.use(logger("dev"))
app.use(cors())

//Passport init
initPassport()
initPassportJWT()
initPassportGitHub()
app.use(passport.initialize())

app.engine('hbs',
    hbs.engine({
        extname: 'hbs',
        defaultLayout: 'main',
        layoutDir: __dirname + '/views/layouts',
        helpers: {
            // Aquí definirás tus helpers personalizados
            ifCond: function (v1, operator, v2, options) {
                switch (operator) {
                case '==':
                    return v1 == v2 ? options.fn(this) : options.inverse(this);
                case '===':
                    return v1 === v2 ? options.fn(this) : options.inverse(this);
                case '!=':
                    return v1 != v2 ? options.fn(this) : options.inverse(this);
                case '!==':
                    return v1 !== v2 ? options.fn(this) : options.inverse(this);
                case '<':
                    return v1 < v2 ? options.fn(this) : options.inverse(this);
                case '<=':
                    return v1 <= v2 ? options.fn(this) : options.inverse(this);
                case '>':
                    return v1 > v2 ? options.fn(this) : options.inverse(this);
                case '>=':
                    return v1 >= v2 ? options.fn(this) : options.inverse(this);
                default:
                    return options.inverse(this);
                }
            }
        }
    }),
);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


//swagger
const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info:{
            title: "Documentación de AppleShop",
            description: "Esta es la documentacion de AppleShops"
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}
const specs = swaggerjsDoc(swaggerOptions)
app.use("/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

// Logger
app.use(loggerMiddleware)

//Routes
app.use("/",routerIndex)

//Error middleware
//app.use(errorHandler)

app.listen(PORT, (err)=> {
    if (err) console.log('Erro en el servidor', err)
    console.log(`Escuchando en el puerto: ${PORT}`)
    console.log(`Server host: ${envConfig.HOST_URL}${PORT}`)
})