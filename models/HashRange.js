const mongoose = require('mongoose');
const HashRangeSchema = new mongoose.Schema({
  //start_key: { type: String, required: true, maxLength: 64 },
  //end_key: { type: String, required: true, maxLength: 64 },
  /*
  start_key: {
    type: String,
    required: true,
  },
  end_key: {
    type: String,
    required: true,
  },
  */
  start_key: {
    type: Buffer,
  },
  end_key: {
    type: Buffer,
  },
  requested_time: {
    type: Date,
    required: true,
    default: 0
  },
  completed_time: {
    type: Date,
    required: true,
    default: 0
  },
  range_size: {
    type: Number,
    required: false,
    default: 0
  },
  duration: {
    type: mongoose.Types.Decimal128,
    required: false,
    default: 0
  },
  instance: {
    type: String,
    required: false,
    default: ""
  },
  num_cpus: {
    type: Number,
    required: false,
    default: 0
  },
});
module.exports = mongoose.model('HashRange', HashRangeSchema);
