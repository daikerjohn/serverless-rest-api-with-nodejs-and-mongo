'use strict';

require('dotenv').config({ path: './variables.env' });
const connectToDatabase = require('./db');
const SolarPoint = require('./models/SolarPoint');
const TempPoint = require('./models/TempPoint');

const fs = require('fs');

module.exports.hello = (event, context, callback) => {
  let hours = 14;
  if (event?.queryStringParameters && event?.queryStringParameters.hours) {
    hours = event.queryStringParameters.hours;
  }

  fs.readFile('./index.html', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
    }
    data = data.replace('<option>' + hours + '</option>', '<option selected="asdf">' + hours + '</option>');
    //console.log(data);
    callback(null, {
      statusCode: 200,
      headers: {
        "Content-Type": "text/html",
      },
      body: data,
    });
  });

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

 
require('dotenv').config({ path: './variables.env' });
 
 
module.exports.create = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
 
  connectToDatabase()
    .then(() => {
      SolarPoint.create(JSON.parse(event.body))
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
      SolarPoint.findById(event.pathParameters.id)
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

  let hours = 12;
  if (event?.queryStringParameters && event?.queryStringParameters.hours) {
    hours = event.queryStringParameters.hours;
  }
  //console.log(hours);

  connectToDatabase()
    .then(() => {
      var cutoff = new Date();
      cutoff.setHours(cutoff.getHours()-hours);
      SolarPoint.find({ $and: [{ timestamp: { $gte: cutoff } }, { battery_soc: { $ne: 0 } }] } ).sort( { timestamp: 1 } )
        .then(users => callback(null, {
          statusCode: 200,
          body: JSON.stringify(users)
        }))
        .catch(err => {
          console.log(err);
          callback(null, {
            statusCode: err.statusCode || 500,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Could not fetch the user.'
          })
        })
    });
};
 
module.exports.update = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
 
  connectToDatabase()
    .then(() => {
      SolarPoint.findByIdAndUpdate(event.pathParameters.id, JSON.parse(event.body), { new: true })
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
      SolarPoint.findByIdAndRemove(event.pathParameters.id)
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

// Temperature
module.exports.createTemp = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
 
  connectToDatabase()
    .then(() => {
      TempPoint.create(JSON.parse(event.body))
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

module.exports.getAllTemp = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
 
  connectToDatabase()
    .then(() => {
      TempPoint.find()
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
