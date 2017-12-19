'use strict';

module.exports = {
  generateRandomData
};

const Faker = require('faker');
const casual = require('casual');

function generateRandomData(userContext, events, done) {
  // generate data with Faker:
  let addresses = ['944 Market Street, SF, CA', 'Ferry Building, SF, CA', 'California Academy of Sciences, SF, CA', 'Lands End, SF, CA', 'Chrissy Field, SF, CA', 'San Francisco Zoo', 'Coit Tower, SF, CA', 'Lombard Street, SF, CA', 'AT&T Park, SF, CA', 'Dynamo Donut & Coffee, SF, CA'];
  let events1 = ['fare estimate', 'ride request'];
  let rides = ['XL','UberX', 'Select', 'POOL', 'Black'];
  let surges = [1, 2, 2, 1, 3, 1, 2, 1];
  const sessionId = Math.floor((Math.random() * (1000000)));
	const userId = Math.floor((Math.random() * (100000)));
	const rideEvent = events1[(Math.ceil(Math.random() * events1.length - 1))];
	const rideType = rides[(Math.ceil(Math.random() * rides.length - 1))];
	const requestTimestamp = `${casual.date()} ${casual.time()}`;
	const origin = addresses[Math.ceil(Math.random() * addresses.length)];
	const destination = addresses[Math.ceil(Math.random() * addresses.length - 1)];
	const driverId = Math.ceil(Math.random() * 100000000);
	const price = (Math.random() * (35 - 5) + 5).toFixed(2);
	const surgePricingRate = surges[(Math.ceil(Math.random() * surges.length - 1))];
  // add variables to virtual user's context:
  userContext.vars.sessionId = sessionId;
  userContext.vars.userId = userId;
  userContext.vars.rideEvent = rideEvent;
  userContext.vars.rideType = rideType;
  userContext.vars.requestTimestamp = requestTimestamp;
  userContext.vars.origin = origin;
  userContext.vars.destination = destination;
  userContext.vars.driverId = driverId;
  userContext.vars.price = price;
  userContext.vars.surgePricingRate = surgePricingRate;
  // continue with executing the scenario:
  return done();
}