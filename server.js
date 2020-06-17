var PORT = process.env.PORT||3000;
const express = require('express');
var app = express();
var http=require('http').createServer(app);
var io=require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname+'/public'));

var clientInfo={};

io.on('connection',function(socket){
    console.log('User Connected via socket.io');

    socket.on('joinRoom',function(req){
        clientInfo[socket.id]=req
        socket.join(req.room);
        socket.broadcast.to(req.room).emit('message',{
            name:'System',
            text:req.name+ ' has joined!',
            timestamp:moment().local().format('MMM Do YYYY h:mm a')
        })
    })

    socket.on('message',function(message){
        console.log('Message reveived: '+message.text);

        message.time=moment().local().format('MMM Do YYYY h:mm a')
        //socket.broadcast.emit('message',message);
        io.to(clientInfo[socket.id].room).emit('message',message);
    });
    //timestamp property = Javascript timestamp (miliseconds)
    socket.emit('message',{
        name:'System',
        text:'Welcome to the web chat application',
        time:moment().local().format('MMM Do YYYY h:mm a')
    })
})

http.listen(PORT,function(){
    console.log('Server Started on http://localhost:'+PORT);
    
})