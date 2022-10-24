const WebSocket = require('ws');
const GlobalVariables = require('./globalVariables')

let IDS = 0

function broadcast(jsonObject) {
    if (!this.clients) return;
    this.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(jsonObject));
        }
    });
}

function onError(ws, err) {
    console.error(`onError: ${err.message}`);
    const message = JSON.stringify({message: `🚌 Deu um erro aqui, se perde em são paulo nao visse que a gente já volta`})
    ws.send(message);
}
 
function onMessage(ws, data) {
    if (data == -1) {
        ws.send(JSON.stringify(GlobalVariables.ALL_BUSES))
    }
    console.log(`onMessage: ${data}`);
    console.log(ws)
}
 
function onConnection(ws, req) {
    let clientID = ws.id
    if (!ws.id) {
        clientID = IDS++
    }
    ws.id = clientID

    ws.on('message', data => onMessage(ws, data));
    ws.on('error', error => onError(ws, error));

    const message = JSON.stringify({message:`🚌 Conexao estabilizada!`})
    ws.send(message);
}
 
module.exports = (server) => {
    const wss = new WebSocket.Server({
        server
    });
 
    wss.on('connection', onConnection);
    wss.broadcast = broadcast;
 
    console.log(`🚌 Websocket pronto para receber requisições!`);
    return wss;
}