const cors = require('cors');
const createError = require('http-errors');
const express = require('express');
const morgan = require('morgan');
require('dotenv').config();

const AnalyseRoute = require('./routes/Analyse.Route');

const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(cors());

app.use('/analyse', AnalyseRoute);

// API NOT FOUND
app.use(async(req, res, next) => {
  next(createError.NotFound());
});
// GENERIC ERROR HANDLER
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.send({
    error: {
      status: error.status || 500,
      message: error.message
    }
  })
})

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`🚀 Server running at port ${PORT}...`);
});