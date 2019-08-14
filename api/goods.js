
const { serverUri } = require('../server')
const query = require('../db/db')
const { imgDir } = require('../server')
const { _getRichFromGoodsId } = require('./rich')
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
async function getGoodsFromId(req, res) {
    let goodsid = req.body.goodsid;
    let goodsInfo = await _getGoods(goodsid);
    if (goodsInfo) {
        goodsInfo.banner_list = JSON.parse(goodsInfo.banner_list);
        goodsInfo.banner_list = goodsInfo.banner_list.map(val => (imgDir + val));
        let referList = await _getReferList(goodsInfo.id);
        referList = referList.map(val => (val.thumb = imgDir + val.thumb, val))
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
                resolve(result || null)
            }
        })
    })

}

module.exports = {
    insertGood,
    getGoodsFromId
};