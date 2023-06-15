class ContactController{
    getContact = async (req, res) =>{
        //let result

        res.send({
            status: "success",
            payload: "contactos get"
        })
    }

    createContact = async (req, res) =>{
        let {name, lastname, phone} = req. body
        


        res.send({
            status: "success",
            payload: "contactos Post"
        })
    }
}

module.exports = {ContactController}