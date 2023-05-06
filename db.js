const mongoose = require('mongoose');
//mongoose.Promise = global.Promise;
//mongoose.set('strictQuery', true);

let conn = null;
let isConnected;

module.exports.connect = async function() {
  if (conn == null) {
    conn = mongoose.createConnection(process.env.DB, {
      serverSelectionTimeoutMS: 5000
    });

    // `await`ing connection after assigning to the `conn` variable
    // to avoid multiple function calls creating new connections
    await conn.asPromise();
  }

  return conn;
}

module.exports = connectToDatabase = () => {
  if (isConnected) {
    return Promise.resolve();
  }

  return mongoose.connect(process.env.DB)
    .then(db => {
      isConnected = db.connections[0].readyState;
    });
};
