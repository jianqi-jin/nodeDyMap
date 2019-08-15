var express = require('express');
var app = express();
var fs = require("fs");
var path = require('path')
var bodyParser = require('body-parser');
var multer = require('multer');
const query = require('./db/db')
// exports.serverUri = 'https://localhost:8081/'
exports.serverUri = 'https://nepu.fun:8081/'
// exports.imgDir = 'https://localhost:8081/uploads/'
exports.imgDir = 'https://nepu.fun:8081/uploads/'
exports.uploadsDir = './uploads/'
app.use('/public', express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.bodyParser());
app.use(bodyParser.json());
// app.use(multer({ dest: '/tmp/' }).array('image'));
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '.' + file.originalname.split('.')[1])
    }
})
const fileFilter = (req, file, cb) => {
    if (file.originalname.split('.')[1] == 'bmp' || file.originalname.split('.')[1] == 'jpg' || file.originalname.split('.')[1] == 'png' || file.originalname.split('.')[1] == 'jpeg') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}
const upload = multer({ storage, fileFilter }).array('image');
const uploadMiddleware = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            res.end('error')
        } else {
            next()
        }
    })
}
const https = require('https')

const api = require('./api/index')
const { insertGood, getGoodsFromId, _getReferList, updateGoods, deleGoods } = require('./api/goods')
const { insertRefer, getReferAll, updateRefer, deleRefer } = require('./api/refer')
const { uploadRich } = require('./api/rich')
const { getRichAll, _getRichFromGoodsId, deleRich } = require('./api/rich')
const { _getAllClass } = require('./api/class')

const { deleImg } = require('./api/utils')
app.get('/insert', (req, res) => {
    query("INSERT INTO `user` (id, name, psw) VALUES (null, '靳建奇', '52Alsdkfj')", function (error, results, fields) {
        if (!error) {
            console.log('insert : OK');
        } else {
            console.log(error)
        }
        res.end('OK')
    })

})
app.post('/deleGoods', (req, res) => {
    deleGoods(req, res)
})

app.post('/insertRefer', uploadMiddleware, (req, res) => {
    insertRefer(req, res)
})
app.get('/getReferAll', (req, res) => {
    getReferAll(req, res)
})


app.get('/getGoodsTitle', (req, res) => {
    api.getGoodsTitle(req, res)
})
app.get('/getGoodsAll', (req, res) => {
    api.getGoodsAll(req, res)
})


app.post('/getGoods', (req, res) => {
    getGoodsFromId(req, res)
})
app.get('/getRichAll', (req, res) => {
    getRichAll(req, res)
})
app.get('/getRich', (req, res) => {
    _getRichFromGoodsId(req.query.goodsid).then(result => {
        res.json({
            err: false,
            data: result
        })
    })
})


app.post('/insertGood', uploadMiddleware, (req, res) => {
    insertGood(req, res)
})

app.post('/updateGoods', uploadMiddleware, (req, res) => {
    updateGoods(req, res)
})
app.post('/insertRich', (req, res) => {
    uploadRich(req, res)
})
app.get('/getAllClass', (req, res) => {
    _getAllClass().then(result => {
        res.json(result)
    })
})

app.post('/updateRefer', uploadMiddleware, (req, res) => {
    updateRefer(req, res)
})

app.get('/index.html', function (req, res) {
    res.sendFile(__dirname + "/public/" + "index.htm");
})
app.get('/detail.html', function (req, res) {
    res.sendFile(__dirname + "/public/" + "detail.htm");
})
app.get('/refer.html', function (req, res) {
    res.sendFile(__dirname + "/public/" + "refer.htm");
})
app.get('/rich.html', function (req, res) {
    res.sendFile(__dirname + "/public/" + "rich.htm");
})
app.post('/deleRich', (req, res) => {
    deleRich(req, res)
})
app.post('/deleRefer', (req, res) => {
    deleRefer(req, res)
})
app.post('/updateRich', (req, res) => {
    updateRich(req, res)
})

app.post('/getReferFromGoodsid', (req, res) => {
    _getReferList(req.body.goodsid).then(result => {
        res.json({
            err: 0,
            data: result
        })
    })
})
// app.post('/file_upload', function (req, res) {

//     console.log(req.files[0]);  // 上传的文件信息

//     var des_file = __dirname + "/" + req.files[0].originalname;
//     fs.readFile(req.files[0].path, function (err, data) {
//         fs.writeFile(des_file, data, function (err) {
//             if (err) {
//                 console.log(err);
//             } else {
//                 response = {
//                     message: 'File uploaded successfully',
//                     filename: req.files[0].originalname
//                 };
//             }
//             console.log(response);
//             res.end(JSON.stringify(response));
//         });
//     });
// })

var privateKey = fs.readFileSync(path.join(__dirname, './certificate/2262666_www.nepu.fun.key'), 'utf8');
var certificate = fs.readFileSync(path.join(__dirname, './certificate/2262666_www.nepu.fun.pem'), 'utf8');

var credentials = { key: privateKey, cert: certificate };

const server = https.createServer(credentials, app);

server.listen(8081, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("应用实例，访问地址为 https://%s:%s", host, port)

})



