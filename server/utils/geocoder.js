const config = require("config");
const NodeGeocoder = require('node-geocoder');

const options = {
  provider: config.get('GEOCODER_PROVIDER'),
  apiKey: config.get('GEOCODER_API_KEY'), 
  formatter: null 
};

const geocoder = NodeGeocoder(options);

module.exports= geocoder;