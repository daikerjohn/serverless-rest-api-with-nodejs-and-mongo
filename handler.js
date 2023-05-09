'use strict';

// Enables JSON serialization of BigInt type
BigInt.prototype.toJSON = function() {
  return this.toString(16).padStart(64, '0');
};

require('dotenv').config({
  path: './variables.env'
});
const connectToDatabase = require('./db');
const HashRange = require('./models/HashRange');
const FoundKey = require('./models/FoundKey');

module.exports.foundKey = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  var theKey = 0n;
  if (event.pathParameters != null && event.pathParameters.key != null) {
    console.error("with param: " + event.pathParameters.key);
    theKey = BigInt('0x' + event.pathParameters.key);
  }
  console.log("theKey: " + theKey);
  console.log("theKey: " + theKey.toString(16).padStart(64, '0'));
  return connectToDatabase()
    .then(() => {
      return FoundKey.create({
          key_hex: theKey.toString(16).padStart(64, '0')
        })
        .then(user => {
          return {
            statusCode: 200,
            body: JSON.stringify(user)
          };
        })
        .catch(err => {
          console.error(err);
          return {
            statusCode: err.statusCode || 500,
            headers: {
              'Content-Type': 'text/plain'
            },
            body: 'Could not fetch the user.'
          };
        });
    });

}


module.exports.finishRange = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  var rangeId = 0;
  if (event.pathParameters != null && event.pathParameters.id != null) {
    console.info("with param: " + event.pathParameters.id);
    rangeId = event.pathParameters.id.toString();
  }
  console.log("RangeId: " + rangeId);
  let filter = {
    _id: rangeId
  };
  let upd = {
    completed_time: Date.now()
  };
  return connectToDatabase()
    .then(() => {
      return HashRange.updateOne(filter, upd)
        .then(res => {
          console.log("finishedRange: " + rangeId);
          return {
            statusCode: 200,
            body: JSON.stringify({
              success: true
            })
          };
        })
        .catch(err => {
          console.error(err);
          return {
            statusCode: err.statusCode || 500,
            headers: {
              'Content-Type': 'text/plain'
            },
            body: 'Could not fetch the user.'
          };
        })
    });
}

module.exports.getRange = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  return connectToDatabase()
    .then(() => {
      var size = 100n;
      if (event.pathParameters != null && event.pathParameters.size != null) {
        console.info("with param: " + event.pathParameters.size);
        size = BigInt(event.pathParameters.size);
      }
      //var next_start = findNextStart().resolve();

      //var next_start = 99;
      //let qwerty = findNextStartt();
      //console.log("qwerty : " + qwerty);
      //qwerty.then(asdf => {
      return findNextStartt().then(next_start => {
        //console.info("typeof next_start: " + typeof next_start);
        //console.info("typeof size: " + typeof size);
        var next_end = next_start + size;
        console.info("next_end : " + next_end);
        /*
                var next_start_string = next_start.toString(16).padStart(64, '0');
                var next_end_string = next_end.toString(16).padStart(64, '0');
                console.error("next_start_string : " + next_start_string);
                console.error("next_end_string : " + next_end_string);
                return HashRange.create({start_key: next_start_string, end_key: next_end_string, requested_time: new Date().Now})
        */
        return HashRange.create({
            start_key: next_start,
            end_key: next_end,
            requested_time: Date.now()
          })
          .then(user => {
            return {
              statusCode: 200,
              body: JSON.stringify(user)
            };
          })
          .catch(err => {
            console.error(err);
            return {
              statusCode: err.statusCode || 500,
              headers: {
                'Content-Type': 'text/plain'
              },
              body: 'Could not fetch the user.'
            };
          });
      });



    });
};

async function finishOne(id) {
  let filter = {
    _id: id
  };
  let upd = {
    completed_time: Date.now()
  };
  return HashRange.updateOne(filter, upd);
}

async function findNextStartt() {
  let filter = {
    completed_time: {
      $gte: new Date(0)
    }
  };
  let fields = null;
  //let filter = { completed_time: { $neq: 0 } };
  let options = {
    sort: {
      end_key: -1
    }
  };
  //return connectToDatabase()
  //.then(() => {
  //return HashRange.findOne(filter, options)
  return HashRange.findOne(filter, fields, options)
    .then(hr => {
      if (hr == null || hr == undefined) {
        console.log("not found");
        hr = {}
        hr.end_key = 0n;
      }
      console.info("hr" + JSON.stringify(hr));
      return hr;
    })
    .then(asdf => {
      //console.info("end_key: " + asdf.end_key);
      return asdf.end_key + 1n;
      /*
      console.error("start_key: " + hr.start_key);
      hr.start_key = hr.end_key + 1n;
      hr.end_key = undefined;
      return hr;
      */
      //return parseInt(hr.start_key, 16);
      //console.error(intVal);
      //intVal += 1
      //console.error(intVal);
      //return intVal;
    })
    .catch(err => {
      console.error("err: " + err);
      var asdf = {};
      asdf.start_key = 1n;
      return 0n;
    });
  //});
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
