const mysql = require('mysql');
const mysqlConfig = require('./config.js');

let connection = mysql.createConnection(mysqlConfig);

//removed user login, changed to info for booking service
const userInfo = (userId, callback) => {
	connection.query(`select * from users where userId=${userId}`, (err, user) => {
		if (err) {
			callback(err, null);
		} else {
			callback(null, user);
		}
	});
}

const rideEstimate = (sessionId, userId, rideEvent, rideType, requestTimestamp, origin, destination, price, surgePricingRate, callback) => {
	let query = 'insert into history (sessionId, userId, rideEvent, rideType, requestTimestamp, origin, destination, price, surgePricingRate) values (?, ?, ?, ?, ?, ?, ?, ?, ?)';
	let values = [sessionId, userId, rideEvent, rideType, requestTimestamp, origin, destination, price, surgePricingRate];
	connection.query(query, values, (err, results) => {
		if (err) {
			callback(err, null);
		} else {
			callback(null, results);
		}
	});
}

const rideRequest = (sessionId, userId, rideEvent, rideType, requestTimestamp, origin, destination, driverId, price, surgePricingRate, callback) => {
	let query = 'insert into history (sessionId, userId, rideEvent, rideType, requestTimestamp, origin, destination, driverId, price, surgePricingRate) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
	let values = [sessionId, userId, rideEvent, rideType, requestTimestamp, origin, destination, driverId, price, surgePricingRate];
	connection.query(query, values, (err, results) => {
		if (err) {
			callback(err, null);
		} else {
			callback(null, results);
		}
	});
}

const cancel = (eventId, callback) => {
	connection.query(`update history set rideType='cancelled' where eventId=${eventId}`, (err, results) => {
		if (err) {
			callback(err, null);
		} else {
			callback(null, results);
		}
	});
}

const updateDriver = (eventId, driverId, callback) => {
	connection.query(`update history set driverId = ${driverId} where eventId = ${eventId}`, (err, results) => {
		if (err) {
			callback(err, null);
		} else {
			callback(null, results);
		}
	});
}

const eventId = callback => {
	connection.query('SELECT LAST_INSERT_ID()', (err, result) => {
		if (err) {
			callback(err, null);
		} else {
			callback(null, result);
		}
	});
}

module.exports.userInfo = userInfo;
module.exports.rideEstimate = rideEstimate;
module.exports.rideRequest = rideRequest;
module.exports.cancel  = cancel; 
module.exports.updateDriver = updateDriver;
module.exports.eventId = eventId;