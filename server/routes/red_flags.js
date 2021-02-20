const Joi = require('joi');
require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const {validate, RedFlag} = require('../models/red_flag');
const {User} = require('../models/user');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const {validateput, validatestat} = require('../middlewares/validPuts');
const multipleUpload = require('../middlewares/files_upload');
const sgMail = require('@sendgrid/mail');


router.post('/', multipleUpload, async (req, res) =>{

    console.log(req.files.flagImage[0].path);

    const {error} = validate(req.body);
    if(error) return res.status(401).send('Invalid userId or descriptions');

    console.log(req.body);

    const user = await User.findById(req.body.userId);
    if(!user) return res.status(401).send('Tried to post with unknown user');

    let redFlag = new RedFlag({
     
        user:{
            _id:user._id,
            userName:user.userName,
            email:user.email,            
            
        },
        address:req.body.address,        
        descr:req.body.descr,
        status: "",
        flagImage: req.files.flagImage[0].path,
        flagVideo: req.files.flagVideo[0].path
    });
    
    redFlag = await redFlag.save();
    res.send(redFlag);

});

router.get('/', async (req, res) => {
    const redFlags = await RedFlag.find();

    if (!redFlags) return res.status(404).send('No red flag found.');
  
    res.send(redFlags);

});

router.put('/:id', auth, async (req, res) => {

    const poster = req.user._id;

    const {error} = validateput(req.body);
    if(error) return res.status(401).send(error.details[0].message);
    
    const flag = await RedFlag.findById(req.params.id);

    if(!flag) return res.status(401).send('No flag Found');

    if(poster == flag.user._id) 
    {
        const redFlag = await RedFlag.findByIdAndUpdate(req.params.id, {descr: req.body.descr}, {new: true});
        res.send(redFlag);
    }    
    else{
       console.error('Anonymous poster...'); 
       res.status(401).send('Unauthorized user, The red flag is unable to be updated.');
    }

});

router.put('/status/:id', [auth, admin], async (req, res) => {

    const {error} = validatestat(req.body);
    if(error) return res.status(401).send(error.details[0].message);

    const flag = await RedFlag.findById(req.params.id);

    if(!flag) return res.status(401).send('No red flag Found');

    const mail = flag.user.email;

    const address = flag.address;

    const redFlag = await RedFlag.findByIdAndUpdate(req.params.id, {status: req.body.status}, {new: true});
    res.send(redFlag);


    //email sender
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
   to: `${mail}`, // list of receivers
   from: `${process.env.email}`, //sender address
   subject: "Eyo Wsup✔", // Subject line
   text: "your redflag status has been modified plz", // plain text body
   html: "<b>Holla holaa?</b>", // html body
};
sgMail.send(msg)
.then((response) => console.log('Email sent'))
.catch((error) => console.log('the send grid error', error));
 

});

router.delete('/:id', auth, async (req, res) => {

    const poster = req.user._id;

    const flag = await RedFlag.findById(req.params.id);
    if(!flag) return res.status(401).send('The red flag with the given ID was not found.');

    if(poster == flag.user._id)
    {
        const redFlag = await RedFlag.findByIdAndRemove(req.params.id);
        res.send(redFlag);
    }
    else{
        return res.status(401).send('Unauthorized user, The red flag unable to be deleted.');
    }  
    
  });



module.exports = router;
