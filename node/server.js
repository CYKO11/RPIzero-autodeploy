// var Gpio = require('onoff').Gpio;
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
var Gpio = require('onoff').Gpio; //require onoff to control GPIO
var pins = {
    "17": new Gpio(17, 'out'),
    "27": new Gpio(27, 'out'),
    "22": new Gpio(22, 'out'),
}

app.listen(8080, () => {
    console.log(`Server is running on port: 8080`);
});
app.use(cors());
app.use(bodyParser());
app.use(express.json({limit: '50mb'}));

app.get('/set/:pin/:state',(res,req) => {
    pins[req.params.pin].writeSync(req.params.state);
    res.json({"status":"done"});
})
app.get('/read/:pin/:state',(res,req) => {
    res.json({"status": pins[req.params.pin].readSync()});
})

function gpio_states(gpio){
    return ({
        "17":1,
        "18":0,
        "19":1
    });
}