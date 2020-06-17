var socket= io();
var name = getQueryVariable('name')||'Anonymous';
var room = getQueryVariable('room')||'Anonymous';

console.log(name+' wants to join '+room);


socket.on('connect',function(){
    console.log('Connected to socket.io server');
    jQuery('.room-title').text('Room Name: '+room)    
    socket.emit('joinRoom',{
        name:name,
        room:room
    })
})
socket.on('message',function(message){
    var $message=jQuery('.messages');
    console.log('New Message');
    console.log(message.text); 
    $message.append('<p><strong>'+message.name+' '+message.time+ '</strong></p>');
    $message.append('<p>'+message.text+'</p>')
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