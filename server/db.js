const Pool = require('pg').Pool

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'aleks',
    password: 'postgres',
    port: 5432
})

module.exports = pool;