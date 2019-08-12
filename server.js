var express = require('express');
var app = express();
var fs = require("fs");

var bodyParser = require('body-parser');
var multer = require('multer');
const query = require('./db/db')
const api = require('./api/index')
exports.serverUri = 'http://localhost:8081/'
const { insertGood } = require('./api/goods/insert')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '.' + file.originalname.split('.')[1])
    }
})
const fileFilter = (req, file, cb) => {
    if (file.originalname.split('.')[1] == 'bmp' || file.originalname.split('.')[1] == 'jpg' || file.originalname.split('.')[1] == 'png') {
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

app.get('/getGoodsTitle', (req, res) => {
    api.getGoodsTitle(req, res)
})
app.get('/getGoodsAll', (req, res) => {
    api.getGoodsAll(req, res)
})




app.post('/insertGood', uploadMiddleware, (req, res) => {

    insertGood(req, res)

})


app.use('/public', express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: '/tmp/' }).array('image'));

app.get('/index.html', function (req, res) {
    res.sendFile(__dirname + "/" + "index.html");
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