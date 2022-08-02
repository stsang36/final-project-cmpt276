const chai = require('chai')
const chaiHttp = require('chai-http')
const dotenv = require('dotenv')
const server = require('../../server')
const getAdminToken = require('./adminToken')
dotenv.config({path: '../../.env'})


chai.should();
chai.use(chaiHttp)

let settings = null;

const getConfigCheck = (done) => {
    
    getAdminToken().then( (adminToken) => {
    
        chai.request(server)
            .get('/api/config')
            .set('Authorization',`Bearer ${adminToken}`)
            .end((error,res)=>{
                if(error)
                {
                    console.log(error)
                    done();
                }
                res.should.have.status(200);
                res.should.be.json;

                settings = res.body;
                
                done();
            })
    })
}

const updateAppConfigCheck = (done) => {
    getAdminToken().then( (adminToken) => {
        if (!adminToken) {
            throw new Error('Admin token not found')
        }

        chai.request(server)
            .put('/api/config')
            .set('Authorization',`Bearer ${adminToken}`)
            .send(settings)
            .end((error,res)=>{
                if(error)
                {
                    console.log(error)
                    done();
                }
                res.should.have.status(200);
                res.should.be.json;
                done();
            })
    })
}

module.exports = {
    getConfigCheck,
    updateAppConfigCheck
}
