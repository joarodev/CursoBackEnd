
const { Router } = require("express")
//MAIL router
/* const config = require("../config/objetConfig") */
const routerPrueba = Router()
const compression = require("express-compression")
const {faker} = require("@faker-js/faker")



//artillery

routerPrueba.get("/simple", (req, res) => {
    let suma = 0
    for(let i = 0; i<10000000; i++){
        suma += i
    }
    res.send({suma})
})


routerPrueba.get("/compleja", (req, res) => {
    let suma = 0
    for(let i = 0; i < 5e8; i++){
        suma += i
    }
    res.send({suma})
})

routerPrueba.get("/testuser", (req, res)=>{
    let persona = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password()
    }
    res.send({
        status: "success",
        payload: persona
    })
})

//LOGGER

routerPrueba.get("/logger-test", (req, res) => {
    /* req.logger.warn("alerta")
    res.send({message: "Prueba logger"}) */

    req.logger.debug(`Logger level 4, "Debug"`)
    req.logger.info(`Logger level 3, "Info"`)
    req.logger.warn(`Logger level 2, "Warning"`)
    req.logger.error(`Logger level 1, "Error"`)
    req.logger.fatal(`Logger level 0, "Fatal"`)

    res.send({message: "Prueba de logger"})
})


//COMPRESIÓN CON GZIP
//renderizar aplicación
//console.log(compression())

//brotli
/* routerPrueba.use(compression({
    brotli:{enabled: true, zblit: {}}
}))
routerPrueba.get("/stringmuylargo", (req,res)=>{
    let string = `Hola Coders, soy un string ridiculamente largo`
    for (let i = 0; i < 5e4; i++) {
        string += `Hola Coders, soy un string ridiculamente largo`
    }
    res.send("stringmuylargo")
}) */

module.exports = { routerPrueba }