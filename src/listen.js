var faye = require('faye');
var faye_server = new faye.NodeAdapter({mount: '/faye', timeout: 120});

console.log('Firing up faye server. . . ');
faye_server.attach(8089);

//send message out every 1 second
setInterval( function()
{   
    var currentTime_secsSinceEpoch = new Date().getTime() / 1000;

    faye_server.getClient().publish('/heartbeat', 
    {
        pageName: 'app.js',
        timeMessageSent_secs_since_epoch: currentTime_secsSinceEpoch,
        iFrame1CycleCount: iFrame1CycleCount

    });
}, 1000);