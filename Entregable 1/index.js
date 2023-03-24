
class ProductManager{
    constructor(){
        this.products = [];
        this.idInicial = 0;
    }
    getProducts = () =>{
        return this.products
    }
    addProduct = (title, description, price, thumbnail, code, stock) => {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.error("Ingrese todos los items");
            return;
        }

        const productCode = this.products.some((product) => product.code === code);
    if (productCode) {
      console.error("Ya existe un producto con el mismo code");
      return;
    }

    const product = {
        id: ++this.idInicial,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      };
      this.products.push(product);
    }
    
    getProductById = (idProduct) => {
        const productFind = this.products.find(p=>p.id===idProduct);
        if(!productFind){
            console.error("Not found")
            return;
        } else {
            return productFind;
        }
    }
}

const ManejadorProduct = new ProductManager;
//Proceso de testing
console.log("<<<<Proceso de testing>>>>")
console.log("llamamos al array en primera instancia:")
console.log(ManejadorProduct.getProducts())

//Probando agregar productos con diferentes codes
ManejadorProduct.addProduct("Fideos", "Fideos Manolito", 150,"Sin img", "Code1", 130);
ManejadorProduct.addProduct("Arroz", "Arroz Manolito", 100,"Sin img", "Code2", 110);

console.log("Llamamos al array con los productos generados")

//llamamos al array para ver el proceso
console.log(ManejadorProduct.getProducts())

console.log("Creamos un nuevo producto con el mismo code para probar el error:")
ManejadorProduct.addProduct("Salsa", "Salsa de tomate", 200,"Sin img", "Code1", 130);

console.log("Probamos si funciona getProductById, le pasamos el primer id y despúes uno inexistente")
console.log(ManejadorProduct.getProductById(1))
console.log(ManejadorProduct.getProductById(432))