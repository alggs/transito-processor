const amqp = require('amqplib/callback_api');
const app = require("./app");
var ALL_BUSES = {};
// ==X==X==X==X==X==X==X==X==X==X==X==X==X HTTP SERVER ==X==X==X==X==X==X==X==X==X==X==X==X==X 


app.listen(8080, () => {
    console.log('🚀 processor started!')
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
                ALL_BUSES = JSON.parse(msg.content);
            }, { noAck: true });
        });
    });


})

// ==X==X==X==X==X==X==X==X==X==X==X==X==X SUB (QUEUE CONSUMER) ==X==X==X==X==X==X==X==X==X==X==X==X==X 
