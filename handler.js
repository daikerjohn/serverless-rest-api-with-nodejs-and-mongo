'use strict';

require('dotenv').config({ path: './variables.env' });
const connectToDatabase = require('./db');
const HashRange = require('./models/HashRange');


module.exports.getRange = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase()
    .then(() => {
      var size = 100;
      if(event.pathParameters != null && event.pathParameters.size != null) {
        console.error("with param: " + event.pathParameters.size);
        size = parseInt(event.pathParameters.size);
      }
      //var next_start = findNextStart().resolve();

      var next_start = 99;
      findNextStart().then(asdf => {
        console.error("asdf : " + asdf);
        //next_start = asdf;
        console.error("next_start : " + next_start);
        var next_end = next_start + size;
        console.error("next_end : " + next_end);
        var next_start_string = next_start.toString(16);
        var next_end_string = next_end.toString(16);
        console.error("next_start_string : " + next_start_string);
        console.error("next_end_string : " + next_end_string);
        HashRange.create({start_key: next_start_string, end_key: next_end_string, requested_time: new Date().Now})
          .then(user => callback(null, {
            statusCode: 200,
            body: JSON.stringify(user)
          }))
          .catch(err => callback(null, {
            statusCode: err.statusCode || 500,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Could not fetch the user.'
          }));
      });
      
      

    });
};

function findNextStart() {
  let filter = { completed_time: { $gt: new Date(0)  } };
  //let filter = { completed_time: { $neq: 0 } };
  let options = { sort: { end_key: -1 } };
  return connectToDatabase()
  .then(() => {
    HashRange.findOne(filter, options)
    .then((hr => {
      if(hr == null || hr == undefined) {
        hr = {}
        hr.end_key = "0";
      }
      return hr;
    }))
    .then((hr => {
      console.error("end_key: " + hr.end_key);
      return parseInt(hr.end_key, 16);
      //console.error(intVal);
      //intVal += 1
      //console.error(intVal);
      //return intVal;
    }))
    .catch(err => callback(null, {
      console.log(err);
      //var asdf = {};
      //return asdf;
    }));
  });
}

/*
module.exports.create = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase()
    .then(() => {
      User.create(JSON.parse(event.body))
        .then(user => callback(null, {
          statusCode: 200,
          body: JSON.stringify(user)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not create the user.'
        }));
    });
};

module.exports.getOne = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase()
    .then(() => {
      User.findById(event.pathParameters.id)
        .then(user => callback(null, {
          statusCode: 200,
          body: JSON.stringify(user)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not fetch the user.'
        }));
    });
};

module.exports.getAll = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase()
    .then(() => {
      User.find()
        .then(users => callback(null, {
          statusCode: 200,
          body: JSON.stringify(users)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not fetch the user.'
        }))
    });
};

module.exports.update = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase()
    .then(() => {
      User.findByIdAndUpdate(event.pathParameters.id, JSON.parse(event.body), { new: true })
        .then(user => callback(null, {
          statusCode: 200,
          body: JSON.stringify(user)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not fetch the user.'
        }));
    });
};

module.exports.delete = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase()
    .then(() => {
      User.findByIdAndRemove(event.pathParameters.id)
        .then(user => callback(null, {
          statusCode: 200,
          body: JSON.stringify({ message: 'Removed user with id: ' + user._id, user: user })
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not fetch the user.'
        }));
    });
};
*/
