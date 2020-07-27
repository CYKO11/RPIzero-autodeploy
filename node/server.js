const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const fs = require('fs');
const { resolveSoa } = require('dns');
const { kill } = require('process');
var Gpio = require('onoff').Gpio;
var pins = {
    "17": new Gpio(17, 'out'),
    "27": new Gpio(27, 'out'),
    "22": new Gpio(22, 'out'),
}
pins["17"].writeSync(1);
pins["27"].writeSync(1);
pins["22"].writeSync(1);
app.use(cors());
app.use(bodyParser());
app.use(express.json({limit: '50mb'}));
app.get('/set/:pin/:state',(req, res) => {
    console.log(req.params);
    pins[req.params.pin].writeSync(parseInt(req.params.state));
    res.json({"status":"done"});
})
var pin_keys = []
var pin_states = {}
app.get('/read',(req, res) => {
    pin_keys = Object.keys(pins);
    pin_keys.forEach((Element) => {
        pin_states[Element] = pins[Element].readSync();
    })
    res.json(pin_states);
})
app.get('/', (req, res) => {
    fs.readFile('buttons.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    });
})
function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function kill_animation(){
    await sleep(200);
    pins["17"].writeSync(0);
    pins["27"].writeSync(0);
    pins["22"].writeSync(0);
    await sleep(200);
    pins["17"].writeSync(1);
    pins["27"].writeSync(1);
    pins["22"].writeSync(1);
    await sleep(200);
    pins["17"].writeSync(0);
    pins["27"].writeSync(0);
    pins["22"].writeSync(0);
}
app.get('/kill', (req,res) => {
    kill_animation().then(() => {
        console.log('shutdown command recieved');
        res.json({"shutting down":"ready for redeploy"});
        process.exit();
    })
})
app.listen(8080, () => {
    console.log(`Server is running on port: 8080`);
});
