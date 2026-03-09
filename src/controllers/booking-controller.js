const {StatusCodes} = require('http-status-codes');

const {BookingService} = require('../services');
const {SuccessResponse,ErrorResponse}=require('../utils/common');


async function createBooking(req,res){
    try {
        
        const booking = await BookingService.createBooking({
            flightId:req.body.flightId,
            userID:req.body.userID,
            noOfSeats:req.body.noOfSeats
        })
        SuccessResponse.data = booking;
        return res
                  .status(StatusCodes.CREATED)
                  .json(SuccessResponse)

    } catch (error) {
        ErrorResponse.error = error;
        console.log(error);
        return res
                  .status(StatusCodes.BAD_REQUEST)
                  .json(ErrorResponse)
    }
}


module.exports={
    createBooking
}