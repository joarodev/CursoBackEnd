//FORK

const {Router} = require("express")
const fork = require("child_process")

const router = Router()

/* function operacionCompleja(){
    let result = 0;
    for(let i = 0; i<9)
}
 */
router.get("/sumacomp", (req, res) => {
    const result = operacionCompleja()
})

router.get("/suma", (req, res) => {
    const result = operacionCompleja()
})

router.get("/noblock", (req, res) => {
    const child = fork("../utils/PRUEBASOC.js")

    child.send("Inicia el proceso de calculo")
    child.on("message", result =>{
        res.send(`El resultado es ${result}`)
    })
})