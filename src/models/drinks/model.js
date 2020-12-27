'use strict';

const mongoose = require('mongoose');

const drinksSchema = mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  size: { type: String, required: true },
});

const drinksModel = mongoose.model('drinks', drinksSchema);

module.exports = drinksModel;
