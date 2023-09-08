const { verifyAccessJWT } = require('../utils')
/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns
 */

const isApprovedUrls = [
  '/signup',
  '/signin',
  '/signin/new_token',
]

module.exports = (req, res, next) => {
  if (isApprovedUrls.indexOf(req.path) !== -1) {
    return next()
  };

  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    return res.status(401).send({
      error: 'You are unauthorized'
    });
  }

  const token = authorizationHeader.split(' ')[1];
  const { error, value } = verifyAccessJWT(token);
  if (error) {
    return res.status(401).send({
      error: 'You are unauthorized'
    });
  }

  req.user = value;
  return next();
}