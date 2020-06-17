var socket= io();
var name = getQueryVariable('name')||'Anonymous';
var room = getQueryVariable('room')||'Anonymous';

console.log(name+' wants to join '+room);


socket.on('connect',function(){
    /**
     * This callback is gets fired when the client 
     * successfully connects to the server
     */
    console.log('Connected to socket.io server');
    jQuery('.room-title').text('Room Name: '+room)    
    socket.emit('joinRoom',{
        /**
         * Call a new event that we are going to create
         * in the server.We are going to send across the name of the person
         * and the room they want to Join
         **/
        name:name,
        room:room
    })
})
socket.on('message',function(message){
    var $messages=jQuery('.messages');
    var $message=jQuery('<li class="list-group-item"></li>');
    console.log('New Message');
    console.log(message.text); 
    $message.append('<p><strong>'+message.name+' '+message.time+ '</strong></p>');
    $message.append('<p>'+message.text+'</p>')
    $messages.append($message);
})
/**
 * Handles submitting of new message
 */
var $form=jQuery("#message-form");

$form.on('submit',function(event){
    event.preventDefault();

    var $message=$form.find('input[name=message]');

    socket.emit('message',{
        name:name,
        text:$message.val()
    })
    setTimeout(() => {
        $message.val('');
    }, 200);
});