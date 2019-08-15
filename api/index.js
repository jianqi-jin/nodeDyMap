const { imgDir } = require('../server')
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
    res.json(data)
}



function _getGoodsFromClassId(classId) {
    return new Promise(resolve => {
        query('SELECT * FROM `goods` WHERE classid = ? LIMIT 5', [classId], (error, result) => {
            let data = result.map(val => {
                return {
                    id: val.id,
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
        try {
            result = result.map((val => (val.banner_list = JSON.parse(val.banner_list).map((val => (
                imgDir + val
            ))), val)
            ))

        } catch (e) {
            console.log(e)
            res.json({ err: 1 })
        }
        res.json({ err: 0, data: result })
    })
}




module.exports = {
    getGoodsTitle,
    getGoodsAll
}