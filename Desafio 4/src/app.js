const express = require('express')
const {uploader} = require('./multer')
const routers = require('./routers/index.router')

//const cookieParser = require('cookie-parser')

const app = express()
const PORT = 8080

//app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/static",express.static(__dirname+'/public'))
 

//routes
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









