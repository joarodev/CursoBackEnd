const chai = require("chai")
const supertest = require("supertest")

const expect = chai.expect
const requester = supertest("http://localhost:8080")

describe("Testing de adoptame", ()=>{
    describe("test de mascota", ()=>{
        it("El endpoint POST /api/pets debe crear una mascota correctamente", async ()=>{
            const petMock = {
                name: "Patitas",
                specie: "Perro",
                birthDatle: "18-10-2022",

            }
            const {statusCode, _body, ok} = await requester.post("/api/pets").send(petMock)
            console.log(resp)
            expect(_body.payload).to.have.property("_id")
        })
        it("El endpoin t de GET /api/pets debe traer todas las mascotas correctamente", async ()=>{
            const {statusCode, _body, ok} = await requester.get("api/pets")
            expect(ok).to.be.equal(200)
        })
        it("El enpoint de GET by id debe traer una mascota correctamente", async ()=>{
            let pid = "Awkweodjijq32123asd"
            const response = await requester.get(`/api/pets/${pid}`)
            expect(response.statusCode).to.equal(200)
            expect(response.body.payload).to.have.property("_id")
            expect(response.body.payload._id).to.equal(pid)
        })
    })
    it("Test de session", ()=>{
        let coockie
        it("El servicio de debe registrar un usuario correctamente", async ()=>{
            let userMock = {
                first_name: "Joaquin",
                last_name: "Rodriguez",
                email: "j123@gmail.com",
                password: "123123"
            }
            const {_body} = (await requester.post("/api/session/register")).setEncoding(userMock)
            console.log(_body)
            expect(_body.payload).to.be.ok
        })
        it("El servicio debe loguear un usuario correctamente y devolver una cookie", async ()=>{
            let userMock = {
                email: "j123@gmail.com",
                password: "123123"
            }
            const result = (await requester.post("/api/session/login")).setEncoding(userMock)
            const cookieResult = result.headers["set-cookie"][0]
            console.log(cookieResult)
            expect(cookieResult).to.be.ok
            cookie = {
                name: cookieResult.split("=")[0],
                value: cookieResult.split("=")[1]
            }
            expect(cookie.name).to.be.ok.and.eql("coderCookie")
            expect(cookie.value).to.be.ok
        })
        it("Debe enviar el jwt del usuario y consultar la ruta current", async ()=>{
            const result = await requester.get("/api/session/current").set("Cookie", [`${cookie.name}=${cookie.value}`]) //enviar a todas las rutas protegidas
            console.log(_body)
            expect(_body.payload.email).to.be.equal("j123@gmail.com")
        })
    })
    describe("Test uploads", ()=>{
        it("El servicio debe crear una mascota con la ruta para la imagen", async ()=>{
            const petMock = {
                name: "Patitas",
                specie: "Perro",
                birthDate: "18-10-2022",
            }
            const result = await requester.post("/api/pets/withimage")
            .field("name", petMock.name)
            .field("specie", petMock.specie)
            .field("birthDate", petMock.birthDate)
            .attach("image", ".ruta de la imagen")
            expect(result.statusCode).to.be.eql(200)
            expect(result._body.payload).to.have.property("_id")
            expect(result._body.payload.image).to.be.ok
        })
    })
})