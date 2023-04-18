const express = require('express')
const routers = require('./routers/index.router')
const routerHandlebars = require("./routers/home.handlebars")
const routerRealTime = require(`./routers/realTime.router`)
const handlebars = require("express-handlebars")
//const cookieParser = require('cookie-parser')

const app = express()
const PORT = 8080

//hbs_____________________________________________
app.engine("handlebars", handlebars.engine())
app.set("views", __dirname+ '/views')
app.set('view engine', 'handlebars')
//hsb_____________________________________________



//app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/static",express.static(__dirname+'/public'))

//routes
//hbs routes

app.use("/", routerHandlebars)
app.use("/realtimeproducts", routerRealTime)


app.use("/api", routers)

app.post('/api/products', (req, res)=>{
    res.status(200).send({
        status: 'success',
        message: 'se cargó correctamente'
    })
})
//puerto
const server = app.listen(PORT, () => {
    console.log(`Escuchando en el puerto ${server.address().port}`)
});

server.on('error', (error) => {
    console.log('Error', error)
});









