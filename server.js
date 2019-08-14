var express = require('express');
var app = express();
var fs = require("fs");

var bodyParser = require('body-parser');
var multer = require('multer');
const query = require('./db/db')
exports.serverUri = 'http://localhost:8081/'
exports.imgDir = 'http://localhost:8081/uploads/'
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
const api = require('./api/index')
const { insertGood, getGoodsFromId } = require('./api/goods')
const { insertRefer, getReferAll, updateRefer, deleRefer } = require('./api/refer')
const { uploadRich } = require('./api/rich')
const { getRichAll } = require('./api/rich')


const {deleImg} = require('./api/utils')
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
app.post('/updateRefer', uploadMiddleware, (req, res) => {
    updateRefer(req, res)
})


app.post('/insertGood', uploadMiddleware, (req, res) => {

    insertGood(req, res)

})
app.post('/insertRich', (req, res) => {
    uploadRich(req, res)
})


app.get('/index.html', function (req, res) {
    res.sendFile(__dirname + "/public/" + "index.html");
})
app.get('/detail.html', function (req, res) {
    res.sendFile(__dirname + "/public/" + "detail.html");
})
app.get('/refer.html', function (req, res) {
    res.sendFile(__dirname + "/public/" + "refer.html");
})
app.get('/rich.html', function (req, res) {
    res.sendFile(__dirname + "/public/" + "rich.html");
})

app.post('/deleRefer', (req, res) => {
    deleRefer(req, res)
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

var server = app.listen(8081, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("应用实例，访问地址为 http://%s:%s", host, port)

})



