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
pins["17"].writeSync(1);
pins["27"].writeSync(1);
pins["22"].writeSync(1);
app.use(cors());
app.use(bodyParser());
app.use(express.json({limit: '50mb'}));
app.get('/set/:pin/:state',(req, res) => {
    pins[req.params.pin].writeSync(req.params.state);
    res.json({"status":"done"});
})
app.get('/read/:pin/:state',(req, res) => {
    res.json({"status": pins[req.params.pin].readSync()});
})
app.listen(8080, () => {
    console.log(`Server is running on port: 8080`);
});
