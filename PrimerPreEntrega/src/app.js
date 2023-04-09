const express = require('express')
const {uploader} = require('./multer')
const routers = require('./routers/index.router')

const cookieParser = require('cookie-parser')

const app = express()
const PORT = 8080

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api", routers)


app.post('/api/products', uploader.single('thumbnail'), (req, res)=>{
    res.status(200).send({
        status: 'success',
        message: 'se cargó correctamente'
    })
})

const server = app.listen(PORT, () => {
    console.log(`Escuchando en el puerto ${server.address().port}`)
});

server.on('error', (error) => {
    console.log('Error', error)
});









