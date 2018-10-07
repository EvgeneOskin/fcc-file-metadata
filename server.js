// server.js
// where your node app starts

// init project
const express = require('express')
const app = express()
const bodyParser = require('body-parser')


const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true,  dropDups: true  },
  count: Number,
  log: [
    {description: String, duration: Number, date: Date}
  ],
});
const User = mongoose.model('User', UserSchema);
User.createIndexes()

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
    const {_id} = await User.create({ username })
    res.json({username, id: _id})
  }catch(e) {
    res.statusCode = 400
    res.json({error: 'Cannot create a user'})
  }
})

app.post('/api/exercise/add', async (req, res) => {
  const {
    userId, description, 
    duration: durationStr, 
    date: dateStr=''
  } = req.body
  const date = dateStr ? new Date(dateStr) : new Date()
  const duration = parseInt(durationStr)
  try {
    const data = await User.findOneAndUpdate(
      { _id: userId },
      {
        $inc: { count: 1 },
        $push: {log: {description, duration, date}}
      },
      {upsert: true, new: true}
    )
    res.json({data})
  } catch(e) {
    res.statusCode = 400
    console.error(e)
    res.json({error: 'can not create an exsercise'})
  }
})

app.get('/api/exercise/log', async (req, res) => {
  const {
    userId,
    from='',
    to='',
    limit=null
  } = req.query
  try {
    let query = User.findById(userId)
    if (from) {
      query = query.find({'logs.date': {$gt: new Date(from)}})
    }
    if (to) {
      query = query.find({'logs.date': {$lt: new Date(to)}})
    }
    if (limit) {
      query = query.limit(parseInt(limit))
    }
    const data = await query.exec()
    res.json(data)
  } catch(e) {
    res.statusCode = 400
    console.error(e)
    res.json({error: 'can not list logs'})
  }
})

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`)
})
