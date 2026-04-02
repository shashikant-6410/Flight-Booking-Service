const { serverConfig,logger }  = require('./config');
const express = require('express');
const apiRoutes = require('./routes');
const CRON = require('./utils/common/cron-job');

const amqplib = require('amqplib');    

async function connectQueue() {

    try {
        const connetion = await amqplib.connect('amqp://localhost');
        const channel = await connetion.createChannel();
        await channel.assertQueue('noti-queue');
        channel.sendToQueue('noti-queue', Buffer.from('now ahead of yesterday'));

    } catch (error) {
        console.log(error);
        throw error;
    }
    
}

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api',apiRoutes);

app.listen(serverConfig.PORT, async()=>{
    console.log(`server is running on port ${serverConfig.PORT}`);
    CRON();
    // logger.info('logger is working');
    await connectQueue();
    console.log("rabbit passed");
})