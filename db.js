//import pg from 'pg'
const { Pool } = require('pg')

// creamos nuestro pool de conexiones
const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'cursos',
    password: '1234',
    max: 20,
    min: 2,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
})

// insertar un nuevo curso
async function insertarcurso (nombre, nivelTecnico, fechaInicio, duracion) {
    const client = await pool.connect()
    
    // consulta con string parametrizado
    const res = await client.query(
        `insert into cursos (nombre, nivel, fecha, duracion) values ($1, $2, $3, $4)`,
        [nombre, nivelTecnico, fechaInicio, duracion]
    ) 

    client.release()
}

// Editar un usuario
async function editarcurso (nombre, nivel, fecha, duracion ) {
    const client = await pool.connect()
    // consulta con  parámetros 
    const res = await client.query({
        text: "update cursos set  nivel=$2, fecha=$3 , duracion=$4 where nombre=$1",
        values: [nombre, nivel, fecha, duracion]
    })

    client.release()
    return res
}

// consulta todos los usuarios
async function consultacursos() {
    const curso = await pool.connect()
    const res = await curso.query(
        "select nombre, nivel, to_char(fecha,'DD/MM/YYYY') as fecha , duracion from cursos"
    )
    curso.release()
    return res.rows
}

// Elimina un usuario
async function eliminarcurso(id) {
    const client = await pool.connect()

    const res = await client.query(
        "delete from cursos where id=$1",
        [id]
    )
    client.release();
}    


module.exports = { insertarcurso,  consultacursos, eliminarcurso, editarcurso}
