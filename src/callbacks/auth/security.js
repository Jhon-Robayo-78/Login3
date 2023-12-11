const  {checkToken } = require('../../db/auth/auth');
const securityMiddleware = (req, res, next)=>{
    const id = req.body.id;
    checkToken.confirmToken(req, id);
    next();
}

module.exports = {securityMiddleware};