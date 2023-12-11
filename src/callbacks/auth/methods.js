const {login} = require('../../db/db');

const loginMethod = (req, res)=>{
    try{
        login({email:req.body.email, password:req.body.password}, 
            (result)=>{
                res.status(200).json(result)
            });
        //res status . . .
    }catch(err){
        console.error(err);
        res.status(500).json({"message":"Ha ocurrido un error"})
    }
    
    
}

module.exports = {
    loginMethod
};