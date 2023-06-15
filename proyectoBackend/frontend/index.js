console.log("index.js")

//url string
fetch("http://localhost:8080/api/products", {
    method: "GET", //POST, PUT, DELETE, ETC
    headers: {
        "Content-Type": "application/json"
    },
    /* body: {
        "nombre": "Joaquin"
    } */
})
    .then(respuesta => respuesta.json())
    .then(respuesta =>{ 
        console.log(respuesta.payload)
        let html = ``
        const productList = document.querySelector("#productList")
        respuesta.map(product =>{
            return html+=`
            <div class="card">
                <div class="card-header">${product.title}</div>
                <div class="card-body">
                    <h3>Precio: ${product.price}</h3>
                </div>
                <div class="card-footer"></div>
                <button class="btn btn-primary">Detalle</button>
            </div>
            `
        })
        productList.innerHTML = html
    })
    .catch(error => console.log(error))

