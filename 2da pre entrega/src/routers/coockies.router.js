const { Router } = require("express")

const routerCoockies = Router()

routerCoockies.get("/setCookie", (req, res) =>{
    res.cookie("CoderCookie", "Esta es una cookie", {maxAge: 10000}).send("cookie seteada")
})

routerCoockies.get("setSignedCookie", (req, res)=> {
    res.cookie("SignedCookie", "Esta es una cookie poderosa sifrada", {maxAge: 1000000}).send("cookie seteada")
})

routerCoockies.get("/getCookies", (req, res) =>{
    res.send(req.cookies)
})

routerCoockies.get("/getSignedCookies", (req, res) =>{
    res.send(req.signedCookies)
})

routerCoockies.delete("/deleteCookie", (req, res)=> {
    res.clearCookie("CoderCookie")
})

module.exports = {routerCoockies}