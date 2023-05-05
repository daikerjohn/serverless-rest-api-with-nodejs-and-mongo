const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
let isConnected;
 
module.exports = connectToDatabase = () => {
  if (isConnected) {
    return Promise.resolve();
  }
  mongoose.set('strictQuery', false);
  return mongoose.connect(process.env.DB)
    .then(db => { 
      isConnected = db.connections[0].readyState;
    });
};
