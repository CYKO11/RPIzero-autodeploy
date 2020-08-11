const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const fs = require('fs');
var Gpio = require('onoff').Gpio;
var pin_conf = {
    "5": {
        "health":"good",
        "func":"ambient",
        "name":"floor lamp",
        "pos":{
            "room":1,
            "corner":4,
            "hieght":"lower",
        },
        "pin": new Gpio(5, 'out')
    },
    "6": {
        "health":"good",
        "func":"spare",
        "name":null,
        "pos":{
            "room":null,
            "corner":null,
            "hieght":null,
        },
        "pin": new Gpio(6, 'out')
    },
    "13":{
        "health":"good",
        "func":"spare",
        "name":null,
        "pos":{
            "room":null,
            "corner":null,
            "hieght":null,
        },
        "pin": new Gpio(13, 'out')
    },
    "19":{
        "health":"good",
        "func":"spare",
        "name":null,
        "pos":{
            "room":null,
            "corner":null,
            "hieght":null,
        },
        "pin": new Gpio(19, 'out')
    },
    "26":{
        "health":"good",
        "func":"spare",
        "name":null,
        "pos":{
            "room":null,
            "corner":null,
            "hieght":null,
        },
        "pin": new Gpio(26, 'out')
    },
    "16":{
        "health":"good",
        "func":"spare",
        "name":null,
        "pos":{
            "room":null,
            "corner":null,
            "hieght":null,
        },
        "pin": new Gpio(16, 'out')
    },
    "20":{
        "health":"good",
        "func":"spare",
        "name":null,
        "pos":{
            "room":null,
            "corner":null,
            "hieght":null,
        },
        "pin": new Gpio(20, 'out'),
    },
    "21": {
        "health":"good",
        "func":"spare",
        "name":null,
        "pos":{
            "room":null,
            "corner":null,
            "hieght":null,
        },
        "pin": new Gpio(21, 'out'),
    }
}

app.use(cors());
app.use(bodyParser());
app.use(express.json({limit: '50mb'}));

//
// Set by routes and functions
app.get('/set/:by/:arg/:state', (req, res) => {
    if (!(req.params.by == "health" || req.params.by == "func" || req.params.by == "name" || req.params.state == "1" || req.params.state == "0")){
        res.send(400);
    } else {
        var pin_set = get_by(req.params.by, req.params.arg);
        set_pin_set(pin_set.valid, parseInt(req.params.state));
        console.log(pin_set.invalid);
        res.send(200);
    }
})
function get_by(by, arg){
    var pin_num = Object.keys(pin_conf);
    var pin_set = {
        "valid":[],
        "invalid":[]
    };
    pin_num.forEach(num => {
        if (pin_conf[num][by] == arg)
            pin_set.valid.push(pin_conf[num].pin);
        else
            pin_set.invalid.push(num);
    });
    return pin_set;
}
function set_pin_set(pins, state){
    pins.forEach(pin => {
        pin.writeSync(state);
    });
}
//
// //
// set individiual 
app.get('/test/:pin/:state',(req, res) => {
    if (req.params.pin === "all")
        set_all(parseInt(req.params.state));
    else
        pin_conf[req.params.pin].writeSync(parseInt(req.params.state));
    res.json({"status":"done"});
})

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}
// server basics
// kill command
function set_all(state){
    var pin_num = Object.keys(pin_conf);
    pin_num.forEach((num) => {
        pin_conf[num].pin.writeSync(state);
    })
}
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



