const faker = require('faker');
const casual = require('casual');
const mysql = require('mysql');
const mysqlConfig = require('./config.js');

const connection = mysql.createConnection(mysqlConfig);

// const seedUsers = () => {
// 	let count = 0;
//   for (let i = 0; i < 300000; i++) {
//   	let email = faker.internet.email();
//   	let password = faker.internet.password();
//  	  let firstName = faker.name.firstName();
//     let lastName = faker.name.lastName();
//     let phoneNumber = faker.phone.phoneNumberFormat(1);
//     let userRating = (Math.random() * (5 - 3.5) + 3.5).toFixed(1);
//     const queryString = 'insert into users (email, password, firstName, lastName, phoneNumber, userRating) values (?, ?, ?, ?, ?, ?)';
//     const values = [email, password, firstName, lastName, phoneNumber, userRating];
//     connection.query(queryString, values, function (err, results) {
//     	if (err) {
//     		console.log(err);
//     	} else {
//     		count++;
//     	}
//     });
// 	}
// };

// seedUsers();

const fakeHistory = () => {
  let addresses = ['944 Market Street, SF, CA', 'Ferry Building, SF, CA', 'California Academy of Sciences, SF, CA', 'Lands End, SF, CA', 'Chrissy Field, SF, CA', 'San Francisco Zoo', 'Coit Tower, SF, CA', 'Lombard Street, SF, CA', 'AT&T Park, SF, CA', 'Dynamo Donut & Coffee, SF, CA'];
  let events = ['fare estimate', 'ride request'];
  let rides = ['XL','UberX', 'Select', 'POOL', 'Black'];
  let surges = [1, 2, 2, 1, 3, 1, 2, 1];
  for (let j = 0; j < 1; j++) {
    let sessionId = Math.floor((Math.random() * (1000000)));
    let userId = Math.floor((Math.random() * (100000)));
    let rideEvent = events[(Math.ceil(Math.random() * events.length - 1))];
    let rideType = rides[(Math.ceil(Math.random() * rides.length - 1))];
    let requestTimestamp = `${casual.date()} ${casual.time()}`;
    let origin = addresses[Math.ceil(Math.random() * addresses.length)];
    let destination = addresses[Math.ceil(Math.random() * addresses.length - 1)];
    let driverId = Math.ceil(Math.random() * 100000000);
    let price = (Math.random() * (35 - 5) + 5).toFixed(2);
    let surgePricingRate = surges[(Math.ceil(Math.random() * surges.length - 1))];
    const queryString1 = 'insert into history(sessionId, userId, rideEvent, rideType, requestTimestamp, origin, destination, driverId, price, surgePricingRate) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values1 = [sessionId, userId, rideEvent, rideType, requestTimestamp, origin, destination, driverId, price, surgePricingRate];
    connection.query(queryString1, values1, function(err, results) {
      if (err) {
    	console.log(err);
      } else {
    	console.log('success!');
      }
	});
  }
}

fakeHistory();