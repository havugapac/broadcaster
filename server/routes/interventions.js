const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const {validate, Intervention} = require('../models/intervention');
const {User} = require('../models/user'); 
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const {validatestat, validateput} = require('../middlewares/validPuts');
const multipleUpload = require('../middlewares/files_upload');
const sgMail = require('@sendgrid/mail');


router.post('/', multipleUpload, async (req, res) =>{

    const {error} = validate(req.body);
    if(error) return res.status(401).send('Invalid userId or descriptions');

    // console.log(req.body);

    const user = await User.findById(req.body.userId);
    if(!user) return res.status(401).send('Tried to post with unknown user');

    let intervention = new Intervention({
     
        user:{
            _id:user._id,
            userName:user.userName,
            email:user.email,            
            
        },
        address:req.body.address,
        descr:req.body.descr,
        status: '',
        intImage: req.files.flagImage[0].path,
        intVideo: req.files.flagVideo[0].path
    });
    
    intervention = await intervention.save();
    res.send(intervention);


});

router.get('/', async (req, res) => {
    const interventions = await Intervention.find();

    if (!interventions) return res.status(404).send('No intervention found.');
  
    res.status(200).send({data: interventions});

});

router.put('/:id', auth, async (req, res) => {

    const poster = req.user._id;

    const {error} = validateput(req.body);
    if(error) return res.status(401).send(error.details[0].message);
    
    const interve = await Intervention.findById(req.params.id);

    if(!interve) return res.status(401).send('No intervention Found');

    if(poster == interve.user._id) 
    {
        const intervention = await Intervention.findByIdAndUpdate(req.params.id, {descr: req.body.descr}, {new: true});
        res.send(intervention);
    }    
    else{
       console.error('Anonymous poster...'); 
       res.status(401).send('Unauthorized user, The intervention is unable to be updated.');
    }

});


router.put('/status/:id', [auth, admin], async (req, res) => {

    const {error} = validatestat(req.body);
    if(error) return res.status(401).send(error.details[0].message);

    const interve = await Intervention.findById(req.params.id);

    if(!interve) return res.status(401).send('No intervention Found');

    const mail = interve.user.email;
    const address = interve.address;

    const intervention = await Intervention.findByIdAndUpdate(req.params.id, {status: req.body.status}, {new: true});
    res.send(intervention);

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

    const interve = await Intervention.findById(req.params.id);
    if (!interve) return res.status(401).send('The intervention with the given ID was not found.');
    
    
    if(poster == interve.user._id) 
    {
        const intervention = await Intervention.findByIdAndRemove(req.params.id);
        res.send(intervention);
    }    
    else{
       console.error('Anonymous poster...'); 
       res.status(401).send('Unauthorized user, The intervention is unable to be deleted.');
    }  
  
    
  });



module.exports = router; 