const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();

var connectionString = 'mongodb+srv://yoda:azerty12345@cluster0.obca0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

MongoClient.connect(connectionString).then(client => {

    console.log('Connected to Database')

    const db = client.db('star-wars-quotes')
    const quotesCollection = db.collection('quotes')

    app.set('view engine', 'ejs')

    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(express.static('public'))
    app.use(bodyParser.json())

    app.get('/', (req, resp) => {
        const cursor = db.collection('quotes').find().toArray()
            .then(results => {
                resp.render('index.ejs', { quotes: results })
            })
            .catch(error => console.error(error))
    })

    app.post('/quotes', (req, resp) => {
        quotesCollection.insertOne(req.body)
            .then(result => {
                resp.redirect('/')
            })
            .catch(error => console.error(error))
    })

    app.put('/quotes', (req, resp) => {
        quotesCollection.findOneAndUpdate(
            { name: 'Yoda' },
            {
                $set: {
                    name: req.body.name,
                    quote: req.body.quote
                }
            },
            {
                upsert: true
            }
        ).then(result => {
            resp.json('Success')
        }).catch(error => console.error(error))
    })

    app.delete('/quotes', (req, resp) => {
        quotesCollection.deleteOne(
            { name: req.body.name }
        )
            .then(result => {
                resp.json(`Deleted Darth Vadar's quote`)
            })
            .catch(error => console.error(error))
    })

    app.listen(3000, function () {
        console.log('listening on 3000')
    })

}).catch(error => console.error(error))
