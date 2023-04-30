const multer = require('multer')
const { dirname } = require(`path`)
const path = (`${__dirname}/public`)



const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, `${__dirname}/public/uploads`)
    },
    filename: function(req, file, cb){
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const uploader = multer({
    storage,
    onError: function(err, next){
        console.log(err)
        next()
    }
})

module.exports = {uploader}