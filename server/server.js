const express = require('express')
const cors = require('cors')
const massive = require('massive')
const bodyParser = require('body-parser')
require('dotenv').config()

const app = express()
const port = process.env.SERVER_PORT || 5009

massive(process.env.CONNECTION_STRING).then(db => {
  app.set('db', db)
  console.log('db is connected!')
})

app.use(bodyParser.json())


app.use('/s3', require('react-s3-uploader/s3router')({
  bucket: "wsl1",
  region: 'us-west-2', //optional
  headers: {'Access-Control-Allow-Origin': '*'}, // optional
  ACL: 'public-read', // this is default
}))

app.get('/api/images', async (req, res) => {
  let db = req.app.get('db')
  let images = await db.getImages()
  res.send(images)
})

app.post('/api/images', async (req, res) => {
  try {
    let db = req.app.get('db')
    let images = await db.addImage(req.body.imageUrl)
    res.send(images[0])
  } catch (error) {
    console.log('we have a big problem:', error)
    res.status(500).send(error)
  }
})

app.listen(port, () => {
  console.log('listening on port:', port)
}) 

