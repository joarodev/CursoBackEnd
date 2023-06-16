const {Router} = require("express")
const { ContactController } = require("../controllers/contact.controller")


const router = Router()

router.get("/", ContactController.getContact)
router.post("/", ContactController.createContact)

module.exports = {router}