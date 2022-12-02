const express = require('express');
const app = express();
var bodyParser = require('body-parser');
//var chatMessage = require('./dataModel/chatMessage.js')
require('./dbconn/dbconn')(app);
app.use(express.json())
app.use(express.urlencoded({ extended: true }))



app.use("/test",(req,res)=>{
    res.send("fuck")
})



app.use((err,req,res,next)=>{
    if(err)
    {
        console.log(err)
    }
    next()
})

const user_router = require("./routers/userImformation.js");
app.use("/user",user_router)

const server = require('http').Server(app);
const io = require("socket.io")(server,{cors:true});
server.listen(9090,function(err) {
    if(err)
    {
        console.log(监听失败);
    }
    console.log("ok");
})
app.get('/tests',(req,res)=>{
        res.sendFile(__dirname + '/index.html');
});



let users = {}

io.on('connection',(socket)=>{
    console.log("!");
    socket.on('chat message',async(msg)=>{
        io.emit('chat message',msg);
    })
})





























