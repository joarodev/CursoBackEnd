/* const  commander = require("commander")

const program = new commander.Command()

program
    .option("-d", "Variable para debug", false)
    .option("-p", "Puerto para el servidor", 8080)
    .option("-mode", "Modo de trabajo", "production")
    .requiredOption("-u <user>", "Usuario utilizando el aplicativo", "No se ha declarado un usuario")
    .option("-l, --letters [letter...]", "specify the letters")

program.parse()

console.log("options", program.options)
console.log("Remaining Arguments: ", program.args) */

//node commander.js -d, -p, 3000 --mode develpment -u root --letters a b c

//node commander.js -d -p 3000 -u root 2 a 5 --letters

process.on("exit", code => {
    console.log("Se ejecuta justo antes de terminar el proceso", code)
})

process.on("uncaughtException", exception => {
    console.log("Se ejecuta con alguna excepción", exception)
})

process.on("message", exception => {
    console.log("Muestra el mensaje de otro proceso")
})

console()