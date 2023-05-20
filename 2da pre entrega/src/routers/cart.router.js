const {Router} = require('express')
const cartManager = require('../manager/mongo/cart.mongo')
const { cartModel } = require('../manager/mongo/models/cart.model')
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
    try {
        const {page=1} = req.query
        const cart = await cartModel.paginate({}, {limit: 5, page: page, lean: true})
        const { docs } = cart
        res.render("cart", {
            status: 'success',
            cart: docs,
        })
        
    } catch (error) {
        console.log(error)
    }
})

router.post('/:uid', async (req, res)=>{
    try {
        let {uid} = req.params
        // verificar si el uid es un email
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

router.put('/:cid/product/:pid', async (req, res)=>{
    try {
    const {cid, pid} = req.params
    const quantity = req.body.quantity | 1 
        const response = await cartManager.addProduct(cid, pid, quantity)
        res.send({
            status: "success",
            payload: response
        })
    } catch (error) {
        console.log(error)
    }
})

router.delete('/:cid/product/:pid', async (req, res)=>{
    try {
        const {cid, pid} = req.params
        let result = await productManager.deleteProductCart(cid, pid)
        res.send({
            status: "success",
            payload: result
        })
    } catch (error) {
        return {status: 'error', error}
    }
})
router.delete('/:cid', async (req, res)=>{
    try {
        const {cid} = req.params
        let result = await productManager.deleteManyProducts(cid)
        res.send({
            status: "success",
            payload: result
        })
    } catch (error) {
        return {status: 'error', error}
    }
})

module.exports = router