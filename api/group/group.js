const query = require('../../db/db')
const { deleImg } = require('../utils')
const { imgDir } = require('../../server')
async function getGroup(req, res) {
    try {
        let { groupList } = await _selectGroupAll();
        res.json({
            err: false,
            msg: null,
            data: groupList
        })
    } catch (error) {
        res.json({
            err: !!error,
            msg: error.toString(),
            data: null
        })
    }
}

async function getGroupAll(req, res) {
    query('SELECT * FROM `group` LIMIT 0,50', (err, result) => {
        result = result.map(val => {
            val.avatar = imgDir + val.avatar
            val.banner_list = JSON.parse(val.banner_list)
            val.banner_list = val.banner_list.map(val => (
                imgDir + val
            ))
            return val
        })
        res.json({
            err: !!err,
            msg: err,
            data: result
        })
    })
}

async function getGroupFromId(req, res) {
    let { err, result } = await _selectGroup(req.body.groupId);
    result = result.map(val => (val.banner_list = val.banner_list.map(val => (imgDir + val)), val))
    res.json({
        err: !!err,
        msg: err,
        data: result[0]
    })
}

async function deleteGroup(req, res) {
    let params = req.query;
    try {
        let { err, result } = await _selectGroup(params.groupId);
        let groupInfo = result[0];
        let bannerList = JSON.parse(groupInfo.banner_list);
        try {
            for (const bannerItem of bannerList) {
                deleImg(bannerItem)
            }
        } catch (error) {
            console.log(error)
        }
        _deleteGroup(params.groupId)
    } catch (error) {
        res.json({
            err: !!error,
            msg: error.toString(),
            data: null
        })
    }
}

const _selectGroup = (groupId, havImgHeader = true) => {
    return new Promise(resolve => {
        query('SELECT * FROM `group` WHERE `id` = ?', [groupId], (err, result) => {
            if (havImgHeader) {
                result.map(val => {
                    val.avatar = imgDir + val.avatar
                    try {
                        val.banner_list = JSON.parse(val.banner_list)
                        val.banner_list.map(val => (
                            imgDir + val
                        ))
                    } catch (error) {
                        return val
                    }
                    return val
                })
            }
            resolve({ err, result })
        })
    })
}
const _selectGroupFromName = (groupName) => {
    return new Promise(resolve => {
        query('SELECT * FROM `group` WHERE `title` = ?', [groupName], (err, result) => {
            resolve(result[0] || {})
        })
    })
}

const _selectGroupAll = () => {
    return new Promise(resolve => {
        query('SELECT * FROM `group` LIMIT 0, 50', (err, result) => {
            result = result.map(val => {
                val.avatar = imgDir + val.avatar
                try {
                    val.banner_list = JSON.parse(val.banner_list)
                    val.banner_list.map(val => (
                        imgDir + val
                    ))
                } catch (error) {
                    return val
                }
                return val
            })
            resolve(result || [])
        })
    })
}
const _deleteGroup = (groupId) => {
    return new Promise(resolve => {
        query('DELETE FROM `group` WHERE `id` = ?', [groupId], (err, result) => {
            resolve(result || [])
        })
    })
}

async function addGroup(req, res) {
    let params = req.body;
    try {
        //查询是否已经存在
        let groupInfo = await _selectGroup(params.groupName);
        if (groupInfo.result.length > 0) {
            //已经存在
            res.json({
                err: true,
                msg: '社团名称已经存在'
            })
        } else {
            let insertRes = await _insertGroup(params);
            if (insertRes.err) {
                throw (insertRes.err)
            } else {
                res.json({
                    err: false,
                    msg: null,
                    data: insertRes.result
                })
            }
        }
    } catch (error) {
        res.json({
            err: true,
            msg: error.toString()
        })
    }
}

async function updateGroup(req, res) {
    let params = req.body;
    try {
        let groupInfo = await _selectGroup(params.id);
        if (!groupInfo.result || !groupInfo.result[0].id) {
            throw ('社团不存在');
        } else {
            // let bannerList = JSON.parse(groupInfo.banner_list);
            // for (const bannerItem of bannerList) {
            //     //判断并删除无用的图片
            // }
            // params.bannerList = JSON.stringify(bannerList);
            let { err, result } = await _updateGroup(params);
            res.json({
                err: !!err,
                msg: err,
                data: result
            })
        }
    } catch (error) {
        res.json({
            err: true,
            msg: error.toString()
        })
    }

}


const _updateGroup = (params) => {
    return new Promise(resolve => {
        query("UPDATE `group` SET `member_num`=?, `title`=?, `info`=?, `content`=? WHERE (`id`=?)", [params.member_num, params.title, params.info, params.content, params.id], (err, result) => {
            resolve({ err, result })
        })
    })
}

const _insertGroup = (params) => {
    let bannerList = [];
    return new Promise(resolve => {
        query("INSERT INTO `group` (`title`, `member_num`, `info`, `avatar`, `banner_list`) VALUES (?, ?, ?, ?, ?)",
            [params.title, params.memberNum, params.info, params.avatar, JSON.stringify(bannerList)], (err, result) => {
                resolve({ err: err, result })
            })
    })
}

