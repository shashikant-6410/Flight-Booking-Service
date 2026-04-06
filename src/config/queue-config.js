const amqplib = require('amqplib');    
const {QUEUE} = require('./server-config')

let channel, connection;

async function connectQueue() {

    try {
         connection = await amqplib.connect('amqp://localhost');
         channel = await connection.createChannel();
        await channel.assertQueue(QUEUE);

    } catch (error) {
        console.log(error);
        throw error;
    }
    
}

async function sendData(data) {  //data will mostly be an object
    try {
       await channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(data)));
       
    } catch (error) {
        throw error;
    }
    
}

module.exports={
    connectQueue,
    sendData
}



