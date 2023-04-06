const { Router } = require("express")
const {ProductManager} = require ('../managerDatos/ProductManager')

//objeto

const routerProducts = Router();
const productManager = new ProductManager();

routerProducts.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts()
        const limit = req.query.limit

        limit ? res.send(products.slice(0, limit)) : res.send( { status: "success", payload: products })  
    } catch (error) {
        console.log(error)
    }
});

routerProducts.get('/:id', async (req, res) => {
    try {
        const params = Number(req.params.id)
        const product = await productManager.getProductById(params)
        if(product){
            res.send(product)
        } else {
            res.status(404);
            res.send({ error: "Producto no encontrado" })
        }
    } catch (error) {
        console.log(error)
    }
});

routerProducts.post("/", async(req, res) => {
    let prod = req.body

    if(!prod.title || !prod.description || !prod.code || !prod.price || !prod.status || !prod.stock || !prod.category){
        return res.status(400).send({ status:"error", mensaje: "Todos los campos son necesarios" });
    }
    const newProduct = await productManager.addProduct(prod)
    res.send({ status:"success", mensaje:"Producto agregado correctamente", newProduct })
})

routerProducts.put('/:pid', (req, res) => {
    const { pid } = req.params
    const prod = req.body

    // validar pid 
    // if(!id)   
    // validar campos 
    if(!prod.title || !prod.desciption || !prod.code || !prod.price || !prod.status || !prod.stock || !prod.category){ 
        return res.status(400).send({status:'error', mensaje: 'todos los campos son necesarios'})
    }
    // buscar por pid user
    const index = database.findIndex(product => product.id === pid)   
    //validar que exista
    if(index === -1) res.send({status: 'error', message: 'No existe el usuario'})

    database[index] = {id: pid, ...prod}

    res.send({database})
})



routerProducts.delete("/:uid",(req, res) => {
    let {uid} = req.params
    //buscar por id product
    const index = database.findIndex(producto => producto.id === uid)
    //validar que exista
    if(index === -1) res.send ({ status: "error", message: "No se a encontrado el producte"})

    products = database.filter(product => product.id !== uid);
    res.send({ status: "success", payload: products });

})


module.exports = routerProducts;