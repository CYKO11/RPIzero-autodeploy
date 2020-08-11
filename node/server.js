const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const fs = require('fs');
var Gpio = require('onoff').Gpio;
var pins = {
    "5": new Gpio(5, 'out'),
    "6": new Gpio(6, 'out'),
    "13": new Gpio(13, 'out'),
    "19": new Gpio(19, 'out'),
    "26": new Gpio(26, 'out'),
    "16": new Gpio(16, 'out'),
    "20": new Gpio(20, 'out'),
    "21": new Gpio(21, 'out'),
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

// app.get('/satisfy', (req, res) => {
//     set_all(1);
//     async function satisfy(){
//         await sleep(500);
//         var i = 0;
//         while (i < pin_keys.length){
//             pins[pin_keys[i]].writeSync(0);
//             await sleep(200);
//             i++;
//         }
//     }
//     satisfy();
//     res.json({"status":"are you satisfied"});
// })

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
    set_all(0);
    sleep(500).then(() => {
        set_all(1);
    })
});
