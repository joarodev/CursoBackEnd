const multer = require('multer')
const path = require("path")

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        const folderID = req.user._id
        console.log("User ID MULTER", folderID)
        console.log("nombre del archivo", file.fieldname)

        if (file.fieldname === 'profileImage') {
            cb(null, path.join(__dirname, `../public/uploads/profile/${folderID}/`));
        } else if (file.fieldname === 'productImage') {
            cb(null, path.join(__dirname, `../public/uploads/products/${folderID}/`));
        } else if (file.fieldname === 'identification') {
            cb(null, path.join(__dirname, `../public/uploads/documents/${folderID}/`));
        } else if (file.fieldname === 'ProofOfAddress') {
            cb(null, path.join(__dirname, `../public/uploads/documents/${folderID}/`));
        } else if (file.fieldname === 'ProofOfStatus') {
            cb(null, path.join(__dirname, `../public/uploads/documents/${folderID}/`));
        } else {
            cb(new Error('Tipo de archivo no válido'));
        }
    },

    filename: (req, file, callback)=>{
        console.log("file", file)
        callback(null, `${file.originalname}`)
    }
})

const uploader = multer({
    storage,
    onError: (err,next)=>{
        console.log("Error al guardar archivo por multer",err)
        next()
    }
})

module.exports={
    uploader
}
