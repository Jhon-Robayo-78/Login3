const express = require('express');
const routes = express.Router();
const {createUser, getUser, putUser, delUser} = require("../callbacks/methods");
const { loginMethod } = require('../callbacks/auth/methods');
const { securityMiddleware } = require('../callbacks/auth/security');
const { errorHandlerMiddleware, CustomError} = require('../db/auth/auth');

routes.get("/exit",()=>{});//logout
routes.post("/auth",loginMethod);//login

routes.get("/user/:id",getUser);//user
routes.post("/signUp",createUser);//create user
routes.put("/user/update", securityMiddleware, putUser);
routes.delete("/user/delete", securityMiddleware, delUser);

// Usa el middleware de manejo de errores al final de tus rutas
routes.use(errorHandlerMiddleware);

module.exports = { routes };