




const query = require('../db/db')




 const searchGoodsByKey = (req, res) => {
    let params = req.body;
    query("SELECT * FROM `goods` WHERE `title` LIKE '%米%' LIMIT 0, 20", ['%' + params.keywords + '%'], (err, result) => {
        res.json({
            err: !!err,
            msg: err,
            data: result
        })
    })

}


module.exports = {
    searchGoodsByKey
}