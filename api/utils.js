// fileName是不带路径的 xxx.png
const { uploadsDir } = require('../server')
const fs = require('fs')
const deleImg = (fileName) => {
    return new Promise(resolve => {
        fs.unlink(uploadsDir + fileName, (res) => {
            resolve(res)
        })
    })
}



module.exports = {
    deleImg
}