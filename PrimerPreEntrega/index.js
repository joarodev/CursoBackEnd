const express = require('express')
const app = express()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.text());

//obtener
app.get("/products", (req, res) => {

});

app.get("/products/:pid", (req, res) => {

});
//Crear
app.post("", (req, res) => {

});
//Actualizar
app.patch("", (req, res) => {

});
//Eliminar
app.delete("", (req, res) => {

});


//PUERTO:
PORT=8080;
app.listen(PORT, () => {
    console.log(`Escuchando por el puerto ${PORT}`);
})


