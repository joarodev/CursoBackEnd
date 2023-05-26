const fs = require('fs')


class FileManager {
    constructor(archivo) {
        this.archivo = archivo
    }

    writeFile = async (archivo) => {
        try {
            await fs.promises.writeFile(
                this.path, JSON.stringify(data, null, 2)
                )
            }catch(error) {
            console.log(error);
            }
    }
    readFile = async (archivo) => {
        try {
            const data = await fs.promises.readFile(this.archivo);
            return JSON.parse(data);
        } catch (error) {
            console.log(`Error al leer el archivo ${error.message}`);
        }
    }
}

module.export = FileManager