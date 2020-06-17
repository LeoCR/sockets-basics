var PORT = process.env.PORT||3000;
const express = require('express');
var app = express();
var http=require('http').createServer(app);
var io=require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname+'/public'));

var clientInfo={};
/**
 * Sends current users to provided socket
 */
function sendCurrentUsers(socket){
    var info=clientInfo[socket.id];
    var users=[];

    if(typeof info ==='undefined'){
        return;
    }
    Object.keys(clientInfo).forEach(function(socketId){
        var userInfo= clientInfo[socketId];

        if(info.room===userInfo.room){
            users.push(userInfo.name)
        }
    });
    socket.emit('message',{
        name:'System',
        text:'Current users: '+ users.join(', '),
        time:moment().local().format('MMM Do YYYY h:mm a')
    })
}
io.on('connection',function(socket){
    console.log('User Connected via socket.io');
    socket.on('disconnect',function(){
        var userData=clientInfo[socket.id];
        if(typeof userData!=='undefined'){
            socket.leave(userData.room);
            io.to(userData.room).emit('message',{
                name:'System',
                text:userData.name+ ' has left!',
                time:moment().local().format('MMM Do YYYY h:mm a')
            }) 
            delete clientInfo[socket.id];      
        }
    })
    /**
    * Listening the joinRoom event and pass the argument as requeset
    * 
    **/
    socket.on('joinRoom',function(req){
        /**
         * Store user data
         */    
        clientInfo[socket.id]=req;
        /**
         * socket.join is a built in method that tells the Socket.io to add to this socket
         * to a specific room.Now we have have the room name in the request object
         */
        socket.join(req.room);
        /**
         * Emit a message to everyone in the room that a new person joined
         * socket.broadcast sends the event to everybody but the current socket
         * and then we are going to use the two method wich lets us specify
         * the specific room to send the message to
         * only the people in this room see this message
         */
        socket.broadcast.to(req.room).emit('message',{
            name:'System',
            text:req.name+ ' has joined!',
            time:moment().local().format('MMM Do YYYY h:mm a')
        })
    })

    socket.on('message',function(message){
        console.log('Message reveived: '+message.text);
        /**
         * Intercepting user message
         */
        if(message.text==='@currentUsers'){
            sendCurrentUsers(socket);
        }
        else{
            message.time=moment().local().format('MMM Do YYYY h:mm a')
            //socket.broadcast.emit('message',message);
            /**
             * Only emits the message to people who are in the same room
             */
            io.to(clientInfo[socket.id].room).emit('message',message);
        }
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