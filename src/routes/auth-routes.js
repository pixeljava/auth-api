'use strict';

const express = require('express');
const User = require('../models/users-model');

const authRouter = express.Router();

const basicAuth = require('../middleware/basicAuth.js');
const bearerAuth = require('../middleware/bearerAuth.js');

authRouter.post('/signup', async (req, res, next) => {
  try {
    let user = new User(req.body);
    const userRecord = await user.save();
    const responseObject = {
      user: {
        _id: userRecord._id,
        username: userRecord.username,
        capabilities: userRecord.capabilities,
      },
      token: userRecord.token,
    };
    res.status(201).json(responseObject);
  } catch (e) {
    next(e.message);
  }
});

authRouter.post('/signin', basicAuth, (req, res, next) => {
  const userObject = {
    user: {
      _id: req.user._id,
      username: req.user.username,
      capabilities: req.user.capabilities,
    },
    token: req.user.token,
  };
  res.status(200).json(userObject);
});

authRouter.get('/users', bearerAuth, async (req, res, next) => {
  const users = await User.find({});
  const list = users.map(user => user.username);
  res.status(200).json(list);
});

authRouter.get('/secret', bearerAuth, async (req, res, next) => {
  res.status(200).send('Welcome to the secret area!');
});

module.exports = authRouter;
