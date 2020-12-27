'use strict';

module.exports = (capability) => {
  return (req, res, next) => {
    // console.log('User Capabilities: ', req.user.capabilities);
    // console.log('Method Requires: ', capability);
    try {
      if (req.user.capabilities.includes(capability)) {
        next();
      }
      else {
        res.status(403).send(`You do not have the proper access to ${capability} this resource!`);
      }
    } catch (e) {
      res.status(403).send('Invalid login!');
    }
  };
};
