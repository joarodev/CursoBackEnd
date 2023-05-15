const multer = require('multer')
const {dirname} = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, `${__dirname}/public/uploads`)
    },
    filename: (req, file, callback)=>{
        callback(null, `${Date.now()}-${file.originalname}`)
    }
}) // nombre del archivo - ubicación

const uploader = multer({
    storage,
    onError: (err,next)=>{
        console.log(err)
        next(err)
    }
})

module.exports={
    uploader
}
