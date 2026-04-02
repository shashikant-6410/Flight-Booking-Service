const {StatusCodes} = require('http-status-codes');

const {BookingService} = require('../services');
const {SuccessResponse,ErrorResponse}=require('../utils/common');
const { message } = require('../utils/common/success-response');

let inMemDb = {};

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
        return res
                  .status(StatusCodes.BAD_REQUEST)
                  .json(ErrorResponse)
    }
}

async function makePayment(req,res){
    try {
        const idempotencyKey = req.headers['x-idempotency-key'];
        if(!idempotencyKey){
            return res
                  .status(StatusCodes.BAD_REQUEST)
                  .json({message:'idempotency key is missing'});
        }
        if(inMemDb[idempotencyKey]){
            return res
                  .status(StatusCodes.BAD_REQUEST)
                  .json({message:'cannot retry on successfull payment '});
        }
        inMemDb[idempotencyKey]=idempotencyKey;
        const booking = await BookingService.makePayment({
            bookingId:req.body.bookingId,
            userID:req.body.userID,
            totalCost:req.body.totalCost
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
    createBooking,
    makePayment
}