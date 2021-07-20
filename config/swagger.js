const swaggerAutogen = require('swagger-autogen')()


const doc = {
  info: {
    title: 'Food API',
    description: 'Simple POS sytem API',
  },
  host: 'localhost:8000',
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
    USER: {
      $email: 'admin@mail.ru',
      $password: '123456',
      firstName: '',
      lastName: '',
      lang: '',
      image: '',
      phone: '',
      address: ''
    },
    SHELF: { bookId: "werfgnsbxjj65wd656" },
    AUTHOR: {
      $firstName: 'William',
      $lastName: 'Shekspare',
      date_of_birth: '2021-07-13T14:23:25.696Z',
      date_of_death: '2021-07-13T14:23:25.696Z',
      createdAt: '2021-07-13T14:23:25.696Z',
      updatedAt: '2021-07-13T14:23:25.696Z',
      user: 'userId',
    },
    BOOK: {
      title: 'Harry Potter',
      description: 'Nice description',
      author: 'authorId',
      country: 'Uzbekistan',
      imageLink: 'https://book.com/cover.jpg',
      language: 'uz',
      link: 'book-file-url.pdf',
      pages: 245,
      year: 2018,
      views: 768,
      rate: 4.3,
      price: 34000,
      comments: [{
        text: 'Good book to read',
        bookId: 'hg342hghghg23hgj32g'
      }],
      user: 'userId_78987dsf7fds8',
      category: 'classic',
      isPublished: false,
      updatedAt: '2021-07-13T14:23:25.696Z'
    },
    PAGINATION: {
      totalDocs: 8,
      limit: 10,
      totalPages: 1,
      page: 1,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: 1,
      nextPage: 3
    },
    COMMENT: {
      $text: "William Shakespeare kitoblarini sevib o'qiyman",
      $bookId: 's54s8jm659fih9hi56pk',
    }
  }
};

const outputFile = './config/swagger_output.json';
const endpointsFiles = ['./routes/index'];

swaggerAutogen(outputFile, endpointsFiles, doc);