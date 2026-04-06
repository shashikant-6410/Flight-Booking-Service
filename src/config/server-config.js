const dotenv = require('dotenv');

dotenv.config();

module.exports={
    PORT: process.env.PORT || 5000,
    FLIGHT_SERVICE: process.env.FLIGHT_SERVICE,
    QUEUE:process.env.QUEUE,
    API_GATEWAY:process.env.API_GATEWAY
}