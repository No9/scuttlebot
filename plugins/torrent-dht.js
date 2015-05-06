
var DHT = require('bittorrent-dht')

var port = 8009
var isBootstrapped = false;
function isFunction (f) {
  return 'function' === typeof f
}

function isString (s) {
  return 'string' === typeof s
}

exports.name = 'bittorrent-dht'
exports.version = '1.0.0'

//Need to map some is alive calls in here?
exports.manifest = {
}

exports.init = function (sbot) {
	
    var that = this;

    // Ignoring nodeId in opts as it's autocreated   
    // https://github.com/feross/bittorrent-dht/blob/master/client.js#L73
    // Setting bootstrap to false so we can add them later
	var opts = {
    	bootstrap: false
    }

    var dht = new DHT(opts)

    dht.listen(port, function () {
       sbot.emit('log:info', ['sbot', null, that.name, 'torrent-dht listening on ' + port])  
    })	

    dht.on('ready', function () {
       sbot.emit('log:info', ['sbot', null, that.name, 'torrent-dht routing table ready'])
    })

    dht.on('error', function() {
    	sbot.emit('log:warn', ['sbot', null, that.name, 'torrent-dht error: ' + err])
    })

    //sbot.on('server:connect', function(address){
	sbot.on('rpc:connect', function(server){

        var address = server._remoteAddress;
		//This is ripped from api.js so should probably be refactored into util.js
		//It also doesn't catch the local LAN IP address 
	    if (address == '127.0.0.1' || address == '::ffff:127.0.0.1') {
		  return;
        }

        //Also needs validating when --host is set at the commandline. 
        if (address == sbot.config.host) {
		 	return;
		}
     
        //Temp bootstrap management
        if(!isBootstrapped) {
            //Is there a better way to get the remote address than this?
            var addParse = address.replace('ws://', '')
            address = addParse.substring(0, addParse.lastIndexOf(':')) 
            
            sbot.emit('log:info', ['sbot', null, that.name, 'torrent-dht bootstraping on ' + address])
            dht.addNode(address + ':8009');
            isBootstrapped = true;
        }
    })
}