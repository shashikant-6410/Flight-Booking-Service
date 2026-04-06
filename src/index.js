const { serverConfig,logger,Queue }  = require('./config');
const express = require('express');
const apiRoutes = require('./routes');
const CRON = require('./utils/common/cron-job');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api',apiRoutes);

app.listen(serverConfig.PORT, async()=>{
    console.log(`server is running on port ${serverConfig.PORT}`);
    CRON();
    // logger.info('logger is working');
    await Queue.connectQueue();
    console.log("rabbit passed");
})