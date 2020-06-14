const express = require('express')
const db = require('quick.db')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.static('public'))

app.set('views', './views')
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/admin', (req, res) => {
  let id = [], data = []
  for (let i in db.all()) {
    id.push(db.all()[i].ID)
    data.push(String(db.all()[i].data).replace(/"/gi, ''))
  }
  id.shift()
  data.shift()

  res.render('admin', { id, data })
  return
})

app.get('/:id', (req, res) => {
  res.redirect(db.get(req.params.id))
})

app.post('/api/new', async (req, res) => {
  try {
    db.get(req.body.custom)
  } catch (error) {
    db.add('id', 1)
    db.set(String(db.get('id')), req.body.url)
    console.log(`${String(db.get('id'))}: ${req.body.url}`)
    res.send(String(db.get('id')))
  }
  if (typeof req.body.custom != 'undefined') {
    if (!db.has(req.body.custom)) {
      db.set(req.body.custom, req.body.url)
      console.log(`${req.body.custom}: ${req.body.url}`)
      res.send(req.body.custom)
    } else {
      res.send('ERR')
    }
  }
})

app.post('/api/delete', (req, res) => {
  for (let i in db.all()) {
    if (db.all()[i].ID == req.body.target) {
      db.delete(req.body.target)
      return
    }
  }
})

app.listen(port, () => console.log(`Listening on ${port}!`))
