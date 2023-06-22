const {Router} = require("express")
const {getUser, createUsers, deleteUser, getUserById, updateUsers, getUsers} = require("../controllers/user.controller")


const routerUser = Router()

routerUser
    .get("/users", getUsers)
    .get("/:uid", getUser)
    .post("/", createUsers)
    .put("/:uid", updateUsers)
    .delete("/:uid", deleteUser)

module.exports = routerUser