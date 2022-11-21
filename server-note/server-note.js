const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const path = require('path')
const dotenv = require('dotenv');
dotenv.config()

const authentification = require('./routes/authRoute');
const notes = require('./routes/noteRoute');
const test = require('./routes/testRoute');

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(cookieParser())

app.use("/api", authentification)
app.use("/api", notes)
app.use("/api", test)

if ((process.env.NODE_ENV = 'development')) {
    app.use(cors({ origin: `http://localhost:3000` }));
}


const port = process.env.APP_PORT || 5000
app.listen(port, () => {
    console.log('Le server est lancé sur le port', port)
})