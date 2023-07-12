const winston = require("winston")

/* const logger = winston.createLogger({
    transports: [
        new winston.transport.Console({ level:  "http" }),
        new winston.transport.File({ filename: ".errors.log", level: "warn"})
    ]
}) */

//configuración

const logger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transport.Console({ 
            level: "info",
            format: winston.format.combine(
                winston.format.colorize({colors: customLevelOptions.colors}),
                winston.format.simple()
            )
         }),
        new winston.transport.File({
            filename: "./errors.log",
            level: "warning",
            format: winston.format.simple()
         })
    ]
})

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        debug: 4
    },
    colors: {
        fatal: "red",
        error: "red",
        warning: "yellow",
        info: "blue",
        debug: "white"
    }
}


//middleware exports

const addLogger = (req, res, next) => {
    req.logger = logger
    //req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)
    req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)
    next()
}
// logger exports

module.exports = { 
    logger, 
    addLogger }
