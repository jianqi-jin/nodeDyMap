
const { serverUri } = require('../../server')
const query = require('../../db/db')
const insertGood = (req, res) => {
    let files = req.files;
    let bannerArr = files.map(val => (serverUri + 'uploads/' + val.filename));
    let banner = JSON.stringify(bannerArr);
    let params = req.body;
    query("INSERT INTO `goods` (`title`, `info`, `classid`, `referid`, `banner`, `richid`, `latitude`, `longitude`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [params.title, params.info, params.classid, params.referid, banner, params.richid, params.latitude, params.longitude],
        (error, result, fields) => {
            if (error) {
                res.end(JSON.stringify(error.message))
            } else {
                res.end('OK')
            }

        })
}

module.exports = {
    insertGood
};