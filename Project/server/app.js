// console.log('Hello from node application');

import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import user from "./routes/user.js";
import classes from "./routes/classes.js";
import advisinghistory from "./routes/advisinghistory.js";
import studentadvising from "./routes/studentadvising.js";

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
    // origin:"http://localhost:5173"
    origin: "*"
}))

app.use('/user',user);
app.use('/classes',classes);
app.use('/advisinghistory',advisinghistory);
app.use('/studentadvising',studentadvising);

// console log that server is running at designated port
app.listen(port, ()=>{
    console.log(`Server is running at port ${port}`);
})

export default app;