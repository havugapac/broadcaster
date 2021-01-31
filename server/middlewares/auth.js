require('dotenv').config();
const jwt = require('jsonwebtoken');
//const config = require('config');

module.exports = function(req, res, next){

    const token = req.header('x-auth-token');

    if(!token) return res.status(401).send('Access denied, no token provided');

    try{
    const decoded = jwt.verify(token, process.env.jwtPrivateKey);
    req.user=decoded;
    next()
    }
    catch(e)
    {
   res.status(401).send('Invalid token please');
    }
}