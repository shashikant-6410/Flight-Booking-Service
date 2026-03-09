const CrudRepository = require('./crud-repository');

const {Booking} =require('../models');

class BookingRepository extends CrudRepository{
    constructor(){
        super(Booking);
    }

    //any other querey other than CRUD can be written here
    async  createBooking(params) {
     const response = await Booking.create(data,{transaction:transaction});
        return response;
    }


}

module.exports=BookingRepository;