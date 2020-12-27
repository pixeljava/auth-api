'use strict';

// 3rd Party Resources
require('dotenv').config(); // Access .env to read in environmental variables
const express = require('express'); // JS server library
const cors = require('cors'); // CORS Integration
const morgan = require('morgan'); // Morgan Logging Library

// Localize Middleware Modules
const logger = require('./middleware/logger');
const notFoundHandler = require('./error-handlers/404');
const serverErrorHandler = require('./error-handlers/500');
// Require routes
const v1Routes = require('./routes/v1.js');
const v2Routes = require('./routes/v2.js');
const authRoutes = require('./routes/auth-routes.js');

// Create an Express server instance named 'app' and attach middleware
let app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(logger);
app.use(morgan('dev'));

// Attach routes to app instance
app.use('/api/v1', v1Routes);
app.use('/api/v2', v2Routes);
app.use(authRoutes);

// Error handler middleware
app.use('*', notFoundHandler);
app.use(serverErrorHandler);

module.exports = {
  server: app, // Used by testing
  start: port => { // Takes port from index.js, starts server.
    if(!port) { throw new Error('missing port');}
    app.listen(port, () => {
      console.log(`listening on ${port}`);
    });
  },
};