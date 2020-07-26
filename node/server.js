// var Gpio = require('onoff').Gpio;
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
var Gpio = require('onoff').Gpio; //require onoff to control GPIO
var light17 = new Gpio(17, 'out'); //declare GPIO4 an output
var light27 = new Gpio(27, 'out'); //declare GPIO4 an output
var light22 = new Gpio(22, 'out'); //declare GPIO4 an output
var port = 8080;

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
    // LEDPin.writeSync(0);
});
app.use(cors());
app.use(bodyParser());
app.use(express.json({limit: '50mb'}));
app.get('/pin17', (req,res) => {
    if (light17.readSync() == 1)
        light17.writeSync(0);
    else
        light17.writeSync(1);
    res.json({"state":light17.readSync()})
})
app.get('/pin27', (req,res) => {
    if (light27.readSync() == 1)
        light27.writeSync(0);
    else
        light27.writeSync(1);
    res.json({"state":light27.readSync()})
})
app.get('/pin22', (req,res) => {
    if (light22.readSync() == 1)
        light22.writeSync(0);
    else
        light22.writeSync(1);
    res.json({"state":light22.readSync()})
})
function gpio_states(gpio){
    return ({
        "17":1,
        "18":0,
        "19":1
    });
}