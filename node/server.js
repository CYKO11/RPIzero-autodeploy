const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const fs = require('fs');
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
app.get('/read/:pin/:state',(req, res) => {
    res.json({"status": pins[req.params.pin].readSync()});
})
app.get('/buttons', (req, res) => {
    fs.readFile('buttons.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    });
})
app.listen(8080, () => {
    console.log(`Server is running on port: 8080`);
});
