const mongoose = require('mongoose');
const FoundKeySchema = new mongoose.Schema({
  key_hex: {
    type: String,
    required: true,
    MaxLength: 64
  },
  found_time: {
    type: Date,
    required: true,
    default: Date.now()
  }
});
module.exports = mongoose.model('FoundKey', FoundKeySchema);
