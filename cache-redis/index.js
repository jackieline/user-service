const redis = require('redis');
const promise = require('bluebird');
promise.promisifyAll(redis.RedisClient.prototype);
promise.promisifyAll(redis.Multi.prototype);
const client = redis.createClient();

const addActiveRide = (cb) => {
	client.incr('count', (err, reply) => {
	  if (err) {
		  cb(err, null);
	  } else {
  		cb(null, reply);
  	}	
  });
}

const minusActiveRide = (cb) => {
	client.decr('count', (err, reply) => {
		if (err) {
			cb(err, null);
		} else {
			cb(null, reply);
		}
	});
}

const setBookedRide = (driverInfo) => {
  client.setAsync(driverInfo.eventId, JSON.stringify(driverInfo), 'EX', 7200);
}

const getBookedRide = (eventId, cb) => {
	client.getAsync(eventId).then(data => {
		if (data !== 'nil') {
			cb(null, JSON.stringify(data));
		} 
	});
}

const getEventId = (cb) => {
	client.get('eventId', (err, reply) => {
		if (err) {
			cb(err, null);
		} else {
			cb(null, reply);
		}
	});
}

const incEventId = (cb) => {
	client.incr('eventId', (err, reply) => {
	  if (err) {
		  cb(err, null);
	  } else {
  		cb(null, reply);
  	}	
  });
}

module.exports.addActiveRide = addActiveRide;
module.exports.minusActiveRide = minusActiveRide;
module.exports.setBookedRide = setBookedRide;
module.exports.getBookedRide = getBookedRide;
module.exports.getEventId = getEventId;
module.exports.incEventId = incEventId;
