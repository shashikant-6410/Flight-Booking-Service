const cron = require('node-cron');
const {BookingService}= require('../../services')


function scheduleCron(){
    cron.schedule('*/30 * * * * ', async () => {   //runs every 30 min
    await BookingService.cancelOldBooking();
     
});

}

module.exports=scheduleCron;