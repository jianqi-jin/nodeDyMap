const query = require('../db/db')
const Towxml = require('towxml')
const towxml = new Towxml();

const uploadRich = (req, res) => {
    let params = req.body;
    let node = params.rich_node//towxml.toJson(params.rich_node, 'html')
    query("INSERT INTO `richs` (`rich_node`, `goodsid`) VALUES (?, ?)", [node, params.goodsid], (err, result) => {
        if (err) {
            console.log(err)
            res.json({
                err: 1,
                msg: err.message.toString()
            })
        } else {
            res.json({
                err: 0,
                data: 'ok'
            })
        }
    })
}


const _getRichFromGoodsId = (goodsid) => {
    return new Promise(resolve => {
        query('SELECT * FROM `richs` WHERE `goodsid` = ?', [goodsid], (err, result) => {
            if (err) {
                resolve(null)
            } else {
                resolve(result[0] || null)
            }
        })
    })

}

const getRichAll = (req, res) => {
    query("SELECT * FROM `richs`", (err, result) => {
        if (err) {
            res.json({
                err: 1,
                msg: err.message.toString()
            })
        } else {
            res.json({
                err: 0,
                data: result
            })
        }
    })
}

module.exports = {
    uploadRich,
    _getRichFromGoodsId,
    getRichAll
}