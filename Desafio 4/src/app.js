const express = require('express')
const routers = require('./routers/index.router')
const routerHandlebars = require("./routers/views.handlebars")
const handlebars = require("express-handlebars")
//const cookieParser = require('cookie-parser')
const { Server } = require("socket.io")


const app = express()
const PORT = 8080

//socket__________________________________________

//PUERTO
const httpServer = app.listen(PORT, () => {
    console.log(`Escuchando en el puerto ${httpServer.address().port}`)
});

const socketServer = new Server(httpServer)

let messages = []
socketServer.on("connection", socket =>{
    console.log("Cliente conectado")

    socket.on("message", data =>{
        console.log(data)
        messages.push(data)
        socketServer.emit("messageLogs", messages)
    })

    socket.on("authenticated", data =>{
        socket.broadcast.emit("newUserConnected", data)
    });
    

})


//socket__________________________________________


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
/* app.use("/realtimeproducts") */


app.use("/api", routers)

app.post('/api/products', (req, res)=>{
    res.status(200).send({
        status: 'success',
        message: 'se cargó correctamente'
    })
})


httpServer.on('error', (error) => {
    console.log('Error', error)
});









