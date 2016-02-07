/*
 * Module dependencies
 */
var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')
  , morgan = require('morgan')
  , multer = require('multer')
  , fs = require('fs')
  , Liner = require('./liner')

var upload = multer({ dest: 'uploads/'})

var app = express()
var liner

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(morgan('dev'))
app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
))
app.use(express.static(__dirname + '/public'))
app.use('/uploads/', express.static(__dirname + '/uploads'))
app.get('/', function (req, res) {
  res.render('index',
  { title : 'Home' }
  )
})
app.get('/upload', function(req, res){
  res.render('upload', 
    { title : 'Upload' }
    )
})
app.post('/file-upload', upload.single('file'), function(req, res, next){
  liner = new Liner()
  fs.createReadStream(req.file.path).pipe(liner)
  res.sendStatus(204).end()
})
app.get('/key', function(req, res){
  res.send(liner.read())
})
app.listen(9090)