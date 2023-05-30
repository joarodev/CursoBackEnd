const {Router} = require("express")

const routAvanzado = Router()

// á -> %C3%A1
// é -> 
// í -> 
// ó -> 
// ú -> 
// ü -> 
routAvanzado.get("/params/:nombre([a-z%C3%A1]+)", (req, res) =>{
    res.send({
        message: req.params.nombre
    })
})

//Rutas que no están definidas
routAvanzado.get("*", async(req, res) => {
    res.status(404).send("404 Not found")
})

//formato params
routAvanzado.param("nombre del parametro", async)


const nombres = ["Juan", "Joaquin"]
routAvanzado.param("nombre", (req, res, next, nombre) =>{
    if(!nombres.includes(nombre)){
        req.nombre = null
    } else {
        req.nombre = nombre

    }
    next()
})

module.export = {routAvanzado}