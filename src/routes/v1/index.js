const express = require('express');

const {info_controller} = require('../../controllers');
const bookingRoutes = require('./booking-route')


const router = express.Router();

router.get('/info',info_controller.info);

router.use('/bookings',bookingRoutes )

module.exports=router;