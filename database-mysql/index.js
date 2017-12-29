const mysql = require('mysql');
const mysqlConfig = require('./config.js');

let connection = mysql.createConnection(mysqlConfig);

//removed user login
// const userCheck = function(userName, password, callback) {
// 	connection.query(`select * from users where userName=${userName}`, (err, user) => {
// 		if (err) {
// 			callback(err, null);
// 		} else {
// 			callback(null, user);
// 		}
// 	})
// }

const rideEstimate = (sessionId, userId, rideEvent, rideType, requestTimestamp, origin, destination, price, surgePricingRate, callback) => {
	let query = 'insert into history (sessionId, userId, rideEvent, rideType, requestTimestamp, origin, destination, price, surgePricingRate) values (?, ?, ?, ?, ?, ?, ?, ?, ?)';
	let values = [sessionId, userId, rideEvent, rideType, requestTimestamp, origin, destination, price, surgePricingRate];
	connection.query(query, values, (err, results) => {
		if (err) {
			console.log(err);
		} else {
			console.log(results);
		}
	});
}

const rideRequest = (sessionId, userId, rideEvent, rideType, requestTimestamp, origin, destination, driverId, price, surgePricingRate, callback) => {
	let query = 'insert into history (sessionId, userId, rideEvent, rideType, requestTimestamp, origin, destination, driverId, price, surgePricingRate) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
	let values = [sessionId, userId, rideEvent, rideType, requestTimestamp, origin, destination, driverId, price, surgePricingRate];
	connection.query(query, values, (err, results) => {
		if (err) {
			console.log(err);
		} else {
			console.log(results);
		}
	});
}

const cancel = (eventId, callback) => {
	connection.query(`update history set rideType='cancelled' where eventId=${eventId}`, (err, results) => {
		if (err) {
			console.log(err);
		} else {
			console.log(results);
		}
	});
}

const updateDriver = (eventId, driverId, callback) => {
	connection.query(`update history set driverId = ${driverId} where eventId = ${eventId}`, (err, results) => {
		if (err) {
			console.log(err);
		} else {
			console.log(results);
		}
	});
}

// module.exports.userCheck = userCheck;
module.exports.rideEstimate = rideEstimate;
module.exports.rideRequest = rideRequest;
module.exports.cancel  = cancel; 
module.exports.updateDriver = updateDriver;