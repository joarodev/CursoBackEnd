const { faker } = require("@faker-js/faker")

/* const generateProduct = ()=>{
    return{
        title: faker.commerce.productName()
        price: faker.commerce.price()
    }
}
 */

exports.generateUser = () => {
    let numOfProductos = parseInt(faker.random.numeric(1, {bannedDigits: ["0"]}))
    let products = []
    for (let i = 0; i<numOfProductos; i++){
        products.push(generateProducts())
    }
    return{
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        sex: faker.name.sex(),
        birthDate: faker.date.birthdate(),
        phone: faker.phone.number(),
        image: faker.image.avatar(),
        id: faker.database.mongodbObjectId(),

    }
}