const mysql2 = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const host = process.env.SERVER || ''
const userdb = process.env.USER || 'root'
const password_db = process.env.PASSWORD || ''
const database = process.env.DATABASE || ''
const portdb = process.env.PORTdb || 3306

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
    var count;
    let hashpass = await bcrypt.hash((data.password).toString(), parseInt(process.env.JUMPS));
    let queryValidator = `SELECT COUNT(*) FROM Useruniversity WHERE emailAcademico='${data.email}'`;
    connection.query(queryValidator, (err,result)=>{
        if(err) throw err;
        count=result[0]["COUNT(*)"];
        if(count==1){ 
            let queryCreate = `INSERT INTO Account (id, email, password, rol)
                                    SELECT u.id, u.emailAcademico, '${hashpass}', u.Rol
                                    FROM Useruniversity as u
                                    WHERE u.id = '${data.id}'`;   
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
        }else{
            callback({"message":"Correo academico inexistente"})
        }
    })
    
    
}

//read
const read = (data, callback)=>{
    let readQuery = `SELECT id, email, rol FROM Account WHERE id = ${data.id}`;
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
    let updateQuery = `UPDATE Account SET password='${hashpass}' WHERE email="${data.email}"`;
    connection.query(updateQuery,(err, result)=>{
        if(err)throw err;
        callback(result);
    })
}

//delete
const deleteUSer = (data, callback)=>{
    let deleteQuery = `DELETE FROM Account where email = '${data.email}'`;
    connection.query(deleteQuery,(err, result)=>{
        if(err) throw err;
        callback(result); 
        
    });
}

const auth = require('./auth/auth')
const login = async (data, callback) =>{
    let queryLog = `SELECT email,password,rol FROM Account where email='${data.email}'`;
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
                    callback({message:"información invalida"})
                    //throw new Error('información invalida');
                }
            })
        }
    })

    
}
module.exports = {create, read, updateData, deleteUSer, login};