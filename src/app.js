const express = require("express");

const app = express();

app.use(express.json());

function logRequests(req, res, next) {
    const {url, method} = req;
    const logLabel = `[${method.toUpperCase()} ${url}] ⛏ `
    console.time(logLabel);
    next();
    console.timeEnd(logLabel) 
}

app.use(logRequests); // Usando o middleware pare logar todas as requisições que recebermos no console

app.get("/busline/:id", (request, response) => {

    const {id} = request.params;
    // startar um websocket
    response.status(200).json({message: "A connection will be stablished to pass your data."})
});

module.exports = app;
