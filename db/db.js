const mysql = require('mysql')

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'jin7422373',
    database: 'dymap'
})

const query = function () {
    let sql, params, callback;
    sql = arguments[0]
    switch (arguments.length) {
        case 2: {
            callback = arguments[1];
            params = null;
            break;
        }
        case 3: {
            callback = arguments[2];
            params = arguments[1];
            break;
        }
        default: {

            break;
        }
    }
    pool.getConnection(function (err, conn) {
        if (err) {
            callback(err, null, null);
        } else {
            conn.query(sql, params, function (err, res, fields) {
                callback(err, res, fields)
            })
            conn.release();
        }
    })
}


module.exports = query;