const Joi = require('joi');
const bcrypt = require('bcrypt');
const {User} = require('../models/user');
const express = require('express');

const router = express.Router();

router.post('/', async (req, res) =>{
    const {error} = validate(req.body);
    
    if(error) return res.status(401).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});

    if(!user) return res.status(401).send('Invalid email or password');

    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if(!validPassword) return res.status(401).send('Invalid email or password');

    const token = user.generateAuthToken();
    
    res.send(token);


});

function validate(user){
    schema = {
        email: Joi.string().min(5).max(200).required().email(),
        password: Joi.string().min(5).max(200).required()
    }

    return Joi.validate(user, schema);
}

module.exports = router;

