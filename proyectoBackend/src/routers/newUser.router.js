const RouterClass = require("./RouterClass")

//const {Router} = require("express")

class UserRouter extends RouterClass{
    init(){
        this.get("/", async(req, res) =>{
            try {
                //await? res.sendSuccess("Hola Coder")
            } catch (error) {
                res.sendServerError(error)
            }
        })

        //policies
        this.get("/", ["PUBLIC"], async(req, res) =>{
            try {
                //await? res.sendSuccess("Hola Coder")
            } catch (error) {
                res.sendServerError(error)
            }
        })
    }
}

module.exports = {UserRouter}