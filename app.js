const express = require('express')
const app = express()
const path = require('path')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.set('port', process.env.PORT || 8080)
app.use(express.static(path.join(__dirname, 'public')))

// -- index page
app.get('/', (req, res) => {
  res.render('index')
})
app.get('/content', (req, res) => {
  res.render('content')
})
app.get('/content2', (req, res) => {
  res.render('content2')
})
app.get('/producten', (req, res) => {
  res.render('producten')
})
app.get('/product-pagina', (req, res) => {
  res.render('product-pagina')
})
app.get('/recept-pagina', (req, res) => {
  res.render('recept-pagina')
})
app.get('/recepten', (req, res) => {
  res.render('recepten')
})
app.get('/test', (req, res) => {
  res.render('test')
})
//handle 404
app.use( (req, res, next) => {
  res.status(400)
  res.send('404')
})

app.use( (req, res, next) => {
  res.status(500)
})

app.listen(app.get('port'), () => {
  console.log('Listening on port: ', app.get('port'))
})
