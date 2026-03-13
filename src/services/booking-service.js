const axios = require('axios');
const {BookingRepository}= require('../repositories');
const db = require('../models');
const {serverConfig}=require('../config');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');
const bookingRepo= new BookingRepository();
const {Enums}=require('../utils/common');
const {BOOKED,CANCELLED}= Enums.Booking_status;

async function createBooking(data) {
     const transaction = await db.sequelize.transaction();
    try {
           const flight = await axios.get(`${serverConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`);
           const flightData=flight.data.data;
           if(data.noOfSeats > flightData.totalSeats){
             throw new AppError("not enough seats available",StatusCodes.BAD_REQUEST);
           }

           const billingAmount = data.noOfSeats * flightData.price;
           const bookingPayload = {...data, totalCost:billingAmount};

           const booking = await bookingRepo.create(bookingPayload,transaction);

          await axios.patch(`${serverConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`,
            {
                seats:data.noOfSeats
            }
          )
           

           await transaction.commit();
           return booking;
        
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
    
}

async function makePayment(data) {
    const transaction = await db.sequelize.transaction();
    try {
        const bookingDetails = await bookingRepo.get(data.bookingId,transaction);
        if(bookingDetails.status == CANCELLED){
            throw new AppError("the booking has expired",StatusCodes.BAD_REQUEST);
        }
        const bookingTime = new Date(bookingDetails.createdAt);
        const currentTime = new Date();
        if(currentTime - bookingTime > 300000){
            // await bookingRepo.update({status:CANCELLED},data.bookingId,transaction);
            await cancelBooking(data.bookingId);
            throw new AppError('the booking has expired',StatusCodes.BAD_REQUEST)
        }
        if(bookingDetails.totalCost != data.totalCost){
            console.log(`${bookingDetails.totalCost} and ${data.totalCost}`);
            throw new AppError('the amount of payment doesnot match',StatusCodes.BAD_REQUEST)
        }
        if(bookingDetails.userID != data.userID){
            throw new AppError('the user corresponding to the booking doesnot match',StatusCodes.BAD_REQUEST);

        }
        //we assume here that payment is  successful
        await bookingRepo.update({status:BOOKED},data.bookingId,transaction);
        await transaction.commit();
        
    } catch (error) {
       await transaction.rollback();
        throw error;
    }
    
}  

async function cancelBooking(bookingId) {
    const transaction = await db.sequelize.transaction();
    try {
        const bookingDetails = await bookingRepo.get(bookingId,transaction);
        if(bookingDetails.status == CANCELLED){
            await transaction.commit();
            return true;
        }
        await axios.patch(`${serverConfig.FLIGHT_SERVICE}/api/v1/flights/${bookingDetails.flightId}/seats`,
            {
                seats:bookingDetails.noOfSeats,
                dec: 0
            });
        await bookingRepo.update({status:CANCELLED},bookingId,transaction);
        await transaction.commit();


    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

module.exports={
    createBooking,
    makePayment
}