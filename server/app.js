const express = require('express');
const morgan = require("morgan");
const fs = require('fs');
const app = express();
const csvLog = "./server/log.csv"
const csvToJson = require("csvtojson")

app.use(morgan("tiny"));

app.use((req, res, next) => {
    let agent = req.headers["user-agent"].replace(",", "");
    let time = new Date().toISOString();
    let method = req.method; 
    let resource = req.originalUrl;
    let version = req.protocol.toUpperCase() + "/" + req.httpVersion;
    let status = res.statusCode;
    let logData = `\n${agent}, ${time}, ${method}, ${resource}, ${version}, ${status}`;
    fs.appendFile(csvLog, logData, (err) => {
        if (err) {
            console.log(err);
        } 
    });
    next();
});

app.get('/', (req, res) => {
    res.status(200).send("ok");
});

app.get('/logs', (req, res) => {
    csvToJson()
    .fromFile(csvLog)
    .then((jsonLog) => {
        res.json(jsonLog);
        console.log(jsonLog);
    })
});

module.exports = app;
