
const query = require('../db/db')
const { imgDir, secret, appId } = require('../server')
const qr = require('qr-image')
const request = require('request')
const fs = require('fs')

async function _getWxToken() {
    const wxUrl = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential' +
        '&appid=' + appId +
        '&secret=' + secret
    return new Promise(resolve => {
        request({
            method: 'GET',
            url: wxUrl
        }, (err, res, body) => {
            if (res) {
                try {

                    resolve({
                        err: false,
                        result: JSON.parse(body)
                    })
                } catch (error) {
                    resolve({
                        err: true,
                        result: null
                    })
                }
            }
        })
    })
}
async function _getWxQrImg(token, res, filePath) {
    const wxUrl = 'https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token=' + token
    return new Promise(resolve => {
        request.post({
            url: wxUrl,
            json: {
                path: 'pages/home/home',
                width: 100
            }
        }).pipe(fs.createWriteStream(filePath))
        resolve(filePath)


        // , (err, res, body) => {
        //     var base64Img = body.toString('base64');  // base64图片编码字符串
        //     var dataBuffer = new Buffer(body, 'base64');
        //     fs.writeFile(process.cwd() + '/uploads/qr/asdwd.png', dataBuffer, err => {
        //         console.log(err)
        //     })
        //     // res.setHeader('Content-type', 'image/png');
        //     // qrCode.pipe(res);
        //     if (res) {
        //         try {
        //             resolve({
        //                 err: false,
        //                 result: JSON.parse(body)
        //             })
        //         } catch (error) {
        //             resolve({
        //                 err: true,
        //                 result: null
        //             })
        //         }
        //     }
        // }
    })
}

const _fileExists = (filePath) => {
    return new Promise(resolve => {
        fs.exists(filePath, (exists) => {
            resolve(exists)
        })
    })
}

async function getQr(req, res) {
    // group_id:
    let { group_id } = req.body;
    let qrName = 'group_id_' + group_id + '.png';
    let filePath = process.cwd() + '/uploads/qr/' + qrName;

    let fileExists = await _fileExists(filePath);

    if (fileExists) {
        res.json({
            err: false,
            img: imgDir + 'qr/' + qrName
        })
        return
    } else {
        try {
            let tokenRes = await _getWxToken();
            if (tokenRes.err) throw tokenRes.err
            let token = tokenRes.result.access_token
            filePath = await _getWxQrImg(token, res, filePath)
            res.json({
                err: false,
                img: imgDir + 'qr/' + qrName
            })
            return
        } catch (error) {
            res.json({
                err: true,
                msg: error.toString()
            })
        }
    }



    // try {
    //     let params = req.body;
    //     let qr = await _selectQrFromScene(params.scene);
    //     if (qr.result.length > 1) {
    //         res.json({
    //             err: false,
    //             msg: null,
    //             data: qr.result[0]
    //         })
    //         return
    //     } else {
    //         let qr_
    //         query("INSERT INTO `qr` (`path`, `create_time`, `scene`)", [params.path, new Date(), params.scene], (err, result) => {
    //             res.json({ err: !!rr, msg: err, data: result[0] })
    //         })
    //     }
    // } catch (error) {
    //     res.json({
    //         err: true,
    //         msg: error.toString()
    //     })
    // }



    // let qrCode = qr.image('I love Qr', { type: 'png' });
    // res.setHeader('Content-type', 'image/png');
    // qrCode.pipe(res);
}

// const _selectQrFromScene = (scene) => {
//     return new Promise((resolve) => {
//         query("SELECT * FROM WHERE `scene`=?", [scene], (err, result) => {
//             resolve(
//                 { err, result }
//             )
//         })
//     })
// }


module.exports = {
    getQr
}