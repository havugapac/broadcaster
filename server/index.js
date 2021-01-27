const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const users = require('./routes/users');
const auth = require('./routes/auth');
const redFlags = require('./routes/red_flags');
const interventions = require('./routes/interventions');
const path = require('path');

const app = express();

mongoose.connect('mongodb://localhost/broadcaster', {useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true})

.then(() => console.log('connected to mongoDB...'))
.catch(err => console.error('Could not connect to mongoDB...'));


//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/redFlags', redFlags);
app.use('/api/interventions', interventions);




if(!config.get('jwtPrivateKey')){
    console.error('FATAL ERROR: jwtPrivateKey is not defined');
    process.exit(1);
}



const port = config.get('port') || 3000;
app.listen(port, () => console.log(`Listening on port ${port} ...`))