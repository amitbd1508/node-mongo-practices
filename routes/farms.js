const express = require('express'),
  path = require('path'),
  router = express.Router();



router.get('/near/:long/:lat', async (req, res) =>{
  const {long, lat} = req.params;
  await req.db.find( {
    location: {
      $near : [+long, +lat]
    }
  }, {_id: 0, farm_name: 1, founding_date: 1, address: 1}).limit(3).toArray((err, data) => res.json({success:1, data}))
});

router.get('/', async (req, res) =>{
  await req.db.find({})
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

router.patch('/:farm_id/sellers/:seller_email/inspections/:year', async (req, res) =>{
  const {farm_id, seller_email, year} = req.params;
  const {grade} = req.body;

  await req.db.updateOne(
    {_id: +farm_id},
    {$set: {'authorized_sellers.$[t].inspections.$[q].grade': +grade}},
    {arrayFilters: [{'t.seller.email': seller_email}, {'q.year': +year}]},
  )
  req.db.find({_id: +farm_id}).toArray((err, data) => res.json({success:1, data}))
});

router.get('/search', async (req, res) =>{
  const {milk_type, aop_certified, organic, aged_for} = req.query;

  await req.db.find(
    {'cheese_list.milk_type': milk_type, 'cheese_list.aop_certified': Boolean(aop_certified), 'cheese_list.organic': Boolean(organic), 'cheese_list.aged_for': +aged_for }
  ).toArray((err, data) => res.json({success:1, data}))
});

router.delete('/delete', async (req, res) =>{
  console.log(req.body);
  await req.db.deleteMany({});
  res.send(await req.db.find({}));
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
