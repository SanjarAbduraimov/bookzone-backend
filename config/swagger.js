const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'My API',
    description: 'Description',
  },
  host: 'localhost:8000',
  schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json'],
  basePath: '/api',
  definitions: {
    Auth: {
      firstName: "Alisher",
      lastName: "Musurmonov",
      email: "info@alitech.uz",
      password: "something"
    }
  },
  tags: [
    {
      name: 'Users',
      description: 'Hey hey'
    }
  ]
};

const outputFile = './config/swagger.json';
const endpointsFiles = [
  'index.js'
];

swaggerAutogen(outputFile, endpointsFiles, doc);

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('../index.js')           // Your project's root file
})