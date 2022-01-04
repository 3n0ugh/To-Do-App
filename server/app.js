const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const routes = require('./routers');

require('dotenv').config();

const app = express();

app.use(
  cors({
    origin: 'http://localhost:8080',
  })
);
app.use(morgan('tiny'));
app.use(express.json());
app.use('/api/v1/to-do', routes);

function notFound(req, res, next) {
  res.status(404);
  const error = new Error('Not Found - ' + req.originalUrl);
  next(error);
}

function errorHandler(err, req, res, next) {
  res.status(res.statusCode || 500);
  res.json({
    message: err.message,
    stack: err.stack,
  });
}

app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}...`);
});
