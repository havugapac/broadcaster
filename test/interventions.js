const chai = require('chai');
const chaiHttp = require('chai-http');
const {describe, it} = require('mocha');
// const should = require('should');
let app = require('../server/index');

//assertion style
chai.should();
chai.use(chaiHttp);


describe('interventions API', () =>{

    //test Get route
   describe('GET api/interventions', () =>{
       it('It should turn all interventions', (done) =>{
     chai.request(app)
     .get('/api/interventions')
     .end((err, response) =>{
       console.log("response", response);
       res.should.have.status(200)        
      // should(response).have.status(200);
      // should(response.body).be.a('array');
      //response.body.length.should.be.eq(3);
        done();
     });

   });
});  

});