
const query = require('../db/db')
getGoodsTitle = (req, res) => {
    query('SELECT * FROM `goods`', (error, result) => {
        res.end(JSON.stringify(result))
    })
}


getGoodsAll = (req, res) => {
    query('SELECT * FROM `goods`', (error, result) => {
        res.end(JSON.stringify(result))
    })
}


module.exports = {
    getGoodsTitle,
    getGoodsAll
}