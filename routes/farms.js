const express = require('express'),
  path = require('path'),
  router = express.Router();

router.get('/near/:long/:lat', async (req, res) =>{
  const {long, lat} = req.params;
  // req.db.find({
  //   location: {$near: [+long, +lat], $maxDistance: 100}
  // }, {_id: 1, farm_name: 1, founding_date: 1, address: 0}).limit(5)
  req.db.find( {
    location: {
      $near : [+long, +lat]
    }
  }, {"_id": 0, "farm_name": 0, "founding_date": 0, "address": 1} ).limit(2)
    .toArray((err, data) => res.json({success:1, data}))
});

router.post('/:farm_id/cheese_list/', async (req, res) =>{
  const {farm_id} = req.params;
  const cheese_item = req.body;

  await req.db.updateOne(
    {_id: +farm_id},
    {$push: {"cheese_list": cheese_item}}
  )
  req.db.find({}).toArray((err, data) => res.json({success:1, data}))
});

router.post('/fill', async (req, res) =>{
  console.log(req.body);
  await req.db.insertMany(req.body, (err, results) => {
    if(err) {
      res.status(500).send(err.message);
    }
    res.send(results)
  })
});

module.exports = router;
