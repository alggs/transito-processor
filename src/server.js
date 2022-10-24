const amqp = require('amqplib/callback_api');
const websocket = require('./websocket');
const app = require("./app");
const server = require('http').createServer(app);
const GlobalVariables = require('./globalVariables')
// ==X==X==X==X==X==X==X==X==X==X==X==X==X HTTP SERVER ==X==X==X==X==X==X==X==X==X==X==X==X==X 

wss = websocket(server);

server.listen(3001, () => {
    console.log('🚌 processor started!')
});

// ==X==X==X==X==X==X==X==X==X==X==X==X==X HTTP SERVER ==X==X==X==X==X==X==X==X==X==X==X==X==X 



// ==X==X==X==X==X==X==X==X==X==X==X==X==X SUB (QUEUE CONSUMER) ==X==X==X==X==X==X==X==X==X==X==X==X==X 

amqp.connect('amqp://localhost:5672', function (err, conn) {

    conn.createChannel(function (err, ch) {
        var exchange = 'all_buses';

        ch.assertExchange(exchange, 'fanout', { durable: false });

        ch.assertQueue('', { exclusive: true }, function (err, q) {
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
            ch.bindQueue(q.queue, exchange, '');

            ch.consume(q.queue, function (msg) {
                console.log('🚌 VRUM VRUM OS ONIBUS SE MOVERAM!')
                GlobalVariables.ALL_BUSES = JSON.parse(msg.content);
            }, { noAck: true });
        });
    });


})

// ==X==X==X==X==X==X==X==X==X==X==X==X==X SUB (QUEUE CONSUMER) ==X==X==X==X==X==X==X==X==X==X==X==X==X 
