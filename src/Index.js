const express = require("express");

const app = express();

const morgan = require('morgan');

//cors config 
const cors = require("cors");
app.use(cors());

//analisis del cuerpo para la conversión de datos a json
app.use(express.json());

//Middleware
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
//routes
app.get('/',(req,res)=>{
    res.send('\tBienvenido');
})

const { routes } = require("./Routes/routes");
app.use("/api", routes);


//reading of .env files
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.port || 3010;

app.use((req, res)=>res.status(404).send("error"));

//power on 
app.listen(port, ()=>console.log(`server runnig on ${port}`));