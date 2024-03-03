'use strict';

require('dotenv').config({ path: './variables.env' });
const connectToDatabase = require('./db');
const SolarPoint = require('./models/SolarPoint');
//const TempPoint = require('./models/TempPoint');

const PORT = process.env.PORT || 3000;

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

app.get("/dev/hello", (req, resp) => {
  let hours = 14;
  if (req?.query && req?.query.hours) {
    hours = req.query.hours;
  }
  console.log("Hello: " + hours + " - " + new Date().toISOString());

  fs.readFile('./index.html', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
    }
    //data = data.replace('<option value="' + hours + '">' + hours + '</option>', '<option selected="asdf">' + hours + '</option>');
    //data = data.replace(`value="{hours}"`, `value="{hours} selected="yes"`);
    data = data.replace(`value="${hours}"`, `value="${hours}" selected="yes"`);
    //console.log(data);
    resp.send(data);
    /*
    //console.log(data);
    callback(null, {
      statusCode: 200,
      headers: {
        "Content-Type": "text/html",
      },
      body: data,
    });
    */
  });
});

/*
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
*/

app.post("/dev/solar", (req, resp) => {
  console.log(new Date().toISOString());
  console.log(req.body);
  //toCreate = JSON.parse(req.body)
  //console.log(toCreate);
  connectToDatabase()
  .then(() => {
    SolarPoint.create(req.body)
      .then(user => 
        /*
        callback(null, {
          statusCode: 200,
          body: JSON.stringify(user)
        })
        */
        resp.send(JSON.stringify(user))
      )
      .catch(err => 
        /*
        callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not create the user.'
        })
        */
        resp.status(500).send('Could not create the SolarPoint')
      );
  });
});

/*
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
*/

app.get("/dev/solar", (req, resp) => {
  let hours = 14;
  if (req?.query && req?.query.hours) {
    hours = req.query.hours;
  }
  console.log("Hours: " + hours + " - " + new Date().toISOString());

  connectToDatabase()
    .then(() => {
      var cutoff = new Date();
      cutoff.setHours(cutoff.getHours()-hours);
      SolarPoint.find({ $and: [{ timestamp: { $gte: cutoff } }, { battery_soc: { $ne: 0 } }] } ).sort( { timestamp: 1 } )
        .then(users => 
          resp.send(JSON.stringify(users))
          /*
          callback(null, {
            statusCode: 200,
            body: JSON.stringify(users)
          })
          */
        )
        .catch(err => {
          console.log(err);
          resp.status(500).send('Could not fetch Solar data');
          /*
          callback(null, {
            statusCode: err.statusCode || 500,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Could not fetch the user.'
          })
          */
        })
    });

  const status = {
     "Status": "Running"
  };
  
  //response.send(status);
});

app.get("/dev/solar_agg", (req, resp) => {
  let hours = 14;
  if (req?.query && req?.query.hours) {
    hours = req.query.hours;
  }
  console.log("Hours: " + hours + " - " + new Date().toISOString());

  connectToDatabase()
    .then(() => {
      var cutoff = new Date();
      cutoff.setHours(cutoff.getHours()-hours);
      SolarPoint
         //.find({ $and: [{ timestamp: { $gte: cutoff } }, { battery_soc: { $ne: 0 } }] } ).sort( { timestamp: 1 } )
         .aggregate(
          [
            {
              $project: {
                timestamp: 1,
                battery_soc: 1,
                battery_voltage: 1,
                battery_charging_amps: 1,
                battery_temperature: 1,
                latest_hashrate: 1,
                solar_charging_amps: 1,
                solar_panel_watts: 1,
                solar_panel_voltage: 1,
                asdf: { $dateTrunc: { date: "$timestamp", unit: "hour" } },
              }
            },
            { $match : { $and: [{ timestamp: { $gte: cutoff } }, { battery_soc: { $ne: 0 } }] } },
            { $group:
                {
                    _id: { $dateToString: { format: "%Y-%m-%d-%H", date: "$asdf",timezone: "America/Los_Angeles" } },
                    battery_soc: { $avg : "$battery_soc" },
                    battery_voltage: { $avg : "$battery_voltage" },
                    battery_charging_amps: { $avg : "$battery_charging_amps" },
                    battery_temperature: { $avg : "$battery_temperature" },
                    latest_hashrate: { $avg : "$latest_hashrate" },
                    solar_charging_amps: { $avg : "$solar_charging_amps" },
                    solar_panel_watts: { $avg : "$solar_panel_watts" },
                    solar_panel_voltage: { $avg : "$solar_panel_voltage" },
                    timestamp: { $first: "$asdf" },
                }
            },
            { $sort : { "_id" : 1 } },
            { $limit: 200 }
          ]
        )
        .then(users =>
          resp.send(JSON.stringify(users))
          /*
          callback(null, {
            statusCode: 200,
            body: JSON.stringify(users)
          })
          */
        )
        .catch(err => {
          console.log(err);
          resp.status(500).send('Could not fetch Solar data');
          /*
          callback(null, {
            statusCode: err.statusCode || 500,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Could not fetch the user.'
          })
          */
        })
    });

  const status = {
     "Status": "Running"
  };

  //response.send(status);
});

/*
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
*/

/*
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
*/

/*
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
*/
