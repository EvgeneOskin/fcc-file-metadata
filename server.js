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

app.post('/api/exercise/new-user', async (req, res) => {
  const {username } = req.body
  try {
    const {_id} = await User.findOneAndUpdate(
      { username }, { $setOnInsert: { username }},
      {
        new: true,   // return new doc if one is upserted
        upsert: true // insert the document if it does not exist
      }
    )
    res.json({username, id: _id})
  }catch(e) {
    res.statusCode = 400
    res.json({error: 'Cannot create a user'})
  }
})

app.post('/api/exercise/add', async (req, res) => {
  const {userId, description, duration, date} = req.body
  try {
  const data = await User.findOneAndUpdate(
    { _id: userId },
    {
      $inc: { count: 1 },
      $push: {log: {description, duration, date}}
    },
    {upsert: true}
  )
  res.json({})
  } catch(e) {
    res.statusCode = 400
    res.json({error: 'can not create an sercise'})
  }
})

app.get('/api/exercise/log', (req, res) => {
  const {
    userId,
    from='',
    to='',
    limit=null
  } = req.query
  
})

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`)
})
