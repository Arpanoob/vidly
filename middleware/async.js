function asyncMiddleware(handler) {
  return async function (req, res, next) {
    try {
      await handler();
    } catch (e) {
      next(e);
    }
  };
}

module.exports = asyncMiddleware;
