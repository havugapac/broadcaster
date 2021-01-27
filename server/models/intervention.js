const Joi = require('joi');
const mongoose = require('mongoose');
const geocoder = require('../utils/geocoder');

const interSchema = new mongoose.Schema({
    user: {type: new mongoose.Schema({
        userName:{type: String, required:true, minlength: 5, maxlength: 255},
        email:{type: String, required:true, minlength: 5, maxlength: 255}

    }), required: true},

    address: {
         type: String,
         required: true
    },

    location:{
       type:{type: String,
       enum:['Point']
    },
    coordinates: {
        type: [Number],
        index: '2dsphere'
    },
    formattedAdress: String
    },

    descr:{type: String, minlength:10, required:true},
    status:{type: String},
    createdOn:{type: Date, required:true, default: Date.now}
    
});


//geocode and create location
interSchema.pre('save', async function(next){
    const loc = await geocoder.geocode(this.address);
    
    this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAdress: loc[0].formattedAddress,
    }

    this.address = undefined;
    next();
});

const Intervention = mongoose.model('Intervention', interSchema);


function validateInt(flag){
    const schema={
    userId: Joi.string().required(),
    descr: Joi.string().required().min(10),
    address: Joi.string().required()
    };

    return Joi.validate(flag, schema);
    
}

exports.validate = validateInt;
exports.Intervention = Intervention;