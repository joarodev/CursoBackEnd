const express = require('express')
const routers = require('./routers/index.router')
const routerHandlebars = require("./routers/views.handlebars")
const handlebars = require("express-handlebars")
const { Server } = require("socket.io")
const { socketProduct } = require('./utils/socketProduct')
const configServer = require('./config/configServer')


const app = express()
const PORT = 8080


//PUERTO------------------------------------------------------------------
const httpServer = app.listen(PORT, () => {
    console.log(`Escuchando en el puerto ${httpServer.address().port}`)
});
//PUERTO------------------------------------------------------------------

//socket__________________________________________
const io = new Server(httpServer)
socketProduct(io)
//socket__________________________________________

//mongo__________________________________________
configServer.connectDB()
//mongo__________________________________________

//hbs_____________________________________________
app.engine("handlebars", handlebars.engine())
app.set("views", __dirname+ '/views')
app.set('view engine', 'handlebars')
//hsb_____________________________________________

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/static",express.static(__dirname+'/public'))

//ROUTES------------------------------------------------------------------
//hbs routes

app.use("/", routerHandlebars)
/* app.use("/realtimeproducts") */
app.use("/api", routers)
app.post('/api/products', (req, res)=>{
    res.status(200).send({
        status: 'success',
        message: 'se cargó correctamente'
    })
})
//ROUTES------------------------------------------------------------------

httpServer.on('error', (error) => {
    console.log('Error', error)
});









