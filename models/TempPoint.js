const mongoose = require('mongoose');
const TempPointSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  temp: { type: Number },	// celsius
  tempF: { type: Number },	// fahrenheit
  humidity: { type: Number },	// percentage
  
});
module.exports = mongoose.model('TempPoint', TempPointSchema);
