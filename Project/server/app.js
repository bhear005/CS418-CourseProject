// console.log('Hello from node application');

import express from "express";
const app=express();
const port=8080; 

app.get('/', (req,res)=>{
    res.send('Response from get api');
})

app.listen(port, ()=>{
    console.log('Server is running at port ${port}');
})

export default app;