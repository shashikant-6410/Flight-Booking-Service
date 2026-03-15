const CrudRepository = require('./crud-repository');

const {Booking} =require('../models');
const { Op } = require('sequelize');
const {Enums}=require('../utils/common');
const {BOOKED,CANCELLED}= Enums.Booking_status;

class BookingRepository extends CrudRepository{
    constructor(){
        super(Booking);
    }

    //any other querey other than CRUD can be written here
    async  createBooking(data,transaction) {
     const response = await Booking.create(data,{transaction:transaction});
        return response;
    }


    async get(id,transaction){
       
            const response =await Booking.findByPk(id,{transaction:transaction});
            if(!response){
                throw new AppError("the requested resource does not exist",StatusCodes.NOT_FOUND);
            }
            return response;
        
       
    }

    async update(data,ID,transaction){ //data->{key, value....}
            const response =await Booking.update(data,{
                where:{
                    id:ID
                }
            },{transaction:transaction});
            return response; 
       
    }

    async cancelOldBooking(timeStamp) {
       const response = await Booking.update({status:CANCELLED},{
        where:{
            [Op.and]:[
                {
                    createdAt:{
                        [Op.lt]:timeStamp
                    }
                },
                {
                    status:{
                        [Op.ne]:BOOKED
                    }
                },
                {
                    status:{
                        [Op.ne]:CANCELLED
                    }
                }
            ]
        }
       })
        return response;
    }
}



module.exports=BookingRepository;