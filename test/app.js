var express = require('express')
var path = require('path')
var app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jsx')
app.engine('jsx', require('express-react-views').createEngine({
  beautify: true
}))

app.use('/static', express.static('public'))

app.get('/', function (req, res) {
    res.render('index')
})

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
})