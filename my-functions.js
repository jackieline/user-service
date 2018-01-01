'use strict';

module.exports = {
  generateRandomData
};

const Faker = require('faker');
const casual = require('casual');

function generateRandomData(userContext, events, done) {
  // generate timestamp with casual:
  const year = '2017';
  let months = [10, 11, 12];
  let days = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
  let addresses = ['944 Market Street, SF, CA', 'Ferry Building, SF, CA', 'California Academy of Sciences, SF, CA', 'Lands End, SF, CA', 'Chrissy Field, SF, CA', 'San Francisco Zoo, SF, CA', 'Coit Tower, SF, CA', 'Lombard Street, SF, CA', 'AT&T Park, SF, CA', 'Dynamo Donut & Coffee, SF, CA'];
  let random = Math.ceil(Math.random() * addresses.length - 1);
  let events1 = ['fare estimate', 'ride request', 'fare estimate'];
  let rides = ['XL','UberX', 'Select', 'POOL', 'Black', 'UberX', 'POOL'];
  let surges = [1, 2, 2, 1, 3, 1, 2, 1, 1];
  const sessionId = Math.floor((Math.random() * (1000000)));
	const userId = Math.floor((Math.random() * (100000)));
	const rideEvent = events1[(Math.ceil(Math.random() * events1.length - 1))];
	const rideType = rides[(Math.ceil(Math.random() * rides.length - 1))];
	const requestTimestamp = (() => { 
	  let month = months[(Math.ceil(Math.random() * months.length - 1))];
	  let day;
	  if (month === 11) {
	    let novDays = days.slice(0);
	    novDays.pop();
	    day = novDays[(Math.ceil(Math.random() * novDays.length - 1))];
	  } else {
	    day = days[(Math.ceil(Math.random() * days.length - 1))];
	  }
	    return `${year}-${month}-${day} ${casual.time()}`;
	  }) ();
	const origin = addresses[random];
	addresses.splice(random, 1);
	const destination = addresses[Math.ceil(Math.random() * addresses.length - 1)];
	const driverId = (() => {
    if (rideEvent === events[0] || rideEvent === events[2]) {
      return 'NULL';
    }  
      return Math.ceil(Math.random() * 100000000);
    }) ();  
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