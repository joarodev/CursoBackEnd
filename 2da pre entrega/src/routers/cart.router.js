const {Router} = require ('express')
const CartManager = require('../manager/archivo/cartManager')
const ProductManager = require('../manager/archivo/productsManager')
const DOC = require('../carts.json')

const router = Router();
const productManager = new ProductManager('./products.json')
const cartManager = new CartManager('./carts.json')
const notFound = { error: "Cart not found" }


router.post("/", async (req, res) => {
  await cartManager.createCart()
  res.status(201).send({ status:'success', mensaje: "Carrito creado correctamente" })
});

router.get("/", async (req, res) => {
  const carts = await cartManager.readCarts()
  res.status(200).send({ status:'success', payload: carts })
});

router.get("/:cid", async (req, res) => {
  const {cid}  = req.params
  const cart = await cartManager.getcartById(cid)
  if(!cart){
    res.status(404).send(notFound)
   } else{
    res.status(200).send({status:'success', payload: cart})}
});

router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params
  const product = await productManager.getProductById(parseInt(pid));
  if (product) {
    const cart = await cartManager.addToCart(parseInt(cid), parseInt(pid))
    !cart ? res.status(404).send(notFound) : res.status(200).send(cart)
  } else {
    res.status(404).send({ error: "Product not found" })
  }
});

module.exports = router