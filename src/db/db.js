const mysql2 = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const host = process.env.host || ''
const userdb = process.env.user || 'root'
const password_db = process.env.password || ''
const database = process.env.database || ''
const portdb = process.env.db_port || 3306

let connection; 
const reconnection = ()=>{
    connection = mysql2.createConnection({
        host: host,
        user: userdb,
        password:password_db,
        database: database,
        port: portdb
    });
    
    connection.connect((err)=>{
        if(err){
            console.log('[db err]',err);
            setTimeout(reconnection,200);
        }else{
            console.log("Connect to MySQL");
        }
    });

    connection.on('error' , err => {
        console.log('[db err]', err);
         if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            reconnection();
         }else{
            throw err;
         }
    })
        
};
reconnection();

//methods
const bcrypt = require('bcrypt');

//create
const create = async(data, callback)=>{
    let hashpass = await bcrypt.hash((data.password).toString(), parseInt(process.env.JUMPS));
    let queryCreate = `INSERT INTO user VALUES(0,'${data.username}','${data.email}','${hashpass}',${data.activo})`;   
    connection.query(queryCreate, (err,result)=>{
        try{
            if(err)throw err;
            callback(result);
        }catch(error){
            if(error.errno == 1062){ 
                callback({'message':'correo duplicado'});
            }
        console.error("se produjo un error: ", error);
        }
    })
}

//read
const read = (data, callback)=>{
    let readQuery = `SELECT id, username, email FROM user WHERE id = ${data.id}`;
    connection.query(readQuery,(err,result)=>{
        if(err)throw err;
        if(result[0]==null){
            callback({"message":"not exit"})
        }
        else{
            callback(result[0]);
        }
        
    })
}
//read 2

//update
const updateData = async(data, callback)=>{
    let hashpass = await bcrypt.hash((data.password).toString(), parseInt(process.env.JUMPS));
    let updateQuery = `UPDATE user SET username='${data.username}', email='${data.email}', password='${hashpass}', activo=${data.activo} WHERE email="${data.email}"`;
    connection.query(updateQuery,(err, result)=>{
        if(err)throw err;
        callback(result);
    })
}

//delete
const deleteUSer = (data, callback)=>{
    let deleteQuery = `DELETE FROM user where email = '${data.email}'`;
    connection.query(deleteQuery,(err, result)=>{
        if(err) throw err;
        callback(result); 
        
    });
}

const auth = require('./auth/auth')
const login = async (data, callback) =>{
    let queryLog = `SELECT email,password FROM user where email='${data.email}'`;
    connection.query(queryLog, (err, result)=>{
        if(err){
            throw err;
        }else{
            bcrypt.compare(data.password, result[0].password)
            .then(result=>{
                if(result == true){
                    //generate token
                    callback(auth.assignToken({...result[0]}))
                }else{
                    throw new Error('información invalida');
                }
            })
        }
    })

    
}
module.exports = {create, read, updateData, deleteUSer, login};