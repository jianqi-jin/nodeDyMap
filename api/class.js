const query = require('../db/db')
const _getAllClass = () => (

    new Promise(resolve => {
        query('SELECT * FROM `classes`', (err, result) => {
            resolve({
                err: !!err,
                msg: err,
                data: result
            })
        })
    })
)

const _getClass = (classId) => {
    return new Promise(resolve => {
        query('SELECT * FROM `classes` WHERE `id` = ?', [classId],(err, result) => {
            resolve (err || !result ? null : result[0])
        })
    })
}

async function updateClass(req, res) {
    let params = req.body;
    if(!params.classid){
        res.json(await _addClass( params.classname))
        return 
    }
    let classInfo = await _getClass(params.classid);
    if(classInfo){
        //修改
        res.json(await _updateClass(params.classid, params.classname))
    }else{
        //新增
        res.json(await _addClass( params.classname))

    }
}

const _addClass = (className)  => {
    return new Promise(resolve => {
        query("INSERT INTO `classes` (`class_text`) VALUES (?)", [className], (err, result) => {
            resolve({
                err: !!err,
                msg: err,
                data: result
            })
        })
    })
} 

const _updateClass = (classId, className)  => {
    return new Promise(resolve => {
        query("UPDATE `classes` SET `class_text`=? WHERE (`id`= ?)", [className, classId], (err, result) => {
            resolve({
                err: !!err,
                msg: err,
                data: result
            })
        })
    })
} 

module.exports = {
    _getAllClass,
    updateClass
}