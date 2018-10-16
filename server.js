const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const multer = require('multer'); // v1.0.5
const upload = multer(); // for parsing multipart/form-data

app.use(bodyParser.json({ type: 'application/*+json' }))
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static('public'))

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + '/views/index.html')
})

app.post('/api/fileanalyse', upload.single('file'), async (req, res) => {
  console.log(req.file);
  res.json({
    error: 'Cannot create a user'
    name:	file.originalname,
type: file.	"image/jpeg"
size	71545
  })
})


// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`)
})
