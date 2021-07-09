const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const logger = require('./middleware/logger');

const swaggerFile = require('./config/swagger.json')
const swaggerUi = require('swagger-ui-express');
// const swaggerJsdoc = require('swagger-jsdoc');
const swaggerDocument = require('./config/swagger.json');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const config = require('config');
const mainRoutes = require('./routes/index')
app.use(compression());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use('*', cors());
app.set('view engine', 'pug');
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use('/', mainRoutes);




app.use(helmet());
app.use(express.static(path.join(__dirname, 'public')));

if (app.get('env') === 'development') {
  app.use(morgan('dev'))
  app.use(logger);
}

mongoose.connect('mongodb://localhost/bookzone',
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true })
  .then(() => {
    console.log("MongoDB ga ulanish hosil qilindi...");
  })
  .catch((err) => {
    console.log("MongoDBga ulanishda xatolik yuz berdi...", err);
  })

console.log(config.get('name'));
console.log(config.get('mailserver.host'));
// console.log(config.get('mailserver.password'));
console.log(process.env.NODE_ENV);

const port = process.env.PORT || 8000
console.log(port);


app.listen(port)