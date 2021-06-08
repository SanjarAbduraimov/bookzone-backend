const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('./middleware/logger');
const booksRouter = require('./routes/books');
const authRouter = require('./routes/auth');
const authorsRouter = require('./routes/authors');

// const auth = require('./routes/auth');
// const categories = require('./routes/categories')
// const home = require('./routes/home');
// app.use(express.static('public'));
// app.use('/', home);
// app.use('/api/categories', categories)
// app.use('/api', auth);


const helmet = require('helmet');
const morgan = require('morgan');
const config = require('config');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('*', cors());
app.set('view engine', 'pug');
app.use('/api/auth', authRouter);
app.use('/api/authors', authorsRouter);
app.use('/api/books', booksRouter);

app.use(helmet());

if (app.get('env') === 'development') {
  app.use(morgan('dev'))
  app.use(logger);
}

mongoose.connect('mongodb://localhost/books', { useNewUrlParser: true, useUnifiedTopology: true })
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