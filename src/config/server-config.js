const dotenv = require('dotenv');

dotenv.config();

module.exports={
    PORT: process.env.PORT || 5000,
    FLIGHT_SERVICE: process.env.FLIGHT_SERVICE
}