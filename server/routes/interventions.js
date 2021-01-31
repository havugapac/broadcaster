const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const {validate, Intervention} = require('../models/intervention');
const {User} = require('../models/user'); 
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const {validatestat, validateput} = require('../middlewares/validPuts');

router.post('/', async (req, res) =>{

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
        status: ''
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

    const address = interve.address;

    const intervention = await Intervention.findByIdAndUpdate(req.params.id, {status: req.body.status}, {new: true});
    res.send(intervention);
    

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