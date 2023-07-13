const { envConfig } = require("../config/config");
const { devLogger } = require("../config/devLogger");
const { prodLogger } = require("../config/prodLogger");


function loggerMiddleware(req, res, next) {
    if (envConfig.PERSISTENCE === 'production') {
      req.logger = prodLogger;
      console.log("Logger mode production")
    } else {
      req.logger = devLogger;
      console.log("Logger mode development")
    }
    req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)
    next()
  }

  module.exports = { loggerMiddleware }