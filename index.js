const express = require('express')
const app = express()
var bodyParser = require('body-parser')

app.get('/',(req,res)=>res.send('API Running'))

//Init middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//define routes
app.use('/api/contact',require('./routes/api/contact'))

const PORT = 5000

app.listen(PORT,()=>{console.log(`Server started on port ${PORT} `)})
