const AWS = require('aws-sdk');
require('dotenv').config();
AWS.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_KEY,
	region: 'us-west-1'
});

let sqs = new AWS.SQS({apiVersion: '2012-11-05'});


const message = (eventId, firstName, phoneNumber, userRating, rideType, origin, destination, callback) => {
	let params = {
	DelaySeconds: 0,
	MessageAttributes: {
		"EventId": {
			DataType: "Number",
			StringValue: `${eventId}`
		},
		"userFirstName": {
			DataType: "String",
			StringValue: `${firstName}`
		},
		"userPhoneNumber": {
			DataType: "String",
			StringValue: `${phoneNumber}`
		},
		"userRating": {
			DataType: "Number",
			StringValue: `${userRating}`
		},
		"rideType": {
			DataType: "String",
			StringValue: `${rideType}`
		},
		"origin": {
			DataType: "String",
			StringValue: `${origin}`
		},
		"destination": {
			DataType: "String",
			StringValue: `${destination}`
		}
	},
	MessageBody: "Current Ride Requests",
	QueueUrl: "https://sqs.us-west-1.amazonaws.com/603629433953/Oober_Service-Booking_Queue"
	};
	sqs.sendMessage(params, (err, data) => {
		if (err) {
			console.log("Error!!!!!", err);
			callback(err, null);
		} else {
			console.log("Success", data.MessageId);
			callback(null, data.MessageId);
		}
	});
};

module.exports.message = message;	