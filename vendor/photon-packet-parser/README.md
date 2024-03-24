# Photon Packet Parser

This package is a parser for Photon Engine packets.

It embeds a deserializer for the [Protocol16](https://doc-api.photonengine.com/en/dotnet/current/class_exit_games_1_1_client_1_1_photon_1_1_protocol16.html).

# Example
```js
const PhotonParser = require('photon-packet-parser');
const Cap = require('cap').Cap;
const decoders = require('cap').decoders;

// Initiate the parser
const manager = new PhotonParser();
const capture = new Cap();
const device = Cap.findDevice('<interface ip>');
const filter = 'udp and (dst port 5056 or src port 5056)';
const bufSize = 10 * 1024 * 1024;
const buffer = Buffer.alloc(65535);
const linkType = capture.open(device, filter, bufSize, buffer);

capture.setMinBytes && capture.setMinBytes(0);

capture.on('packet', (nbytes, trunc) => {
	let  ret = decoders.Ethernet(buffer);
	ret = decoders.IPV4(buffer, ret.offset);
	ret = decoders.UDP(buffer, ret.offset);

	let payload = buffer.slice(ret.offset, nbytes);

	// Parse the UDP payload
	manager.handle(payload);
});
```