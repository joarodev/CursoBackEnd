const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
    } else {
      res.status(403).json({ error: 'Acceso denegado. Solo los administradores pueden realizar esta acción.' });
    }
  };
  
  const isUser = (req, res, next) => {
    if (req.user && req.user.role === 'user') {
      next();
    } else {
      res.status(403).json({ error: 'Acceso denegado. Solo los usuarios pueden realizar esta acción.' });
    }
  };
  
  const isUserOrAdmin = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'user')) {
    } else {
      res.status(403).json({ error: 'Acceso denegado. Inicia sesión para realizar esta acción' });
    }
  };

  module.exports = {
    isAdmin,
    isUser,
    isUserOrAdmin
  }