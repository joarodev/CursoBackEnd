exports.generateUserErrorInfo = (user) =>{
    return `One or more properties ware incomplete or not valid.
    listado de requeriomientos de propiedades del user:
    * first_name: need to a string, received ${user.first_name}
    * last_name: need to a string, received ${user.last_name}
    * email: need to a string, received ${user.email}
    `
}
exports.generateProductErrorInfo = (product) =>{
    return `One or more properties ware incomplete or not valid.
    listado de requeriomientos de propiedades del user:
    * first_name: need to a string, received ${product.first_name}
    * last_name: need to a string, received ${product.last_name}
    * email: need to a string, received ${product.email}
    `
}