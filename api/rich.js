const query = require('../db/db')
const Towxml = require('towxml')
const towxml = new Towxml();

async function uploadRich(req, res) {
    let params = req.body;
    if (!params.goodsid) {
        res.json({ err: true, msg: '请填写正确的goodsid' })
        return
    }
    let node = params.rich_node//towxml.toJson(params.rich_node, 'html')
    let oldNode = await _getRichFromGoodsId(params.goodsid);
    if (oldNode) {
        _updateRich(req, res)
    } else {
        _uploadRich(req, res)
    }

}


async function _updateRich(req, res) {
    let params = req.body;
    query("UPDATE `richs` SET `rich_node`=? WHERE (`goodsid`=?)", [params.rich_node, params.goodsid], (err, result) => {
        res.json({
            err: !!err,
            msg: err,
            data: result
        })
    })
}

async function _uploadRich(req, res) {
    let params = req.body;
    query("INSERT INTO `richs` (`rich_node`, `goodsid`) VALUES (?, ?)", [params.rich_node, params.goodsid], (err, result) => {
        res.json({
            err: !!err,
            msg: err,
            data: result
        })
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


async function deleRich(req, res) {
    query("DELETE FROM `richs` WHERE (`id`= ?)", [req.body.id], (err, result) => {
        res.json({
            err: !!err,
            msg: err,
            data: result
        })
    })
}
module.exports = {
    uploadRich,
    _getRichFromGoodsId,
    getRichAll,
    deleRich
}