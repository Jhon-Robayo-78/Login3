class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'CustomError';
        this.statusCode = statusCode;
    }
}

const jwt = require('jsonwebtoken');

require('dotenv').config();

const Sk = process.env.SECRET_KEY || 'holamundo';

const assignToken = (data)=>{
    const expiresIn = '1d';
    const audience = 'apiusers'; // Asegúrate de que este valor coincida con el definido en tu aplicación .NET
    const issuer = 'http://localhost:8050/api/auth'; // Asegúrate de que este valor coincida con el definido en tu aplicación .NET

    //return jwt.sign(data, Sk, { expiresIn, audience, issuer });
    //return jwt.sign(data, Sk, { expiresIn });
    return jwt.sign({email:data.email, role:data.rol}, Sk);
};

const checkToken = {
    confirmToken: function(req, id){
        const decodify = decodifyHeader(req);

        if(decodify.id !== id){
            throw new CustomError("unauthorized",401);
        }
    }
} ;

const verifyToken = (token)=>jwt.verify(token, Sk);

const getToken = (authorized)=>{
    if(!authorized){
        throw new CustomError('not token',401);
    }

    if(authorized.indexOf('Bearer') === -1){
        throw new CustomError('invalid format',401);
    }

    let token = authorized.replace('Bearer ', '')

    return token;
}

const decodifyHeader = (req)=>{
    const authorized = req.headers.authorization || '';
    const token = getToken(authorized);
    const decodify = verifyToken(token);

    req.user = decodify;

    return decodify;
};

// Middleware de manejo de errores personalizado
const errorHandlerMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const errorMessage = err.message || 'Internal Server Error';

    res.status(statusCode).json({ error: errorMessage });
};

module.exports = {
    assignToken,
    checkToken,
    CustomError,
    errorHandlerMiddleware
};