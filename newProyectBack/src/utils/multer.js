const multer = require('multer')
const {dirname} = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        const userId = req.user._id

        if (file.fieldname === 'profileImage') {
            cb(null, `${__dirname}/public/uploads/profile/${userId}`);
        } else if (file.fieldname === 'productImage') {
            cb(null, `${__dirname}/public/uploads/products/${userId}`);
        } else if (file.fieldname === 'document') {
            cb(null, `${__dirname}/public/uploads/profile/${userId}`);
        } else {
            cb(new Error('Tipo de archivo no válido'));
        }
    },
    filename: (req, file, callback)=>{
        console.log("file")
        callback(null, `${file.originalname}`)
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
