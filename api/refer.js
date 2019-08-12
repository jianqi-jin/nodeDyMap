const query = require('../db/db')

function insertRefer(req, res) {
    let params = req.body;
    console.log(req.files)
    let thumb;
    if (req.files[0]) {
        thumb = req.files[0].filename;
    } else {
        thumb = ''
    }
    query("INSERT INTO `refer_goods` (`title`, `info`, `thumb`, `goodsid`) VALUES (?, ?, ?, ?)", [params.title, params.info, thumb, params.goodsid], (error, result) => {
        if (error) {
            res.json({
                error: 1,
                msg: error.message.toString()
            })
        }
        res.json({
            error: 0,
            data: result
        })
    })
}

function getReferAll(req, res) {
    query('SELECT * FROM `refer_goods` LIMIT 0, 1000', (error, result) => {
        if (error) {
            res.json({
                error: 1,
                msg: error.message.toString()
            })
        } else {
            res.json({
                error: 0,
                data: result
            })
        }
    })
}

module.exports = {
    insertRefer,
    getReferAll
}