const Joi = require('joi');
const mongoose = require('mongoose');
const geocoder = require('../utils/geocoder');

const redFlagSchema = new mongoose.Schema({
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
    status:{type:String},
    flagImage: {type:String, required:true},
    flagVideo: {type:String, required:true},
    createdOn:{type: Date, required:true, default: Date.now}
    
});


//geocode and create location
redFlagSchema.pre('save', async function(next){
    const loc = await geocoder.geocode(this.address);
    
    this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAdress: loc[0].formattedAddress,
    }
    

    //do not save the address
    this.address = undefined;
    next();
});

const RedFlag = mongoose.model('RedFlag', redFlagSchema);


function validateRed(flag){
    const schema={
    userId: Joi.string().required(),
    descr: Joi.string().required().min(10),
    address: Joi.string().required()
    };

    return Joi.validate(flag, schema);
    
}

exports.validate = validateRed;
exports.RedFlag = RedFlag;