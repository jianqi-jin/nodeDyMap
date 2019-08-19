const query = require('../../db/db')
const {deleteImg} = require('../utils') 
async function getGroup (req, res) {
    try {
        let groupList = await _selectGroupAll();
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

async function deleteGroup(req, res){
    let params = req.query;
    try {
        let groupInfo = await _selectGroup(params.groupId);
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

const _selectGroup = (groupId) => {
    return new Promise(resolve => {
        query('SELECT * FROM `group` WHERE `id` = ?', [groupId], (err, result) => {
            resolve(result[0]||{})
        })  
    })
}
const _selectGroupFromName = (groupName) => {
    return new Promise(resolve => {
        query('SELECT * FROM `group` WHERE `title` = ?', [groupName], (err, result) => {
            resolve(result[0]||{})
        })  
    })
}

const _selectGroupAll = () => {
    return new Promise(resolve => {
        query('SELECT * FROM `group` LIMIT 0, 50', (err, result) => {
            resolve(result||[])
        })  
    })
}
const _deleteGroup = (groupId) => {
    return new Promise(resolve => {
        query('DELETE FROM `group` WHERE `id` = ?', [groupId], (err, result) => {
            resolve(result||[])
        })  
    })
}

async function addGroup(req, res){
    let params = req.body;
    try {
        //查询是否已经存在
        let groupInfo = await _selectGroup(params.groupName);
        if(groupInfo.length > 0){
            //已经存在
            res.json({
                err: true,
                msg: '社团名称已经存在'
            })
        }else{
            let insertRes = await _insertGroup(params);
            if(insertRes){
                throw (insertRes)
            }else{
                res.json({
                    err: false,
                    msg: null,
                    data: null
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

async function updateGroup(req, res){
    let params = req.body;
    try {
        let groupInfo = await _selectGroup(groupId);
        if(!groupInfo||!groupInfo.id){
            throw ('社团不存在');
        }else{
            let bannerList = JSON.parse(groupInfo.banner_list);
            for (const bannerItem of bannerList) {
                //判断并删除无用的图片
            }
            params.bannerList = JSON.stringify(bannerList);

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
        query("UPDATE `group` SET `avatar`=?, `member_num`=?, `info`=?, `banner_list`=? WHERE (`id`=?)",[params.avatar, params.memberNum, params.info, params.bannerList, params.id],(err, result) => {
            resolve(err)
        })
    })
}

const _insertGroup = (params) => {
    let bannerList = [];
    return new Promise(resolve => {
        query("INSERT INTO `group` (`title`, `member_num`, `info`, `avatar`, `banner_list`) VALUES (?, ?, ?, ?, ?)", 
        [params.title, params.memberNum, params.info, params.avatar, JSON.stringify(bannerList)], (err, result) => {
            resolve(err)
        })
    })
}

async function updateGroupAvatar(req, res){
    let params = req.query;
    let avatarNew = req.files[0].filename;
    console.log(params, avatarNew)
    try {    
        let groupInfo = await _selectGroup(params.groupId);
        if(groupInfo&&groupInfo.id){
            let avatar = groupInfo.avatar;
            if(avatar){
                try {
                    deleImg(avatar);
                } catch (error) {
                    console.log('删除图片失败')
                }
            }
            query("UPDATE `group` SET `avatar`=? WHERE (`id`=?)",[avatarNew, params.groupId], (err, result) => {
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
    deleteGroup,
    updateGroup,
    addGroup,
    updateGroupAvatar
}