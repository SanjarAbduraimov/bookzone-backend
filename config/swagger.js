const swaggerAutogen = require('swagger-autogen')()


const doc = {
  info: {
    title: 'Food API',
    description: 'Simple POS sytem API',
  },
  host: 'localhost:8002',
  schemes: ['http'],
  securityDefinitions: {
    apiKeyAuth: {
      type: 'apiKey',
      in: 'header', // can be 'header', 'query' or 'cookie'
      name: 'Authorization', // name of the header, query parameter or cookie
      description: 'Copy and paste token from data using "Berear token" using /auth/sign-up or /auth/login"'
    },
  },
  definitions: {
    LOG_IN: {
      $email: 'admin@mail.ru',
      $password: '123456'
    },
    SIGN_UP: {
      $email: 'admin@mail.ru',
      $password: '43678yrwiuehruweytr8y348',
      firstName: 'Admin',
      lastName: 'Admin',
      lang: 'uz',
      image: '',
      phone: '+998995558877',
      address: 'HelloCity',
    },
    AUTH_RESPONSE: {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGVkYTFkZmNjMDAyZTY2OGM1ZDQ5NjMiLCJpYXQiOjE2MjYxODYyMDcsImV4cCI6MTYyNjIyMjIwN30.whBHL9YH-TYUHwAySlexSxkQKCAKxI6g603qwweZuEQ",
      "user": {
        email: 'admin@mail.ru',
        password: '43678yrwiuehruweytr8y348',
        firstName: 'Admin',
        lastName: 'Admin',
        lang: 'uz',
        image: '',
        phone: '+998995558877',
        address: 'HelloCity',
        "createdAt": "2021-07-13T14:23:25.696Z",
        "updatedAt": "2021-07-13T14:23:25.696Z",
        "_id": "60eda1dfcc002e668c5d4963"
      },
      "success": true
    },
    AUTHOR: {
      $firstName: 'William',
      $lastName: 'Shekspare',
      date_of_birth: '2021-07-13T14:23:25.696Z',
      date_of_death: '2021-07-13T14:23:25.696Z',
      createdAt: '2021-07-13T14:23:25.696Z',
      updatedAt: '2021-07-13T14:23:25.696Z',
      user: 'userId',
    }
  }
};

const outputFile = './config/swagger_output.json';
const endpointsFiles = ['./routes/index'];

swaggerAutogen(outputFile, endpointsFiles, doc);