'use strict';

const mongoose = require('mongoose');

const tacosSchema = mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
});

const tacosModel = mongoose.model('tacos', tacosSchema);

module.exports = tacosModel;
