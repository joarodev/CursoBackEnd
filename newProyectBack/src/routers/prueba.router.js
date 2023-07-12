
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

//logger

routerPrueba.get("/logger", (req, res) => {
    /* req.logger.warn("alerta")
    res.send({message: "Prueba logger"}) */

    //req.logger.info("info")
    //req.logger.warning("warning")
    //req.logger.error("error")
    req.logger.fatal("fatal")

    res.send({message: "Prueba de logger"})
})


//FAKER
/* router.get("/mocks", (req, res) =>{

    for(let i = 0; i < 100; i++){
        generateUsers()
    }
    res.send("faker")
}) */


//COMPRESIÓN CON GZIP
//renderizar aplicación
console.log(compression())

//brotli
routerPrueba.use(compression({
    brotli:{enabled: true, zblit: {}}
}))
routerPrueba.get("/stringmuylargo", (req,res)=>{
    let string = `Hola Coders, soy un string ridiculamente largo`
    for (let i = 0; i < 5e4; i++) {
        string += `Hola Coders, soy un string ridiculamente largo`
    }
    res.send("stringmuylargo")
})

module.exports = { routerPrueba }