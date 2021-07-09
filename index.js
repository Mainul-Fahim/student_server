const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yu2o5.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('connection error', err);
  const studentsCollection = client.db("studentTable").collection("students");
  const subjectsCollection = client.db("studentTable").collection("subjects");
  console.log('Database Connected Successfully');
  // perform actions on the collection object

  app.post('/addStudent', (req, res) => {
    const newStudent = req.body;
    console.log('new Service', newStudent);
    studentsCollection.insertOne(newStudent)
        .then(result => {
            console.log('insertedCount', result);
            res.send(result)
        })
})

app.get('/students', (req, res) => {
    studentsCollection.find()
        .toArray((err, items) => {
            res.send(items)
        })
  })

  app.post('/addSubject', (req, res) => {
    const newSubject = req.body;
    console.log('new Service', newSubject);
    subjectsCollection.insertOne(newSubject)
        .then(result => {
            console.log('insertedCount', result);
            res.send(result)
        })
})

app.get('/subjects', (req, res) => {
    subjectsCollection.find()
        .toArray((err, items) => {
            res.send(items)
        })
  })

app.delete('/delete/:id',(req,res) => {
  const id=ObjectId(req.params.id);
  studentsCollection.findOneAndDelete({_id: id})
  .then(result => {
    console.log(result);
    res.send(result.deletedCount>0)
  })
})
  //client.close();
});




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})