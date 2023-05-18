const passport = require("passport")
const { createHash, isValidPassword } = require("../utils/bcryptHash")


//login
router.post("/login", passport.authenticate("login", {failureRedirect: "/failregister",
//successRedirect: "/Rutasiestátodobien"
}), async (req, res) => {
    if(!req.user) return res.status(401).send({status: "error", message: "invalid credential"})
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email

    }
    res.send({ status: "succes", message: "User registered"})
})

//fail login
router.get("/faillogin", async (req, res) => {
    console.log("falló la estrategia")
    res.send({ status: "Error", error: "fallo"})
})

//register
router.post("/register", passport.authenticate("register", {failureRedirect: "/failregister",
//successRedirect: "/Rutasiestátodobien"
}), async (req, res) => {
    res.send({ status: "succes", message: "User registered"})
})

// register fail
router.get("/failregister", async (req, res) => {
    console.log("falló la estrategia")
    res.send({ status: "Error", error})
})

/* router.post("/login", async(req, res)=>{
    const {email, password} = req.body
    //validar email password
    //validar si existen
    
    //vamos a tener una funcion para validar el password para ver como desencriptarlo
    const userDB = await userModel.findOne({email})

    if(!userDB) return res.send({ status: "error", message: "No existe ese usuario" })

    //validar password
    if(!isValidPassword(password, userDB)) return res.status(401).send({
        status: "error",
        message: "El usuario"
    })

    req.session.user = {
        first_name: userDB.first_name,
        last_name: userDB.last_name,
        email: userDB.email
    }

    res.send({
        status: "success", 
        message: "Login success"
    })
}) */


router.post("/counter")
router.post("/privada")

/* router.post("/register", async (req, res) => {
    const {first_name, last_name, email, password} = req.body
    //validar si vienen distintos de vacios y caracteres especiales
    //validar si existe mail
    const existUser = await userModel.findOne({email})

    if (existUser) return res.send({status: "error", message: "El email ya está en uso"})

    const newUser = {
        username,
        first_name,
        last_name,
        email,
        password: createHash(password)  //encriptar
    }
    let resultUser = await userModel.create(newUser)

    res.status(200).send({status: "success", message: "usuario creado correctamente"})
}) */

