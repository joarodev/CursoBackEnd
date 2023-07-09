
const { Router } = require("express")
//MAIL router
/* const config = require("../config/objetConfig") */
const router = Router()

const compression = require("express-compression")

//FAKER
router.get("/mocks", (req, res) =>{

    for(let i = 0; i < 100; i++){
        generateUsers()
    }
    res.send("faker")
})


//COMPRESIÓN CON GZIP
//renderizar aplicación
console.log(compression())

//brotli
router.use(compression({
    brotli:{enabled: true, zblit: {}}
}))
router.get("/stringmuylargo", (req,res)=>{
    let string = `Hola Coders, soy un string ridiculamente largo`
    for (let i = 0; i < 5e4; i++) {
        string += `Hola Coders, soy un string ridiculamente largo`
    }
    res.send("stringmuylargo")
})


