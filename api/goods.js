
const { serverUri } = require('../server')
const query = require('../db/db')
const insertGood = (req, res) => {
    let files = req.files;
    let bannerArr = files.map(val => (serverUri + 'uploads/' + val.filename));
    let banner = JSON.stringify(bannerArr);
    let params = req.body;
    query("INSERT INTO `goods` (`title`, `info`, `classid`, `refer_list`, `banner_list`, `richid`, `latitude`, `longitude`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [params.title, params.info, params.classid, params.referid, banner, params.richid, params.latitude, params.longitude],
        (error, result, fields) => {
            if (error) {
                res.end(JSON.stringify(error.message))
            } else {
                res.end('OK')
            }

        })
}
async function getGoodsFromId(req, res) {
    let goodsid = req.query.goodsid;
    query('SELECT * FROM `goods` WHERE id = ?', [goodsid], (error, result) => {
        if (error) {
            res.json({
                err: 1,
                msg: error.message.toString()
            })
        } else {
            let goodsInfo = {};
            if (result.length > 0) {
                goodsInfo = result[0];
                _getReferList(goodsInfo.id).then(result => {
                    let referList = result;
                    goodsInfo.referList = referList
                    res.json({
                        err: 0,
                        data: goodsInfo
                    })
                });
            } else {
                res.json({
                    err: 0,
                    data: goodsInfo
                })
            }
        }
    })
}

const _getReferList = (goodsid) => {
    return new Promise(resolve => {
        query('SELECT * FROM `refer_goods` WHERE id = ?', [goodsid], (error, result) => {
            if (error) {
                resolve(null)
            } else {
                resolve(result)
            }
        })
    })

}

module.exports = {
    insertGood,
    getGoodsFromId
};