console.log("Este es el index")

const form = document.getElementById("cookieForm")

form.addEventListener("submit", (e) => {
    e.preventDefault()

    const data = new FormData(form)

    const obj = {}
    data.forEach((value, key) => obj[key] = value)

    fetch("/api/session/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "authorization": "Baerer Lo" //lo mandamos en todas nuestras consultas
        },
        body: JSON.stringify(obj)

    })
    .then(respuesta => respuesta.json())
    .then(respuesta => console.log(respuesta))
    console.log(respuesta)
    localStorage.setItem("token")
})

const getCookie = () => {
    console.log(document.cookie)
}