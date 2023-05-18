const { Router } = require("express")
const { userModel } = require("../manager/mongo/models/user.model")
const UserManager = require("../manager/mongo/user.mongo")


const routerUser = Router()

routerUser.get("/", async (req, res)=>{
    try {
        /* let users = await userModel.find({})

        res.send({
            status: "succes",
            payload: users,

        }) */

        //moongose paginate
        let users = await userModel.paginate({}, {limit: 50, page:1})

        res.send({
            status: "success",
            payload: users
        })

    } catch (error) {
        console.log(error)
    }
})

routerUser.post("/usuarios", async (req, res) =>{
    try {
        const newUser = req.body

        let result = await UserManager.addProduct(newUser)


        res.status(200).send({
            status: 'success',
            payload: result
        })
    } catch (error) {
        console.log(error)
    }
})

module.exports = routerUser