

const {imgDir} = require('../server')

const query = require('../db/db')




 const searchGoodsByKey = (req, res) => {
    let params = req.body;
    query("SELECT * FROM `goods` WHERE `title` LIKE ? LIMIT 0, 20", ['%' + params.keywords + '%'], (err, result) => {
        result = result.map(val => (val.banner_list = JSON.parse(val.banner_list).map(val => (imgDir+val)), val))
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