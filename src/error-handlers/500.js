'use strict';

// 500 Error Handler
module.exports = function (err, req, res, next) {
  // Sometimes, errors come in as an object, others as a string
  const error = err.message ? err.message : err;
  // Using an object since it will play better with our API
  const errorObj = {
    status: 500,
    message: error,
    request: req.body,
  };
  // Send a 500 and the error object
  res.status(500).json(errorObj);
};
