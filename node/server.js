// var Gpio = require('onoff').Gpio;
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
var port = 8080;

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
app.use(cors());
app.use(bodyParser());
app.use(express.json({limit: '50mb'}));
app.get('/gpio', (req,res) => {
    res.json(gpio_states());
})

function gpio_states(gpio){
    return ({
        "17":1,
        "18":0,
        "19":1
    });
}