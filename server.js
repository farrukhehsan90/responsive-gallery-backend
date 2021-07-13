const express = require('express')
const app = express()
const bodyParser = require("body-parser")
const mongoose = require('mongoose')
const router = require('./routes/api')
const fileUpload = require('express-fileupload')
var cors = require('cors')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(express.static(__dirname+'/'));
app.use(fileUpload());
app.use(cors())

app.use('/api', router)

// 404 NOT FOUND RESPONSE
app.use((req, res, next) => {
    res.status(404).send("<h1 style='text-align: center'> Page Not Found! </h1>")
})

mongoose.connect('mongodb+srv://assignment:assignment123@cluster0.dp7lj.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useFindAndModify: false })
.then((result) => {
    app.listen(4000, () => {
        console.log("Listing on 4000")
    })
})
.catch((err) => console.log("err err", err))


