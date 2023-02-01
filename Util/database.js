const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'CloudAssignment1',
    password: '17227860'
});

module.exports = pool.promise();