const {Client} = require('pg')

const client = new Client({
    host: "192.168.0.11",
    user: "postgres",
    port: 5432,
    password: "root",
    database: "BrainAgriculture"
})

module.exports = client;

