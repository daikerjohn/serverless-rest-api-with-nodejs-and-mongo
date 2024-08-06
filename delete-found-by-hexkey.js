
require('dotenv').config({
  path: './variables.env'
});

const connectToDatabase = require('./db');
const HashRange = require('./models/HashRange');
const FoundKey = require('./models/FoundKey');

//const keyHex = { key_hex: {$eq : "0000000000000000000000000000000000000000000000000000000000005c69"}};
const keyHex = { key_hex: {$eq : "0000000000000000000000000000000000000000000000000000000000000011"}};
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.DB);

  //await FoundKey.find(keyHex).sort({found_time: 1}).skip(0).then(x => {
  await FoundKey.deleteMany(keyHex).sort({found_time: 1}).skip(1).then(x => {
      for (const [key, val] of Object.entries(x)) {
        console.log(x[key]);
      }
      return;
      //console.log(x.requested_time);
      //return;
    });
  process.exit(0);
}

