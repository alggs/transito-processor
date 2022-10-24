const WebSocket = require('ws');
const GlobalVariables = require('./globalVariables')
const { from, map, distinct, toArray, filter } = require('rxjs')

let IDS = 0

const clientRouteChoosed = {}

filterLinesIntoObjects = (lines) => {
    return {
        id: lines.c,
        name: `${lines.lt0} / ${lines.lt1}`
    }
}

function broadcast() {
    if (!this.clients) return;
    this.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            const route = clientRouteChoosed[client.id] || 'all'
            from(Object.values(GlobalVariables.ALL_BUSES.l))
            .pipe(
                filter(lines => route === 'all' || lines.c === route),
                toArray()
            ).subscribe(result => client.send(JSON.stringify(result)))
        }
    });
}

function onError(ws, err) {
    console.error(`onError: ${err.message}`);
    const message = JSON.stringify({message: `🚌 Deu um erro aqui, se perde em são paulo nao visse que a gente já volta`})
    ws.send(message);
}
 
function onMessage(ws, data) {
    data = data.toString()
    console.log(data)
    if (data === '-1') {
        from(Object.values(GlobalVariables.ALL_BUSES.l))
        .pipe(
            map(filterLinesIntoObjects),
            distinct(({ id }) => id),
            toArray()
        ).subscribe(result => ws.send(JSON.stringify(result)))
    } else {
        clientRouteChoosed[ws.id] = data
        const route = data || 'all'
        from(Object.values(GlobalVariables.ALL_BUSES.l))
        .pipe(
            filter(lines => route === 'all' || lines.c === route),
            toArray()
        ).subscribe(result => ws.send(JSON.stringify(result)))
    }
    console.log(`onMessage: ${data}`);
}
 
function onConnection(ws, req) {
    let clientID = ws.id
    if (!ws.id) {
        clientID = IDS + 1
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