'use strict';

require('dotenv').config({ path: './variables.env' });
const connectToDatabase = require('./db');
const SolarPoint = require('./models/SolarPoint');
const TempPoint = require('./models/TempPoint');

module.exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };

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
 
  connectToDatabase()
    .then(() => {
      SolarPoint.find()
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
