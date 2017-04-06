const express = require('express')
const app = express()
const path = require('path')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.set('port', process.env.PORT || 1500)
app.use(express.static(path.join(__dirname, 'public')))

// -- index page
app.get('/', (req, res) => {
  res.render('index')
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
