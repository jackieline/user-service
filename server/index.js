const express = require('express');
const bodyParser = require('body-parser');
const db = require('../database-mysql');

let app = express();

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({ extended: false }));


//set up endpoints here

app.post('/api/v1/userEstimate', function({body}, res) {
	//call to pricing service with body.origin, body.destination
	//wait for response from pricing
	//throw info from pricing and body into db
	console.log('userEstimate', body)
	db.rideEstimate(body.sessionId, body.userId, body.rideEvent, body.rideType, body.requestTimestamp, body.origin, body.destination, body.price, body.surgePricingRate, (err, results) => {
		if (err) {
			console.log(err);
		}
	});
	let data = [body.price, body.surgePricingRate];
	res.json(data);
});

app.post('/api/v1/userBooking', function({body}, res) {
console.log('this is the body', body)
	db.rideRequest(body.sessionId, body.userId, body.rideEvent, body.rideType, body.requestTimestamp, body.origin, body.destination, body.driverId, body.price, body.surgePricingRate, (err, results) => {
		if (err) {
			console.log(err);
		}
	});
	res.sendStatus(201);
});

app.get('api/v1/userBooking', function({body}, res) {
	//response from booking queue
	  //send update info to user
	  //update DB with price

  res.sendStatus(200);
});

app.get('/', function({body}, res) {
	
  res.sendStatus(200);
});

app.put('api/v1/ride', function(req, res) {

  res.sendStatus(200);
});

app.put('api/v1/cancel/:eventId', function(req, res) {
	//patch to db
	//call db function
	let eventId = req.eventId;
	db.cancel(eventId, (err, results) => {
		if (err) {
			res.json(err);
		} else {
			res.sendStatus(201);
		}
	});
});


app.listen(3000, function() {
	console.log(' ʕ´• ᴥ •`ʔ listening on port 3000! ʕ´• ᴥ •`ʔ ')
});