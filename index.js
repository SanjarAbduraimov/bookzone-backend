const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('./middleware/logger');

const bookRouter = require('./routes/books');
const authorRouter = require('./routes/authors');
const adminRouter = require('./routes/admins');
// const userRouter = require('./routes/users');
const auth = require('./routes/auth');
const home = require('./routes/home');
// const {isAdmin} = require('./utils');


const helmet = require('helmet');
const morgan = require('morgan');
const config = require('config');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('*', cors());
app.set('view engine', 'pug');
app.use('/', home);
app.use('/api', auth);
app.use('/api/books', bookRouter);
app.use('/api/authors', authorRouter);
app.use('/api/admins', adminRouter);
// app.use('/api/users',  userRouter);


app.use(helmet());

if (app.get('env') === 'development') {
  app.use(morgan('dev'))
  app.use(logger);
}

mongoose.connect('mongodb://localhost/bookzone', { useNewUrlParser: true, useUnifiedTopology: true })
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