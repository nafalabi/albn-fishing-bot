const PhotonParser = require('../vendor/photon-packet-parser');
const Cap = require('cap').Cap;
const decoders = require('cap').decoders;
const { networkInterfaces } = require('os')
const readlineSync = require('readline-sync');


const initListener = () => {
    const listener = new PhotonParser();
    const capture = new Cap();
    const adapterIp = getAdapterIp()
    const device = Cap.findDevice(adapterIp);
    const filter = 'udp and (dst port 5056 or src port 5056)';
    // const bufSize = 10 * 1024 * 1024;
    // const buffer = Buffer.alloc(65535);
    const bufSize = 4096;
    const buffer = Buffer.alloc(4096);
    const linkType = capture.open(device, filter, bufSize, buffer);

    capture.setMinBytes && capture.setMinBytes(0);

    capture.on('packet', (nbytes, trunc) => {
        let ret = decoders.Ethernet(buffer);
        ret = decoders.IPV4(buffer, ret.offset);
        ret = decoders.UDP(buffer, ret.offset);
    
        let payload = buffer.slice(ret.offset, nbytes);
    
        // Parse the UDP payload
        listener.handle(payload);
    });

    return listener
}

const getAdapterIp = () => {
    const interfaces = networkInterfaces()

    console.log()
    console.log('Please select one of the adapter that you use to connect to the internet:')

    let i = 1;
    const selection = {}
    const selectionName = {}
    for (const [name, value] of Object.entries(interfaces)) {
        const detail = value.find(v => v.family === 'IPv4')
        if (!detail) continue;
        selection[i] = detail.address;
        selectionName[i] = name;
        console.log(`  ${i}. ${name}\t ip address: ${detail.address}`)
        i++;
    }

    console.log()
    let userSelect = readlineSync.question('input the number here: ');
    const selectedIp = selection[userSelect]
    const selectedName = selectionName[userSelect]

    if (!selectedIp) {
        console.log()
        console.log('invalid input, try again')
        return getAdapterIp()
    }

    console.log()
    console.log(`you have selected "${selectedName}"`)
    console.log()

    return selectedIp
}

module.exports = {
    initListener,
}