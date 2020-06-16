var moment = require('moment');
var now = moment();

console.log(now.format());

//now.subtract(5,'year');

console.log(now.format());

console.log(now.format('MMM Do YYYY h:mma'));


console.log(now.format('h:mma'));


console.log(now.valueOf());


var timestamp=1592347560468;
var timeStampMoment=moment.utc(timestamp);

console.log(timeStampMoment.local().format('h:mm a'));
