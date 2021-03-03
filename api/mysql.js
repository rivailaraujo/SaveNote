/*eslint no-undef: 0*/
const mysql = require('mysql2');
const Promisse = require("es6-promise");

var pool = mysql.createPool({
    "connectionLimit": 1000,
    "user": process.env.MYSQL_USER,
    "password": process.env.MYSQL_PASSWORD,
    "database": process.env.MYSQL_DATABASE,
    "host": process.env.MYSQL_HOST,
    "port": process.env.MYSQL_PORT
});

exports.execute = (query, params = []) => {
        //console.log(query)
    return new Promisse((resolve, reject) => {
        pool.query(query, params, (error, result, fiels) => {
            if (error) {
                reject(error);
            } else {

                resolve(result);
            }
        })
                    
    });
}

exports.pool = pool;               