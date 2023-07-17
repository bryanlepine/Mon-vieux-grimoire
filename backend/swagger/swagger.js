const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const express = require('express');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API de gestion des livres',
      version: '1.0.0',
      description: 'Documentation de l\'API de gestion des livres',
    },
    basePath: '/api',
  },
  apis: ['../routes/*.js'],
};

const swaggerDocument = require('../swagger.json');

module.exports = (app) => {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};