const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const config = require('./utils/config');
const limiter = require('./middlewares/rateLimit');
const router = require('./routes/index');
const errorHandler = require('./middlewares/errorhandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const {
  PORT = config.PORT,
  MONGODB_URL = config.MONGODB_URL,
} = process.env;

const app = express();

app.use(requestLogger);
app.use(limiter);
app.use(cors());
app.use(bodyParser.json());
app.use(helmet());
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

mongoose.set('strictQuery', true);
mongoose.connect(MONGODB_URL);

app.listen(PORT);
