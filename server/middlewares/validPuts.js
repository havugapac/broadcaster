const Joi = require('joi');

function validatestat(flagi){
    const schema={
    status: Joi.string().required()
    };

    return Joi.validate(flagi, schema); 
}

function validateput(flag){
    const schema={
    descr: Joi.string().required().min(10),
    address: Joi.string().required()
    };

    return Joi.validate(flag, schema); 
}

exports.validatestat = validatestat;
exports.validateput = validateput;