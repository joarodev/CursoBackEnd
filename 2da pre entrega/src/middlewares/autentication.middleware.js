function auth(req, res, next) {
    if(req.session.user !== "joaquin" || !req.session.admin){
        return res.status(401).send("error de autenticación")
    }
    next()
}

module.exports = {
    auth
}