'use strict';

// Enables JSON serialization of BigInt type
BigInt.prototype.toJSON = function() {
  return this.toString(16).padStart(64, '0');
};
Buffer.prototype.toJSON = function() {
  return BigInt('0b' + this).toString(16).padStart(64, '0');
};

require('dotenv').config({
  path: './variables.env'
});
const connectToDatabase = require('./db');
const HashRange = require('./models/HashRange');
const FoundKey = require('./models/FoundKey');

const PORT = process.env.PORT || 8443;

const path = require('path');
const fs = require('fs');

const express = require('express');

const app = express();
app.use(express.json());

//app.use("/public", express.static('public')); 

app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});

app.get("/status", (request, response) => {
  const status = {
     "Status": "Running"
  };
  
  response.send(status);
});

app.use('/favicon.ico', express.static(path.join(__dirname, 'public', 'favicon.ico')));

var crypto = require('crypto');

//module.exports.foundKey = async (event, context, callback) => {
//  context.callbackWaitsForEmptyEventLoop = false;
app.get("/dev/foundKey", (req, resp) => {
  var theKey = 0n;
  if (req?.query && req?.query.key) {
    //console.error("with param: " + event.pathParameters.key);
    theKey = BigInt('0x' + req.query.key);
  }
  console.log("theKey: " + theKey);
  console.log("theKey: " + theKey.toString(16).padStart(64, '0'));
  return connectToDatabase()
    .then(() => {
      return FoundKey.create({
          key_hex: theKey.toString(16).padStart(64, '0')
        })
        .then(user => {
          resp.send(JSON.stringify(user))
          //return {
          //  statusCode: 200,
          //  body: JSON.stringify(user)
          //};
        })
        .catch(err => {
          console.error(err);
          resp.send(JSON.stringify({success: false, message: "Could not create key"}))
          //return {
          //  statusCode: err.statusCode || 500,
          //  headers: {
          //    'Content-Type': 'text/plain'
          //  },
          //  body: 'Could not fetch the user.'
          //};
        });
    });
});

/*
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
*/
/*
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
        *
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
              body: 'Could not fetch range'
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
    $and: [{
      completed_time: {
        $gte: new Date(0)
      }
    }, {
      end_key: {
        $ne: undefined
      }
    }]
  };
  let fields = null;
  //let filter = { completed_time: { $neq: 0 } };
  let options = {
    sort: {
      end_key: -1
    },
    //useBigInt64: true
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
      *
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
*/


/*
module.exports.getRandom = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  return connectToDatabase()
    .then(() => {
      var size = 100n;
      if (event.pathParameters != null && event.pathParameters.size != null) {
        console.info("with param: " + event.pathParameters.size);
        size = BigInt(event.pathParameters.size);
      }
      var attempt = 0;
      return findRandomStart(size, attempt).then(next_start => {
        var next_end = next_start + size;
        console.info("next_end : " + next_end);
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
              body: 'Could not fetch random'
            };
          });
      });
    });
};
*/


//module.exports.getUnfinished = async (event, context, callback) => {
//  context.callbackWaitsForEmptyEventLoop = false;
app.get("/dev/getUnfinished/:sizeincoming", (req, resp) => {

  return connectToDatabase()
    .then(() => {
      var size = 5000000n;
      if (req?.query && req?.query.size) {
        console.info("with param: " + req.query.size);
        size = BigInt(req.query.size);
      }
      if (req.params.sizeincoming) {
        size = BigInt(req.params.sizeincoming);
      }
      if (size > 100000000n) {
        size = 100000000n;
      }
      var attempt = 0;
      var next_start = 0n;
      var next_end = 0n;
      return findUnfinished().then(any_unfinished => {
        if (any_unfinished == null || BigInt(any_unfinished.start_key) < 0n) {
          //console.info("unfinshed: " + any_unfinished)
          return findRandomStart(size, attempt).then(strt => {
            next_start = strt;
            next_end = next_start + size;
            createAndReturnRange(next_start, next_end).then(to_send => {
              resp.send(JSON.stringify(to_send));
            });
          });
        } else {
          resp.send(JSON.stringify(any_unfinished));
          //console.info("unfinshedJS: " + JSON.stringify(any_unfinished))
          //return {
          //  statusCode: 200,
          //  body: JSON.stringify(any_unfinished)
          //};
        }
      });
      //resp.send(to_send);
    });
});


function createAndReturnRange(strt, end) {
  const binaryRepresentation = BigInt(strt).toString(2);
  //console.log(binaryRepresentation);
  const binaryRepresentationEnd = BigInt(end).toString(2);
  //console.log(binaryRepresentationEnd);
  return HashRange.create({
    //start_key: strt.toString(16),
    //end_key: end.toString(16),
    start_key: binaryRepresentation,
    end_key: binaryRepresentationEnd,
    requested_time: Date.now()
  })
  .then(hr_obj => {
    return hr_obj;
    //return {
    //  statusCode: 200,
    //  body: JSON.stringify(hr_obj)
    //};
  })
  .catch(err => {
    console.error(err);
    return {success: false, message: 'Could not fetch createAndReturnRange'}
    //return {
    //  statusCode: err.statusCode || 500,
    //  headers: {
    //    'Content-Type': 'text/plain'
    //  },
    //  body: 'Could not fetch createAndReturnRange'
    //};
  });
}

