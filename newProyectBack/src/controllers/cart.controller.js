const {cartService} = require("../services/index")
const { CartModel } = require("../dao/mongo/models/cart.model")
const {productService} = require("../services/index")


class CartController {

    get = async (req, res)=>{
        try {
            let carts = await cartService.getCarts()
            res.status(200).send(carts)
        } catch (error) {
            console.log(error)
        }
    }

    getById = async (req, res)=>{
        const {cid} = req.params
        try {
            const cart = await cartService.getCart(cid)
            if (!cart){
                return res.status(400).send({status:'error',mensaje:"Carrito no encontrado"})
            }
            console.log(cart)
            res.status(200).send({status:'ok', payload: cart})
        } catch (error) {
            console.log(error)
        }
    }
 
    create = async (req, res)=>{
        try {
            const {uid} = req.params
            let cart = await cartService.createCart(uid)
            if (!cart){
                return res.status(400).send({status:'error',mensaje:"No se pudo crear carrito"})
            }
            res.status(200).send({status:'success', payload: cart})
        } catch (error) {
            console.log(error)
        }
    }

    addProduct = async (req, res)=>{
        const {cid, pid} = req.params
        // valid product id
        const product= await productService.getProduct(pid)
        if (!product) return res.status(400).send({status:'error',message:'El producto indicado no existe'})

        if (!req.session.user?.userRegistered) return res.status(400).send({status:'userNotLogedIn',message:'Usuario no registrado'})
        const quantity = req.body.quantity | 1 

        try {
            const response = await cartService.addProduct(cid, pid, quantity) 
            if (response.status==="error"){
                return res.status(400).send(response)
            }else{
                return res.status(200).send(response)
            }       
        } catch (error) {
            console.log(error)
        }
    } 

    addProductArray = async (req, res)=>{
        const {cid} = req.params
        const {products} = req.body
        console.log(products)
        let allProductsOk= true

        for (const item of products) {
            const exist= await productValid(item.product)
            if (!exist) {allProductsOk= false
                break
            }
        }
        if (!allProductsOk) return res.status(400).send({status:'error',message:'El producto indicado no existe'})
        // All the products ids are valid 
        try {

            const response = await cartService.modifyProducts(cid, products) 
            if (response.status==="error"){
                return res.status(400).send(response)
            }else{
                return res.status(200).send(response)
            }       
        } catch (error) {
            console.log(error)
        }
    }
    async  productValid(pid) {
        exist= await productService.getProduct(pid)
        return !!exist
    } 

    deleteProduct = async (req, res)=>{
        const {cid, pid} = req.params
        try {
            const response = await cartService.deleteProduct(cid, pid) 
            if (response.status==="error"){
                return res.status(400).send(response)
            }else{
                return res.status(200).send(response)
            }       
        } catch (error) {
            console.log(error)
        }
    }

    deleteAllProducts = async (req, res)=>{
        const {cid} = req.params
        try {
            const response = await cartService.deleteAllProducts(cid)
            if (response.status==="error"){
                return res.status(400).send(response)
            }else{
                return res.status(200).send(response)
            }       
        } catch (error) {
            console.log(error)
        }
    }

}

module.exports = new CartController()