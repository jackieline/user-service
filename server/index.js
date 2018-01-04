const express = require('express');
const bodyParser = require('body-parser');
const db = require('../database-mysql');
const promise = require('bluebird');
const sqs = require('../aws/sqs.js');
const pricing = require('../ext-services/pricingService.js');
const redis = require('../cache-redis');

let app = express();

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({ extended: false }));


//set up endpoints here

app.post('/api/v1/userEstimate', function({body}, res) {
	//call to pricing service with body.origin, body.destination
	//wait for response from pricing
	//throw info from pricing and body into db
	console.log('userEstimate', body)
	pricing.fareEstimate(body.origin, body.destination, (err, results) => {
		if (err) {
			res.send(err);
		} else {
			let price = results[0];
			let surgePricingRate = results[1];
			db.rideEstimate(body.sessionId, body.userId, body.rideEvent, body.rideType, body.requestTimestamp, body.origin, body.destination, price, surgePricingRate, (err, results) => {
				if (err) {
					res.send(err);
				}
			});
			res.json(results);
		}
	})
});

app.post('/api/v1/userBooking', function({body}, res) {
	let eventId;
	redis.getEventId( (err, event) => {
		if (err) {
			res.send(err);
		} else {
			eventId = event;
			db.userInfo(body.userId, (err, user) => {
				if (err) {
					res.send(err);
				} else {
					let userRes = user[0];
					sqs.message(eventId, userRes.firstName, userRes.phoneNumber, userRes.userRating, body.rideType, body.origin, body.destination, (err, result) => {
						if (err) {
							res.send(err);
						} else {
							redis.addActiveRide( (err, reply) => {
								if (err) {
									res.send(err);
								}
							});
							db.rideRequest(body.sessionId, body.userId, body.rideEvent, body.rideType, body.requestTimestamp, body.origin, body.destination, body.driverId, body.price, body.surgePricingRate, (err, data) => {
								if (err) {
									res.send(err);
								} else {
									res.send(data);
								}
							});
						}
					});
				}
			});
		}
	});
});	



app.get('/api/v1/userBooking?:eventId', (req, res) => {
	//check cache for eventId to see if driver has been matched yet
	// console.log('does this reach userBooking get endpoint?', req.query.eventId)
	redis.getBookedRide(req.query.eventId, (err, data) => {
		if (err) {
  		res.sendStatus(200);
		} else {
			res.end(data);
		}
	});
});

app.post('/api/v1/ride/booked', function({body}, res) {
	//response from booking service
	// console.log('hello from bookings!', body.eventId, body.driverId)
	db.updateDriver(body.eventId, body.driverId, function (err, data) {
		if (err) {
			res.sendStatus(400);
		} else {
		redis.setBookedRide(body);
		redis.incEventId( (err, incremented) => {
			if (err) {
				res.send(err);
			}
		});
		res.end();
		};
	});
});

app.get('/', function(req, res) {
	console.log(req);
	
  res.sendStatus(200);
});

app.patch('/api/v1/ride/done', function(req, res) {
	// console.log('this is the put route for done rides');
	redis.minusActiveRide((err, reply) => {
		if (err) {
			res.send(err);
		} else {
			res.end();
		}
	});
});

app.patch('/api/v1/cancel?:eventId', function(req, res) {
	//patch to db
	//call db function
	console.log('this is the params cancel call', req.query.eventId);
	let eventId = req.query.eventId;
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

//working booking route to AWS SQS
// app.post('/api/v1/userBooking', function({body}, res) {
// console.log('this is the body', body)
// 	let eventId;
// 	db.rideRequest(body.sessionId, body.userId, body.rideEvent, body.rideType, body.requestTimestamp, body.origin, body.destination, body.driverId, body.price, body.surgePricingRate, (err, results) => {
// 		if (err) {
// 			res.send(err);
// 		} else {
// 			//get eventId
// 			db.eventId( (err, id) => {
// 				if (err) {
// 					res.send(err);
// 				} else {
// 					eventId = id[0]['LAST_INSERT_ID()'];
// 					db.userInfo(body.userId, (err, user) => {
// 						if (err) {
// 							res.send(err);
// 						} else {
// 							let userRes = user[0];
// 							sqs.message(eventId, userRes.firstName, userRes.phoneNumber, userRes.userRating, body.rideType, body.origin, body.destination, (err, result) => {
// 								if (err) {
// 									res.send(err);
// 								} else {
// 									redis.addActiveRide( (err, reply) => {
// 									  if (err) {
// 										  res.send(err);
// 									  } else {
// 								  		res.json(reply);
// 								  	}	
// 								  });
// 								}
// 							})
// 						}
// 					})
// 				}
// 			});
// 		}
// 	});
// });