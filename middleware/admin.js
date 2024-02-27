function admin(req, res, next) {
  //remember 401 un aurthorized 403 forbidden
  if (!req.user.isAdmin)
    return res.status(403).send("Forbidden : Acess Denied");

  next();
}

module.exports = admin;
