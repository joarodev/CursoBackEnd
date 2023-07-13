const winston = require("winston")

const prodLogger = winston.createLogger({
    transports: [
        new winston.transports.Console({ level:  "http" }),
        new winston.transports.File({ filename: ".errors.log", level: "warn"})
    ]
})

// logger exports
module.exports = { prodLogger }
