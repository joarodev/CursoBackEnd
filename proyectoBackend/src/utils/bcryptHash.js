const bcrypt = require("bcrypt")

// crear el hash

exports.createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

//generar la función para comparar contraseñas

exports.isValidPassword = (password, user) => bcrypt.compareSync(password, user.password)

