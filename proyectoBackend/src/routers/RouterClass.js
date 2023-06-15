const {Router} = require("express")
const jwt = require("jw")

class RouterClass{
    constructor(){
        this.router = Router()
        this.init()
    }

    getRouter(){
        return this.router
    }

    init(){}

    /* applyCallbacks(callback){

        try {
            
        } catch (error) {
            
        }
        return callback.map(callback => async(...params) => {
            await callback.apply(this, params)
        })
    } */

    applyCallbacks(callback){
        return callback.map(callback => async(...params) => {
            try {
                await callback.apply(this, params)
            } catch (error) {
                console.log(error)
                params[1].status(500).send(error)
            }
        })
    }

    //manejo success y errores
    generateCustomResponse = (req, res, next)=>{
        res.sendSuccess = payload => res.send({status: "success", payload})
        res.sendServerError = error => res.send({status: "success", error})
        res.sendUserError = error => res.send({status: "success", error})
        next()
    }

    //jerarquias de Usuarios
    handlePolicies = policies => (req, res, next)=> {
        if(policies[0] === "PUBLIC") return next()
        const autHeader = req.headers.authorization
        if(!autHeader) return res.send({status: "error", error: "No autorizado"})
        //bares asdasdasdas

        //separamos el array y tomamos el de la posición 1
        const token = autHeader.split(" ")[1]
        const user = jwt.verify(token, "CoderSecreto")
        if(!policies.includes(user.role.toUpperCase())) return res.status(403).send({status: "Error"}) //Convierte todo en mayus y verifica si esta incluido en las politicas

        req.user = user
        next()
    }



    get(path, policies, ...callback){
        this.router.get(path, this.handlePolicies(policies),this.generateCustomResponse, this.applyCallback(callback))
    }
    put(path, policies, ...callback){
        this.router.get(path, this.handlePolicies(policies),this.generateCustomResponse, this.applyCallback(callback))
    }
    post(path, policies, ...callback){
        this.router.get(path, this.handlePolicies(policies),this.generateCustomResponse, this.applyCallback(callback))
    }
    delete(path, policies, ...callback){
        this.router.get(path, this.handlePolicies(policies),this.generateCustomResponse, this.applyCallback(callback))
    }
}

module.exports = {RouterClass}