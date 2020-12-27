'use strict';

module.exports = (capability) => {
  return (req, res, next) => {
    console.log('User Capabilities: ', req.user.capabilities);
    console.log('Method Requires: ', capability);
    try {
      if (req.user.capabilities.includes(capability)) {
        next();
      }
      else {
        next('Access Denied');
      }
    } catch (e) {
      next('Invalid Login');
    }
  };
};
