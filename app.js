const express = require('express');
const path = require('path');
const farmsRoutes = require('./routes/farms');
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient('mongodb://localhost:27017', {useUnifiedTopology: true });
let db;
const app = express();
app.use(express.json()); app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => { if (!db) {
  client.connect(function (err) {
    db = client.db('midterm');
    req.db = db.collection('swiss_farms'); next();
  }); } else {
  req.db = db.collection('swiss_farms');
  next(); }
})
app.use('/farms', farmsRoutes);
app.use(function(err, req, res, next) { res.status(err.status || 500); res.render('error', {
  message: err.message,
  error: {} });
});

app.listen(3000, () => {
  console.log('listening 3000');
});


