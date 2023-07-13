const cluster = require("cluster")
const {cpus} = require("os")
const { initServer } = require("./src/server")

const numeroDeProcesadores = cpus().length
console.log(`cantidad de hilos de procesador: `, numeroDeProcesadores)

if(cluster.isPrimary){
    console.log("Proceso primario, generando processo trabajador")
    for(let i = 0 ; i < numeroDeProcesadores; i++){
        cluster.fork()
    }
    cluster.on("message", worker => {
        logger.info(`El worker ${worker.process.id} dice ${worker.message}`)
    })
} else {
    console.log("al no ser un proceso forkeado, no cuento como primario por lo tanto usPrimario en false, soy un worker")
}



initServer()