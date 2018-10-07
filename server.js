// server.js
// where your node app starts

// init project
const express = require('express')
const app = express()
const bodyParser = require('body-parser')


const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  count: Number,
  log: [
    {description: String, duration: Number, date: Date}
  ],
});

const User = mongoose.model('User', UserSchema);

app.use(bodyParser.json({ type: 'application/*+json' }))
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static('public'))

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + '/views/index.html')
})


// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`)
})
