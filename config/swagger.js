const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'My API',
    description: 'Description',
  },
  host: 'localhost:8000',
  schemes: ['http'],
  basePath: '/api'
};

const outputFile = './config/swagger.json';
const endpointsFiles = [
  'index.js'
];

swaggerAutogen(outputFile, endpointsFiles, doc);

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('../index.js')           // Your project's root file
})