const { StatusCodes } = require('http-status-codes');
const {logger}= require('../config');
const AppError = require('../utils/errors/app-error');

class CrudRepository {
    constructor(model){
        this.model = model;
    }

    async create(data){
            const response =await this.model.create(data);
            if(!response){
              throw new AppError('input response is missing in the incoming request',StatusCodes.BAD_REQUEST)
            }
            return response;
       
    }

    async destroy(data){
            const response =await this.model.destroy({

                where:{
                    id:data
                }
            });
            if(!response){
                throw new AppError('resource does not exist',StatusCodes.NOT_FOUND);
            }
            return response;
        
    }

    async get(id){
       
            const response =await this.model.findByPk(id);
            if(!response){
                throw new AppError("the requested resource does not exist",StatusCodes.NOT_FOUND);
            }
            return response;
        
       
    }

    async getAll(){
            const response =await this.model.findAll();
            return response;
        
    }

    async update(data,ID){ //data->{key, value....}
            const response =await this.model.update(data,{
                where:{
                    id:ID
                }
            });
            return response; 
       
    }
}

module.exports=CrudRepository;