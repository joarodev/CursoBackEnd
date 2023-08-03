const mongoose = require('mongoose')
const User = require('../src/dao/Users.dao.js')
const chai = require('chai')

mongoose.connect('mongodb://localhost:27017/c39750a')
const expect = chai.expect

describe('Set de test User en cahi', ()=> {
    before(function () {
        this.userDao = new User()
    })
    beforeEach(function(){
        // mongoose.connection.collections.users.drop()
        this.timeout(2000)
    })
    // it('El dao debe poder obtener todos los usuario en un arreglo', async function(){
    //     const result = await this.userDao.get({})
    //     console.log(result)
    //     expect(result).to.be.deep.equal([])
    //     expect(result).deep.equal([])
    //     expect(Array.isArray(result)).to.be.ok
    //     expect(Array.isArray(result)).to.be.equals(true)
    // })
    // it('El dao debe modificar un usuario correctamente de la DB', async function(){
    //     const _id = '64c8522fe35f013bded41ffb'
    //     // const createUser = await this.userDao.save
    //     let userUpdate = {
    //         first_name: 'Federico'
    //     }
    //     const result = await this.userDao.update(_id, userUpdate)
    //     const user = await this.userDao.getBy({_id})
    //     expect(user).to.have.property('first_name', 'Federico')
    // })
    it('El dao debe eliminar un usuario correctamente de la DB', async function(){
        let userMock = {
            first_name: 'Fede1',
            last_name: 'Osandón1',
            email: 'o1@gmail.com',
            password: '123456'
        }

        const result = await this.userDao.save(userMock)
        const resultDelete= await this.userDao.delete({_id: result._id})
        console.log(resultDelete)
        expect(resultDelete).to.be.an('object')
        expect(resultDelete).to.have.property('_id')
        expect(resultDelete._id.toString()).to.equal(result._id.toString());
       
    })
})
