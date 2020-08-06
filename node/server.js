const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const fs = require('fs');
var Gpio = require('onoff').Gpio;
var pins = {
    "27": new Gpio(27, 'out'),
    "22": new Gpio(22, 'out'),
    "4": new Gpio(4, 'out'),
    "18": new Gpio(18, 'out'),
    "23": new Gpio(23, 'out'),
    "24": new Gpio(24, 'out'),
    "25": new Gpio(25, 'out'),
    "17": new Gpio(17, 'out'),
}
// server setup
app.use(cors());
app.use(bodyParser());
app.use(express.json({limit: '50mb'}));

// pin state setter
app.get('/set/:pin/:state',(req, res) => {
    if (req.params.pin === "all")
        set_all(parseInt(req.params.state));
    else
        pins[req.params.pin].writeSync(parseInt(req.params.state));
    res.json({"status":"done"});
})
app.get('/flip/:pin',(req, res) => {
    if (pins[req.params.pin].readSync() == 1)
        pins[req.params.pin].writeSync(0);
    else
        pins[req.params.pin].writeSync(1);
    res.json({"status":"done"});
})

// pin state reader
var pin_keys = Object.keys(pins);
var pin_states = {}
app.get('/read',(req, res) => {
    pin_keys.forEach((Element) => {
        pin_states[Element] = pins[Element].readSync();
    })
    res.json(pin_states);
})

// web page
app.get('/', (req, res) => {
    fs.readFile('ui.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    });
})

app.get('/satisfy', (req, res) => {
    set_all(1);
    async function satisfy(){
        await sleep(500);
        var i = 0;
        while (i < pin_keys.length){
            pins[pin_keys[i]].writeSync(0);
            await sleep(200);
            i++;
        }
    }
    satisfy();
    res.json({"status":"are you satisfied"});
})

// a very usefull function
function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

function set_all(state){
    pin_keys.forEach((Element) => {
        pins[Element].writeSync(state);
    })
}

// kill command
app.get('/kill', (req,res) => {
    async function kill_animation(){
        await sleep(200);
        set_all(0);
        await sleep(200);
        set_all(1);
    }
    kill_animation().then(() => {
        console.log('shutdown command recieved');
        res.json({"shutting down":"ready for redeploy"});
        process.exit();
    })
})

// server host
app.listen(8080, () => {
    console.log(`Server is running on port: 8080`);
    // set_all(0);
});
