var PORT = process.env.PORT||3000;
const express = require('express');
var app = express();
var http=require('http').createServer(app);
var io=require('socket.io')(http);

app.use(express.static(__dirname+'/public'));

io.on('connection',function(){
    console.log('User Connected via socket.io');
    
})

http.listen(PORT,function(){
    console.log('Server Started on http://localhost:'+PORT);
    
})