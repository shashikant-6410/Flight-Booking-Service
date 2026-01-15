const { serverConfig,logger }  = require('./config');
const express = require('express');
const apiRoutes = require('./routes');

const app = express();

app.use('/api',apiRoutes);

app.listen(serverConfig.PORT, ()=>{
    console.log(`server is running on port ${serverConfig.PORT}`);
    // logger.info('logger is working');
})