/** Generates BigInts between low (inclusive) and high (exclusive) */
/*
function generateRandomBigInt() {
  var lowBigInt = 0n;
  var highBigInt = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
  //if (lowBigInt >= highBigInt) {
  //  throw new Error('lowBigInt must be smaller than highBigInt');
  //}

  const difference = highBigInt - lowBigInt;
  const differenceLength = difference.toString().length;
  let multiplier = '';
  while (multiplier.length < differenceLength) {
    multiplier += Math.random()
      .toString()
      .split('.')[1];
  }
  multiplier = multiplier.slice(0, differenceLength);
  const divisor = '1' + '0'.repeat(differenceLength);

  const randomDifference = (difference * BigInt(multiplier)) / BigInt(divisor);

  return lowBigInt + randomDifference;
}
*/


async function findRandomStart(size_range, attempt) {
  var biggestKey = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
  var buffer = crypto.randomBytes(32);
  var proposedStart = BigInt(`0x${buffer.toString('hex')}`)
  while (proposedStart < 0n || proposedStart > biggestKey) {
      console.log("Negative start!");
      buffer = crypto.randomBytes(32);
      proposedStart = BigInt(`0x${buffer.toString('hex')}`)
  }
  //proposedStart = BigInt('0xa9b6dea4f66beef320fa3c3dac4bb3388604b5a5442dce60993c41860ac6c4bf')
  //var biggestKey = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
  //if(proposedStart > biggestKey) {
  //  console.log("Houston, we have a problem!");
  //}
  //var proposedStart = generateRandomBigInt()
  //var propStartString = proposedStart.toString(16).padStart(64, '0')
  var proposedEnd = proposedStart + size_range;

  return HashRange.find({
      $or: [{
          $and: [{
            start_key: {
              $lte: proposedStart.toString(2)
            }
          }, {
            end_key: {
              $gte: proposedStart.toString(2)
            }
          }]
        },
        {
          $and: [{
            start_key: {
              $lte: proposedEnd.toString(2)
            }
          }, {
            end_key: {
              $gte: proposedEnd.toString(2)
            }
          }]
        },
      ]
    })
    //.setOptions({
    //  useBigInt64: true
    //})
    .then(hr => {
      if (hr == null || hr == undefined || hr.length == 0) {
        console.log(`Overlap not found: ${proposedStart.toString(16)}`);
        return proposedStart;
      } else {
        attempt = attempt + 1;
        console.log(`Range found. Try again: ${attempt}`);
        return findRandomStart(size_range, attempt);
      }
    })
    .catch(err => {
      console.error("err: " + err);
      var asdf = {};
      asdf.start_key = 1n;
      return 0n;
    });
}

async function findUnfinished() {

  //const buffer = crypto.randomBytes(32);
  //var proposedStart = BigInt(`0x${buffer.toString('hex')}`)
  //var biggestKey = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
  //if(proposedStart > biggestKey) {
  //  console.log("Houston, we have a problem!");
  //}
  //var proposedStart = generateRandomBigInt()
  //var propStartString = proposedStart.toString(16).padStart(64, '0')
  //var proposedEnd = proposedStart + size_range;

  const hoursAgo = new Date();
  hoursAgo.setHours(hoursAgo.getHours() - 4);
  return HashRange.findOne({
      $and: [{
        completed_time: {
          $eq: new Date(0)
        }
      }, {
        requested_time: {
          $lte: hoursAgo
        }
      }]
    })
    //.setOptions({
    //  useBigInt64: true
    //})
    .then(hr => {
      if (hr == null || hr == undefined || hr.length == 0) {
        //console.log("Nothing unfinished!");
        return null;
      }
      return hr;
    })
    .catch(err => {
      console.error("err: " + err);
      //var asdf = {};
      //asdf.start_key = 1n;
      return null;
    });
}


//module.exports.finishRangeNew = async (event, context, callback) => {
//  context.callbackWaitsForEmptyEventLoop = false;
app.post("/dev/finishRangeNew", (req, resp) => {
  var rangeId = 0;
  console.log("req.body: " + JSON.stringify(req.body));
  var jsBody = req.body;
  //console.log("jsBody: " + JSON.stringify(jsBody));

  //console.log("RangeId: " + jsBody.id);
  let filter = {
    _id: jsBody.id
  };
  let upd = {
    completed_time: Date.now(),
    range_size: jsBody.range_size,
    duration: jsBody.duration,
    instance: jsBody.instance,
    num_cpus: jsBody.num_cpus,
  };
  return connectToDatabase()
    .then(() => {
      return HashRange.updateOne(filter, upd)
        .then(res => {
          console.log("finishedRangeNew: " + jsBody.id);
          resp.send(JSON.stringify({success: true}));
          //return {
          //  statusCode: 200,
          //  body: JSON.stringify({
          //    success: true
          //  })
          //};
        })
        .catch(err => {
          console.error(err);
          resp.send(JSON.stringify({success: false, message: 'Could not finish range'}));
          //return {
          //  statusCode: err.statusCode || 500,
          //  headers: {
          //    'Content-Type': 'text/plain'
          //  },
          //  body: 'Could not fetch the user.'
          //};
        })
    });
});



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
