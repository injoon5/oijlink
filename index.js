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

app.get('/:id', (req, res) => {
    res.redirect(db.get(req.params.id))
})

app.post('/api/new', async (req, res) => {
    try {
        db.get(req.body.custom)
    }
    catch (error) {
        db.add('id', 1)
        db.set(String(db.get('id')), req.body.url)
        console.log(`${String(db.get('id'))}: ${req.body.url}`)
        res.send(String(db.get('id')))
    }
    if (db.get(req.body.custom) == null) {
        db.set(req.body.custom, req.body.url)
        console.log(`${req.body.custom}: ${req.body.url}`)
        res.send(req.body.custom)
    } else {
        res.send('ERR')
    }
})

app.listen(port, () => console.log(`Listening on ${port}!`))