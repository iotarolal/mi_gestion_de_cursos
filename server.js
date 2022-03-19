const express = require('express')
const nunjucks = require('nunjucks')
const pg = require('pg')
const { insertarcurso,  consultacursos, eliminarcurso, editarcurso }= require('./db.js')


const app = express()

//  carpetas  estáticas
app.use(express.static('static'))


// configuramos el motor de templates (nunjucks)
nunjucks.configure('templates', {
    express: app,
    autoescape: true,
    watch: true
})


// 1. Crear una ruta POST /curso que reciba un payload desde el cliente con los datos de
// un nuevo curso y los ingrese a la tabla cursos.

app.post('/curso', async (req, res) => {
    let body = ""

    req.on("data", (data) => {
        body += data
    })

    req.on("end", async () => {
        //  desempaquetamos la respuesta
        const datos = Object.values(JSON.parse(body));
        try {
            // llamamos a la función insertar
            console.log(datos)
            const retorna = await insertarcurso(datos[0], datos[1], datos[2], datos[3])  // {nombre, nivelTecnico, fechaInicio, duracion}
        } catch(error) {
            return res.status(400).send(error)
        }
        res.status(201)
        res.send()
    })
})


// 2. Crear una ruta GET /cursos que consulte y devuelva los registros almacenados en la
// tabla cursos.

app.get('/cursos', async (req, res) => {
    const retornocursos = await consultacursos()
    console.log(retornocursos)
    res.send(JSON.stringify(retornocursos))
});


// 3. Crear una ruta PUT /curso que reciba un payload desde el cliente con los datos de un
// curso ya existente y actualice su registro en la tabla cursos.

app.put('/curso', async (req, res) => {
    let body = ""

    req.on("data", (data) => {
        body += data
    })

    req.on("end", async () => {
        //  desempaquetamos
        const datos = Object.values(JSON.parse(body));
        // llamamos a la función editarusuario
        const cursoeditado = await editarcurso(datos[0], datos[1], datos[2], datos[3])
        res.send(cursoeditado)
    })
})



// 4. Crear una ruta DELETE /cursos que reciba el id de un curso como parámetro de la
// ruta y elimine el registro relacionado en la tabla cursos.


app.delete('/curso/:id', async (req, res) => {
    console.log(req.params.id)
    try {
        await eliminarcurso(req.params.id);
        res.send('curso eliminado')
    } catch (error) {
        res.send('curso no eliminado' + error)
    }
});




app.get('/', (req, res) => {
    res.render('index.html')
});


app.get('*', (req, res) => {
    res.send('Esta ruta no existe')
});


app.listen(3000, () => console.log('Servidor en puerto 3000'))
