const router = require('express').Router();

const analyse = require('../helpers/s-analysis');

router.post('/', async(req, res, next) => {
  try {
    const text = req.body.text;
    const result = await analyse(text);
    console.log(result);
    
    res.send(result);
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;