
const query = require('../db/db')
async function getGoodsTitle(req, res) {
    let classList = await getClasses();
    const data = [];
    for (const classItem of classList) {
        let list = await _getGoodsFromClassId(classItem.id);
        data.push({
            classId: classItem.id,
            className: classItem.class_text,
            list
        })
    }
    res.end(JSON.stringify(data))
}



function _getGoodsFromClassId(classId) {
    return new Promise(resolve => {
        query('SELECT * FROM `goods` WHERE classid = ? LIMIT 5', [classId], (error, result) => {
            let data = result.map(val => {
                return {
                    title: val.title,
                    info: val.info,
                    latitude: val.latitude,
                    longitude: val.longitude,
                    classid: val.classid
                }
            })
            resolve(data)
        })
    })
}


getClasses = () => {
    return new Promise(resolve => {
        query('SELECT * FROM `classes`', (error, result) => {
            if (error) {
                resolve({
                    error: 1,
                    msg: error.message.toString()
                })
            } else {
                resolve(result)
            }
        })
    })
}



getGoodsAll = (req, res) => {
    query('SELECT * FROM `goods`', (error, result) => {
        res.end(JSON.stringify(result))
    })
}




module.exports = {
    getGoodsTitle,
    getGoodsAll
}