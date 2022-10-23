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

app.get("/admin", (request, response) => {
    response.status(200).json({message: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"})
});

module.exports = app;
