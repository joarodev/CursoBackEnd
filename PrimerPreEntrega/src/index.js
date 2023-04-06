const express = require('express')
const app = express()
const routerProducts = require('./routes/products.router')


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/products", routerProducts)

//app.use("/api/carrito", prodRouter)

//PUERTO:
PORT=8080;
app.listen(PORT, () => {
    console.log(`Escuchando por el puerto ${PORT}`);
})


