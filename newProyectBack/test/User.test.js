// dao de Usuarios realizar los test
// mongoose
const mongoose = require('mongoose')
const UserDao = require('../src/dao/Users.dao.js')
const Assert = require('assert')
const { updateOne } = require('../src/dao/models/User.js')

mongoose.connect('mongodb://localhost:27017/c39750a')

const assert = Assert.strict

describe('Testing de User Dao', ()=>{
    before(function(){
        this.userDao = new UserDao()
    })
    beforeEach(function(){3.
        // mongoose.connection.collections.users.drop()
        this.timeout(5000)
    })
    it('El dao debe traer un usuario correctamente de la DB', async function(){
        const result = await this.userDao.get()
        console.log(result)
        assert.strictEqual(Array.isArray(result), true)
    })
    it('El dao debe crear un usuario correctamente de la DB', async function(){
        let userMock = {
            first_name: 'Fede',
            last_name: 'Osandón',
            email: 'o@gmail.com',
            password: '123456'
        }

        const result = await this.userDao.save(userMock)

        const user = await this.userDao.getBy({email: result.email})
        console.log(user)
        assert.strictEqual(typeof user, 'object')
    })
    // it('El dao debe modificar un usuario correctamente de la DB', async function(){
    //     const _id = '64c84b536350da590c05da8b'
    //     let userUpdate = {
    //         first_name: 'Federico'
    //     }
    //     const result = await this.userDao.update(_id, userUpdate)
    //     const user = await this.userDao.getBy({_id})
    //     assert.strictEqual(user.first_name, userUpdate.first_name)
    // })
    // it('El dao debe eliminar un usuario correctamente de la DB', async function(){
    //     const _id = '64c84b536350da590c05da8b'
    //     const result = await this.userDao.delete({_id})
    //     assert.strictEqual(typeof result, 'object')
    // })


})
