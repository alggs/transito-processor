const WebSocket = require('ws');
 
function onError(ws, err) {
    console.error(`onError: ${err.message}`);
    ws.send(`🚌 Deu um erro aqui, se perde em são paulo nao visse que a gente já volta`);
}
 
function onMessage(ws, data) {
    console.log(`onMessage: ${data}`);
    ws.send(`🚌 Message received`);
}
 
function onConnection(ws, req) {
    ws.on('message', data => onMessage(ws, data));
    ws.on('error', error => onError(ws, error));
    console.log(`🚌 You picked the wrong bus, fool!`);
    ws.send(`🚌 You picked the wrong bus, fool!`);    
}
 
module.exports = (server) => {
    const wss = new WebSocket.Server({
        server
    });
 
    wss.on('connection', onConnection);
 
    console.log(`🚌 Websocket pronto para receber requisições!`);
    return wss;
}