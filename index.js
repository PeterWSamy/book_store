const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
//const { body, validationResult } = require('express-validator')
const personsD = require('mongoose')
const cors= require('cors')
app.use(express.json())
app.use(cors())
app.use(express.static('stylec'))

personsD.connect('mongodb://localhost/personsdb', { useNewUrlParser: true, useUnifiedTopology: true })
const personsdb = personsD.connection

personsdb.on('error', (err) => { console.log(err) })

personsdb.on('open', () => {
    console.log('person db is running')
    console.log('person and books dbs are running')
    app.listen(3200)
})


const booksSchema = new personsD.Schema({
    name: String,
    author: String,
    url: String,
    noOfBooks: Number
})
const book1 = personsD.model('book1', booksSchema)

const personsSchema = new personsD.Schema({
    fullName: String,
    email: String,
    password: String,
    isadmin: Boolean
})
const person = personsD.model('person', personsSchema)
let Message=''
const custom = function(req,res,next){
    console.log('middle ware')
    next()
}
app.post('/addPerson',function (req, res) {
    let n = req.body.Name, p = req.body.Password, e = req.body.Email,is=req.body.Isadmin;
    //console.log(n,p,e,is)
    
    let newPerson = new person({
        fullName: n,
        email: e,
        password: p,
        isadmin: is
    })
    newPerson.save(function (result, err) {
        if (err) {
            console.log(err)
        }
        //res.redirect('/')
        res.json({mess:'done'})
    })
})
app.post('/addBook', function (req, res) {
    let n = req.body.Name, a = req.body.Author, u = req.body.Url
    let newBook = new book1({
        name: n,
        author: a,
        url: u,
        noOfBooks: 10
    })
    newBook.save(function (result, err) {
        if (err) {
            console.log('error happened')
        }
        //res.redirect('/')
        res.json({mess:'done'})
    })
})
app.get('/getBook', function (req, res) {
    book1.find(function(err,books){
        if(err){
            console.log(err)
        }
        res.send(books)
    })
})
app.get('/getPerson', function (req, res) {
    person.find(function(err,persons){
        if(err){
            console.log(err)
        }
        res.send(persons)
    })
})