async function updateGroupBanner(req, res) {
    let params = req.body;
    console.log(params)
    let bannerNew = req.files[0].filename;
    try {
        let groupInfo = await _selectGroup(params.id, false);
        if (groupInfo.result[0] && groupInfo.result[0].id) {
            let bannerList = (JSON.parse(groupInfo.result[0].banner_list));
            if (bannerList.length <= params.index)//添加
            {
                bannerList.push(bannerNew);
            } else {
                let bannerOld = bannerList[params.index];//旧的banner
                bannerList[params.index] = bannerNew;//新的banner 
                let delRes = await deleImg(bannerOld);//删除旧的banner
                console.log('删除')
                console.log(delRes)
                if (delRes) {
                    console.log(delRes)//删除错误
                }
            }
            let bannerListStr = JSON.stringify(bannerList);
            query("UPDATE `group` SET `banner_list` = ? WHERE (`id` = ?)", [bannerListStr, params.id], (err, result) => {
                res.json({
                    err: !!err,
                    msg: err,
                    data: imgDir + bannerNew //将新的banner传给前台
                })
            })

        } else {
            throw '社团不存在'
        }
    } catch (error) {
        console.log(error)
        res.json({
            err: true,
            msg: error.toString()
        })
    }

}


async function updateGroupAvatar(req, res) {
    let params = req.body;
    let avatarNew = req.files[0].filename;
    try {
        let groupInfo = await _selectGroup(params.groupId, false);
        if (groupInfo.result && groupInfo.result[0].id) {
            let avatar = groupInfo.result[0].avatar;
            if (avatar) {
                try {
                    let delRes = await deleImg(avatar);
                } catch (error) {
                    console.log('删除图片失败', error)
                }
            }
            query("UPDATE `group` SET `avatar`=? WHERE (`id`=?)", [avatarNew, params.groupId], (err, result) => {
                res.json({
                    err: !!err,
                    msg: err,
                    data: imgDir + avatarNew
                })
            })
        }
    } catch (error) {
        res.json({
            err: true,
            msg: error.toString()
        })
    }

}
async function delGroup(req, res) {
    let { groupId } = req.query;
    let { err, result } = await _selectGroup(groupId, false);
    try {
        let groupInfo = result[0];
        if (!groupInfo)
            throw '没有找到此社团'
        let { banner_list, avatar } = groupInfo;
        for (const item of JSON.parse(banner_list)) {
            await deleImg(item)
        }
        await deleImg(avatar)
        query("DELETE FROM `group` WHERE `id`=?", [groupId], (err, result) => {

            res.json({
                err: !!err,
                msg: err,
                data: result
            })
        })
    } catch (e) {
        console.log(e)
        res.json({
            err: true,
            msg: err.toString()
        })
    }
}
async function delGroupBanner(req, res) {
    let { id, index } = req.query;
    try {
        let { err, result } = await _selectGroup(id);
        let groupInfo = result[0];
        if (!groupInfo)
            throw '没有找到此社团'
        let { banner_list } = groupInfo;
        let delRes = await deleImg(banner_list[index]);
        let bannerList = [];
        for (const key in banner_list) {
            if (key == index) { } else {
                bannerList.push(banner_list[key])
            }
        }
        banner_list = JSON.stringify(bannerList);
        query("UPDATE `group` SET `banner_list`=? WHERE (`id`=?)", [banner_list, id], (err, result) => {
            res.json({
                err: !!err,
                msg: err,
                data: result
            })
        })
    } catch (e) {
        console.log(e)
        res.json({
            err: true,
            msg: e.toString()
        })
    }
}


const _selectGroupApplyFromUser = (user) => {
    return new Promise(resolve => {
        query('SELECT * FROM `group_apply` WHERE `user`=?', [user], (err, result) => {
            resolve({ err, result })
        })
    })
}

async function aplyGroup(req, res) {
    let params = req.body;
    try {
        let selectRes = await _selectGroupApplyFromUser(params.user);
        if(selectRes.err){
            throw 'SQL ERROR: '+selectRes.err.toString()
        }else{
            query("INSERT INTO `group_apply` (`user`, `name`, `sex`, `phone`, `department`, `special`, `group_id`) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [params.user,params.name,params.sex,params.phone,params.deparment,params.special,params.group_id],(err, result) => {
                res.json({
                    err: !!err,
                    msg: err,
                    data: result
                })
            })
        }     
    } catch (error) {
        res.json({
            err: true,
            msg: error.toString()
        })
    }
   
}

module.exports = {
    getGroup,
    getGroupAll,
    deleteGroup,
    updateGroup,
    addGroup,
    getGroupFromId,
    updateGroupAvatar,
    updateGroupBanner,
    delGroup,
    delGroupBanner,
    aplyGroup,
}