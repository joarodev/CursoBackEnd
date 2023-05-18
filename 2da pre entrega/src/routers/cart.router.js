const {Router} = require('express')
const cartManager = require('../manager/mongo/cart.mongo')
/* const systemVars = require('../config/index.js') */

const router = Router()

router.get('/', async (req, res)=>{
    try {
        let carts = await cartManager.getCarts()
        res.status(200).send(carts)
    } catch (error) {
        console.log(error)
    }
})

router.get('/:cid', async (req, res)=>{
    let {cid} = req.params
    try {
        let cart = await cartManager.getCartById(cid)
        console.log(cart)
        if (!cart){
            return res.status(400).send({status:'error',mensaje:"Carrito no encontrado"})
        }
        res.status(200).send({status:'success', payload: cart})
    } catch (error) {
        console.log(error)
    }
})


router.post('/:uid', async (req, res)=>{
    // Given a user Id (uid - must be an email) return his cart (if exist)
    // or create a new one
    try {
        let {uid} = req.params
        // verify uid is a mail
        if (!uid.includes("@") ) {
            return res.status(400).send({status: "error", message:"El uid de cliente debe ser un mail"})
        } 
        let cart = await cartManager.createCart(uid)
        if (!cart){
            return res.status(400).send({status:'error',mensaje:"No se pudo crear carrito"})
        }
        res.status(200).send({status:'success', payload: cart})
    } catch (error) {
        console.log(error)
    }
})

router.post('/:cid/product/:pid', async (req, res)=>{
    const {cid, pid} = req.params
    const quantity = req.body.quantity | 1 
    try {
        const response = await cartManager.addProduct(cid, pid, quantity) 
        if (response.status==="error"){
            return res.status(400).send(response)
        }else{
            return res.status(200).send(response)
        }       
    } catch (error) {
        console.log(error)
    }
})


module.exports = router