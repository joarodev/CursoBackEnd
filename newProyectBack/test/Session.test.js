const chai = require('chai')
const supertest = require('supertest')

const expect = chai.expect
const requester = supertest('http://localhost:8080')


describe("Testing de session", ()=>{
    let cookie
    it('El servicio debe registrar un usuario correctamente en la plataforma', async ()=>{
        let userMock = {
            username: "JOATEST4",
            first_name: 'Joa Test4',
            last_name: 'Rod test4',
            email: 'joaTest4@gmail.com',
            age: 22,
            password: '12345678'
        }
        const {_body} = await requester.post('/api/session/register').send(userMock)
        console.log(_body)
        expect(_body.payload).to.be.ok
        //res.status(200).send({ status: "SUCCESS" }) -> en el register
        //consol log de res y buscar el body
    })
    /* it('El servicio debe loguear un usuario correctamente y devolver la cookie', async ()=>{
        let userMock = {
            email: 'joaTest3@gmail.com',
            password: '12345678'
        }

        const result = await requester.post('/api/session/login').send(userMock)
        const cookieResult = result.headers['set-cookie'][0]
        console.log("Test login, Cookie: ---",cookieResult)
        expect(cookieResult).to.be.ok
        cookie = {
            name: cookieResult.split('=')[0],
            value: cookieResult.split('=')[1]
        }

        expect(cookie.name).to.be.ok.and.eql('coderCookieToken')
        expect(cookie.value).to.be.ok
    })
    it("Test ruta current", async ()=>{
        const {_body} = await requester.get("/api/session/current").set("Cookie", [`${cookie.name}=${cookie.value}`])
        console.log("El body del current devuelve: ---",_body)
        expect(_body.payload.username).to.be.equal('joaTest3@gmail.com')
    })
    it('Test logout user', async () => {

        const response = await requester.get('/api/session/logout').set('Cookie', [`${cookie.name}=${cookie.value}`]);
        expect(response.status).to.equal(200);
        expect(response.text).to.include('user logout');
        //Verificamos
        // Intentamos acceder a la ruta de current para verificar si realmente estamos deslogueados
        const currentResponse = await requester.get('/api/session/current')

        // Verificamos que se haya borrado la cookie y no estemos logueados
        expect(currentResponse.status).to.equal(401); // 401 Unauthorized

        // También puedes verificar que la cookie se haya eliminado del encabezado de la respuesta
        expect(currentResponse.headers['set-cookie']).to.be.undefined;
    }); */
})