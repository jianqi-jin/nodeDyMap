
const { serverUri } = require('../server')
const query = require('../db/db')
const { imgDir } = require('../server')
const { _getRichFromGoodsId } = require('./rich')
const { deleImg } = require('./utils')
const insertGood = (req, res) => {
    let files = req.files;
    let bannerArr = files.map(val => (val.filename));//serverUri + 'uploads/' +
    let banner = JSON.stringify(bannerArr);
    let params = req.body;
    query("INSERT INTO `goods` (`title`, `info`, `classid`, `refer_list`, `banner_list`, `richid`, `latitude`, `longitude`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [params.title, params.info, params.classid, params.refer_list, banner, params.richid, params.latitude, params.longitude],
        (error, result, fields) => {
            if (error) {
                res.end(JSON.stringify(error.message))
            } else {
                res.end('OK')
            }

        })
}
async function deleGoods(req, res) {
    query("DELETE FROM `goods` WHERE (`id`= ?)",[req.body.goodsid], (err, result) => {
        res.json({
            err: !!err,
            msg: err,
            data: result
        })
    })
}
async function getGoodsFromId(req, res) {
    let goodsid = req.body.goodsid;
    let goodsInfo = await _getGoods(goodsid);
    if (goodsInfo) {
        goodsInfo.banner_list = JSON.parse(goodsInfo.banner_list);
        goodsInfo.banner_list = goodsInfo.banner_list.map(val => (imgDir + val));
        let referList = await _getReferList(goodsInfo.id);
        goodsInfo.referList = referList;
        let rich = await _getRichFromGoodsId(goodsInfo.id);
        goodsInfo.rich = rich
        res.json({
            err: 0,
            data: goodsInfo
        })
    } else {
        res.json({
            err: 0,
            data: {}
        })
    }
}


const _getGoods = (goodsid) => {
    return new Promise(resolve => {
        query('SELECT * FROM `goods` WHERE id = ?', [goodsid], (error, result) => {
            if (error) {
                resolve(null)
                res.json({
                    err: 1,
                    msg: error.message.toString()
                })
            } else {
                resolve(result[0] || null)
            }
        })
    })
}

const _getReferList = (goodsid) => {
    return new Promise(resolve => {
        query('SELECT * FROM `refer_goods` WHERE goodsid = ?', [goodsid], (error, result) => {
            if (error) {
                resolve(null)
            } else {
                result = result.map(val => (val.thumb = imgDir + val.thumb, val))

                resolve(result || null)
            }
        })
    })
}


async function updateGoods(req, res) {
    console.log(req.body)
    let params = req.body;
    let files = req.files;
    console.log(req.files)
    let goodsInfo = await _getGoods(params.id)
    let oldImgs = JSON.parse(goodsInfo.banner_list)

    let imgchangelist = JSON.parse(params.imgchangelist)
    const fileIndex = 0
    for (const index in imgchangelist) {
        if (imgchangelist[index]) {
            await deleImg(oldImgs[index])
            oldImgs[index] = files[fileIndex]
            fileIndex += 1;
        }
    }
    let banner_list = JSON.stringify(oldImgs)
    query("UPDATE `goods` SET `title`=?, `info`=?, `classid`=?, `banner_list`=?, `latitude`=?, `longitude`=? WHERE (`id`=?)",
        [params.title, params.info, params.classid, banner_list, params.latitude, params.longitude, params.id], (err, result) => {

            res.json({
                err: !!err,
                msg: err,
                data: result
            })
        })


}

module.exports = {
    insertGood,
    getGoodsFromId,
    _getReferList,
    updateGoods,
    deleGoods
};