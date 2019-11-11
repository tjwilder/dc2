const path = require('path')
const express = require('express')
const exphbs = require('express-handlebars')
const fs = require('fs')

const app = express()

app.engine('.hbs', exphbs({
defaultLayout: 'main',
extname: '.hbs',
layoutsDir: path.join(__dirname, 'views/layouts')
}))
app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (request, response) => {
  response.render('index', {})
})

app.get('/wordCloud.js', (request, response) => {
  response.type('.js')
  fs.readFile('./wordCloud.js',
    {encoding: 'utf-8'},
    (err, data) => {
      if (!err) {
        response.send(data)
      }
      else {
        console.err(err)
      }
    })
})

// Get the raw music.json file for 5-core
app.get('/data/music.json', (request, response) => {
  response.type('.json')
  fs.readFile('./data/music_5.json',
    {encoding: 'utf-8'},
    (err, data) => {
      if (!err) {
        response.send(data)
      }
      else {
        console.err(err)
      }
    })
})

app.listen(3000)
