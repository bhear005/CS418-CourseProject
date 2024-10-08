// console.log('Hello from node application');

import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import user from "./routes/user.js";

const app=express();
const port=8080; 

const myLogger = function(req,res,next){
    console.log('Calling Api');
    next()
    console.log('Api call finished');
}

app.use(myLogger);
app.use(bodyParser.json());
app.use(cors({
    origin:"http://localhost:5173"
}))

app.use('/user',user);

// console log that server is running at designated port
app.listen(port, ()=>{
    console.log(`Server is running at port ${port}`);
})

export default app;