const {secret} =  require('../server')
const {appId} = require('../server')
const WXBizDataCrypt = require('../WXBizDataCrypt')
const query  =require('../db/db')
const axios = require('axios')
async function auth (req, res) {
    try{
        let {encryptedData} = req.body;
        let {iv} = req.body;
        let {sessionKey} = req.body;
        const pc = new WXBizDataCrypt(appId, sessionKey);
        const data = pc.decryptData(encryptedData, iv);
        const userExistRes = await _userExist(data.openId);
        if(userExistRes){
            res.json({
                err: false,
                msg: '用户已经存在'
            })
            return
        }
        query("INSERT INTO `user` (`openid`, `nick_name`, `gender`, `language`, `city`, `province`, `country`, `avatar_url`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [data.openId, data.nickName, data.gender, data.language, data.city, data.province, data.country, data.avatarUrl], (err, result) => {
            
            res.json({
                err: !!err,
                msg: err,
                data: result
            })
        })  
    }catch(e){
        res.json({
            err: true,
            msg: e.toString()
        })
    }
}

const _userExist = (openid) => {
    return new Promise(resolve => {
        query('SELECT * FROM `user` WHERE `openid` = ?', [openid], (err, result) => {
            try{
                resolve((err||result.length>0)?true:false)
            }catch(e){
                console.log(e)
                resolve(true)
            }
        })

    })

}

const getUserInfo = (req, res) => {
    query('SELECT * FROM `user` WHERE `openid` = ?', [req.query.openid], (err, result) => {
        res.json({
            err: !!err,
            msg: err,
            data: result[0]||{}
        })
    })
}

const getOpenId = (req, res) => {
    axios.get('https://api.weixin.qq.com/sns/jscode2session?appid='+appId+'&secret='+secret+'&js_code='+req.body.code+'&grant_type=authorization_code').then(result => {
        res.json(result.data)
    })
}

module.exports = {
    auth,
    getOpenId,
    getUserInfo
}