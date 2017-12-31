const express = require('express');
const bodyParser = require('body-parser');
const db = require('../database-mysql');
const redis = require('redis');
const promise = require('bluebird');
promise.promisifyAll(redis.RedisClient.prototype);
promise.promisifyAll(redis.Multi.prototype);
const client = redis.createClient();
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-1'});

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
	let eventId;
	db.rideRequest(body.sessionId, body.userId, body.rideEvent, body.rideType, body.requestTimestamp, body.origin, body.destination, body.driverId, body.price, body.surgePricingRate, (err, results) => {
		if (err) {
			console.log(err);
		} else {
			//get eventId
			db.eventId( (err, res) => {
				if (err) {
					console.log(err);
				} else {
					db.userInfo(body.userId, (err, user) => {
						if (err) {
							console.log(err);
						} else {
							let userRes = JSON.parse(user);
							eventId = res;
							let sqs = new AWS.SQS({apiVersion: '2012-11-05'});
							let params = {
								DelaySeconds: 0,
								MessageAttributes: {
									"EventId": {
										DataType: "Number",
										StringValue: `${eventId}`
									},
									"userFirstName": {
										DataType: "String",
										StringValue: `${userRes.firstName}`
									},
									"userPhoneNumber": {
										DataType: "String",
										StringValue: `${userRes.phoneNumber}`
									},
									"userRating": {
										DataType: "Number",
										StringValue: `${userRes.userRating}`
									},
									"rideType": {
										DataType: "String",
										StringValue: `${body.rideEvent}`
									},
									"origin": {
										DataType: "String",
										StringValue: `${body.origin}`
									},
									"destination": {
										DataType: "String",
										StringValue: `${body.destination}`
									}
								},
								MessageBody: "Current Ride Requests",
								QueueUrl: "https://sqs.us-west-1.amazonaws.com/603629433953/Oober_Service-Booking_Queue"
							};
							sqs.sendMessage(params, (err, data) => {
								if (err) {
									console.log("Error", err);
									res.sendStatus(400);
								} else {
									console.log("Success", data.MessageId);
									res.end(data.MessageId);
								}
							});
						}
					})
				}
			});
		}
	});
	client.incr('count', (err, reply) => {
		if (err) {
			console.log(err);
		}
	});
	res.sendStatus(201);
});

app.get('api/v1/userBooking', ({body}, res) => {
	//check cache for eventId to see if driver has been matched yet
	client.getAsync(body.eventId).then(data => {
		if (data !== 'nil') {
			res.end(JSON.stringify(data));
		} else {
  		res.sendStatus(200);
		}
	})
});

app.put('api/v1/ride/booked', function({body}, res) {
	//response from booking service
	db.updateDriver(body.eventId, body.driverId, function (err, data) {
		if (err) {
			res.sendStatus(400);
		} else {
		client.setAsync(body.eventId, JSON.stringify(body), 'EX', 7200);
		res.end();
		};
	});
});

app.get('/', function({body}, res) {
	
  res.sendStatus(200);
});

app.put('api/v1/ride/done', function(req, res) {
	client.decr('count', (err, reply) => {
		if (err) {
			console.log(err);
		}
	});
  res.end();
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