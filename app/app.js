// Konfigurasi Elastic APM Agent
const apm = require('elastic-apm-node').start({
    serviceName: 'demo-app',
    serverUrl: process.env.APM_SERVER_URL || 'http://apm-server:8200',
    environment: process.env.NODE_ENV || 'development',
    logLevel: 'info'
  });
  
  const express = require('express');
  const app = express();
  const routes = require('./routes/index');
  const apiRoutes = require('./routes/api');
  
  // Middleware dasar
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  
  // Routes
  app.use('/', routes);
  app.use('/api', apiRoutes);
  
  // Error handling
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
  
  // Server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  
  module.exports = app;