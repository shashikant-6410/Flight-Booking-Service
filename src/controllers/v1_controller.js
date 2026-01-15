const {StatusCodes} = require('http-status-codes');

const info = (req,res)=>{
    return res
              .status(StatusCodes.ACCEPTED)
              .json({
                    "success":"true",
                    "message":"it's working",
                    "error":{},
                    "data":{}
              });
}

module.exports={
    info
}

