
var DHT = require('bittorrent-dht')

var port = 8009

function isFunction (f) {
  return 'function' === typeof f
}

function isString (s) {
  return 'string' === typeof s
}

exports.name = 'bittorrent-dht'
exports.version = '1.0.0'

exports.manifest = {
}

exports.init = function (sbot) {
	var dht = new DHT()

	var that = this;
	dht.listen(port, function () {
  		sbot.emit('log:info', ['sbot', null, that.name, 'torrent-dht listening on ' + port])
	     
	})	
	
	dht.on('ready', function () {
		sbot.emit('log:info', ['sbot', null, that.name, 'torrent-dht routing table ready'])
    })

}