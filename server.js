var PORT = process.env.PORT||3000;
const express = require('express');
var app = express();
var http=require('http').createServer(app);
var io=require('socket.io')(http);

app.use(express.static(__dirname+'/public'));

io.on('connection',function(socket){
    console.log('User Connected via socket.io');

    socket.on('message',function(message){
        console.log('Message reveived: '+message.text);

        //socket.broadcast.emit('message',message);
        io.emit('message',message);
    });

    socket.emit('message',{
        text:'Welcome to the web chat application'
    })
})

http.listen(PORT,function(){
    console.log('Server Started on http://localhost:'+PORT);
    
})