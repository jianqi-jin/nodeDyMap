const query = require('../db/db')
const _getAllClass = () => (

    new Promise(resolve => {
        query('SELECT * FROM `classes`', (err, result) => {
            resolve({
                err: !!err,
                msg: err,
                data: result
            })
        })
    })
)

module.exports = {
    _getAllClass
}