const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const users = require('./routes/users');
const auth = require('./routes/auth');

const app = express();

mongoose.connect('mongodb://localhost/broadcaster')

.then(() => console.log('connected to mongoDB...'))
.catch(err => console.error('Could not connect to mongoDB...'));

app.use(express.json());
app.use('/api/users', users);
app.use('/api/auth', auth);

if(!config.get('jwtPrivateKey')){
    console.error('FATAL ERROR: jwtPrivateKey is not defined');
    process.exit(1);
}



const port = config.get('port') || 3000;
app.listen(port, () => console.log(`Listening on port ${port} ...`))