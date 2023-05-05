const mongoose = require('mongoose');
const HashRangeSchema = new mongoose.Schema({  
  start_key: { type: String, required: true, maxLength: 64 },
  end_key: { type: String, required: true, maxLength: 64 },
  requested_time: { type: Date, required: true, default: Date.now() },
  completed_time: { type: Date, required: true, default: 0 }
});
module.exports = mongoose.model('HashRange', HashRangeSchema);
