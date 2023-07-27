const jwt = require('jsonwebtoken');
const { envConfig } = require('../config/config');


// Middleware para la estrategia JWT de restablecimiento de contraseña
const resetPassStrategy = (req, res, next) => {
  const token = req.params.token;

  try {
    // Verifica el token para asegurarte de que no haya expirado
    const decodedToken = jwt.verify(token, envConfig.JWT_SECRET_KEY);

    if(!decodedToken){
        req.logger.error(`El token ah expirado, intente restablecer nuevamente`);
        req.logger.http(`El token ah expirado, intente restablecer nuevamente`);
        res.redirect("/reset-password")
    }
    console.log("decoded email ", decodedToken.email)
    // Si el token es válido, extrae el correo electrónico del usuario del token y lo agrega al objeto de solicitud (req)
    req.email = decodedToken.email;
    next();
  } catch (error) {
    // Si el token es inválido o ha expirado, responde con un error
    res.status(400).send({ error: 'Token inválido o expirado' });
  }
};

module.exports = resetPassStrategy;