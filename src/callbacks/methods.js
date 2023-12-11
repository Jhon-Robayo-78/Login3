const {create, read, updateData, deleteUSer} = require('../db/db');

const createUser = (req, res)=>{
    if(!req.body){
        console.log(req.body);
        res.status(404).json({"message":"error, not found"})
    }else{
        try{
           create(req.body, (result)=>{
            
                res.status(200).json(result)
            });
        }catch(error){
            console.error(error);

        }
        
    }
}

const getUser = (req, res)=>{
    let id = parseInt(req.params.id);
    //console.log(id, isNaN(id));
    if(isNaN(id)==false){
        read(req.params, (result)=>{
            res.status(200).json(result)
        });
        
    }else{
        res.status(400).json({"message":"invalid"});
    }  
        
}

const putUser = (req,res)=>{
    if(!req.body){
        res.status(404).json({"message":"error empty"});
    }
    else{
       updateData(req.body, (result)=>{
            res.status(200).json(result)
        });
    }
}

const delUser = (req, res)=>{
    if(!req.body){
        res.status(404).json({"message":"error, not found"})
    }else{
        deleteUSer(req.body, (result)=>{
            res.status(200).json(result)
        });
    }
}

module.exports = {
    getUser, 
    putUser, 
    delUser,
    createUser
};