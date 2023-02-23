const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'CloudAssignment1',
    password: 'Kabir@123'
});

module.exports = pool.promise();