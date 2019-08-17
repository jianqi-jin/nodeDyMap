const { imgDir } = require('../server')
const query = require('../db/db')
const { deleImg } = require('./utils')

function insertRefer(req, res) {
    let params = req.body;
    let thumb;
    if (req.files[0]) {
        thumb = req.files[0].filename;
    } else {
        thumb = ''
    }
    query("INSERT INTO `refer_goods` (`title`, `info`, `thumb`, `goodsid`) VALUES (?, ?, ?, ?)", [params.title, params.info, thumb, params.goodsid], (error, result) => {
        if (error) {
            res.json({
                err: 1,
                msg: error
            })
        } else {
            res.json({
                error: 0,
                data: result
            })
        }
    })
}

function getReferAll(req, res) {
    query('SELECT * FROM `refer_goods` LIMIT 0, 1000', (error, result) => {
        if (error) {
            res.json({
                err: 1,
                msg: error
            })
        } else {
            result = (result.map(val => (val.thumb = imgDir + val.thumb, val)))
            res.json({
                err: 0,
                data: result
            })
        }
    })
}

async function updateRefer(req, res) {
    let file;
    let params = req.body;
    let refer = await _getReferById(params.id);
    let queryStr = 'UPDATE '
    let queryParams = 'UPDATE '

    if (req.files && req.files.length > 0) {
        try{
        let deletRes = await deleImg(refer[0].thumb);
        }catch(e){
            console.log(e)
        }
        // if (deletRes) {
        //     res.json({
        //         err: 1,
        //         msg: deletRes
        //     })
        //     return
        // }
        file = req.files[0]
        queryStr = "UPDATE `refer_goods` SET `title`=?, `thumb`=?, `info`=?, `goodsid`=? WHERE (`id`=?)"
        queryParams = [params.title, file.filename, params.info, params.goodsid, params.id]
    } else {
        queryStr = "UPDATE `refer_goods` SET `title`=?, `info`=?, `goodsid`=? WHERE (`id`=?)"
        queryParams = [params.title, params.info, params.goodsid, params.id]
    }
    queryParams = queryParams.map(val => ((val && (val != 'null')) ? val : null))
    query(queryStr, queryParams, (err, result) => {
        res.json({
            err: !!err,
            msg: err,
            data: result
        })
    })

}


function _getReferById(referid) {
    return new Promise(resolve => {
        query('SELECT * FROM `refer_goods` WHERE `id` = ?', [referid], (err, res) => {
            resolve(res)
        })
    })
}

async function deleRefer(req, res) {
    let referRes = await _getReferById(req.body.id);
    deleImg(referRes.thumb);
    query("DELETE FROM `refer_goods` WHERE (`id`=?)", [req.body.id], (err, result) => {
        res.json({
            err: !!err,
            msg: err
        })
    })
}

module.exports = {
    insertRefer,
    getReferAll,
    updateRefer,
    deleRefer
}