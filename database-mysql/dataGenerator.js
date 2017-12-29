const faker = require('faker');
const casual = require('casual');
const mysql = require('mysql');
const mysqlConfig = require('./config.js');
const fs = require('fs');
const csvWriter = require('csv-write-stream');
let writer;

const connection = mysql.createConnection(mysqlConfig);

const seedUsers = () => {
    console.time('jax');
	let count = 0;
  for (let i = 0; i < 300000; i++) {
  	let email = faker.internet.email();
  	let password = faker.internet.password();
 	  let firstName = faker.name.firstName();
    let lastName = faker.name.lastName();
    let phoneNumber = faker.phone.phoneNumberFormat(1);
    let userRating = (Math.random() * (5 - 3.5) + 3.5).toFixed(1);
    const queryString = 'insert into users (email, password, firstName, lastName, phoneNumber, userRating) values (?, ?, ?, ?, ?, ?)';
    const values = [email, password, firstName, lastName, phoneNumber, userRating];
    connection.query(queryString, values, function (err, results) {
    	if (err) {
    		console.log(err);
    	} else {
    		count++;
    	}
    });
	}
};

seedUsers();
const year = '2017';
let months = [10, 11, 12];
let days = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
// const fakeHistory = () => {
//   console.time('jax');

  
//   let events = ['fare estimate', 'ride request'];
//   let rides = ['XL','UberX', 'Select', 'POOL', 'Black'];
//   let surges = [1, 2, 2, 1, 3, 1, 2, 1];
//   for (let j = 0; j < 60000; j++) {
//     let addresses = ['944 Market Street, SF, CA', 'Ferry Building, SF, CA', 'California Academy of Sciences, SF, CA', 'Lands End, SF, CA', 'Chrissy Field, SF, CA', 'San Francisco Zoo, SF, CA', 'Coit Tower, SF, CA', 'Lombard Street, SF, CA', 'AT&T Park, SF, CA', 'Dynamo Donut & Coffee, SF, CA'];
//     let random = Math.ceil(Math.random() * addresses.length - 1);
//     let sessionId = Math.floor((Math.random() * (1000000)));
//     let userId = Math.floor((Math.random() * (100000)));
//     let rideEvent = events[(Math.ceil(Math.random() * events.length - 1))];
//     let rideType = rides[(Math.ceil(Math.random() * rides.length - 1))];
//     let requestTimestamp = (() => { 
//       let month = months[(Math.ceil(Math.random() * months.length - 1))];
//       let day;
//       if (month === 11) {
//         let novDays = days.slice(0);
//         novDays.pop();
//         day = novDays[(Math.ceil(Math.random() * novDays.length - 1))];
//       } else {
//         day = days[(Math.ceil(Math.random() * days.length - 1))];
//       }
//         return `${year}-${month}-${day} ${casual.time()}`;
//       }) ();
//     let origin = addresses[random];
//     addresses.splice(random, 1);
//     let destination = addresses[Math.ceil(Math.random() * addresses.length - 1)];
//     let driverId = (() => {
//       if (rideEvent === events[0]) {
//         return 'NULL';
//       }  
//         return Math.ceil(Math.random() * 100000000);
//       }) ();  
//     let price = (Math.random() * (35 - 5) + 5).toFixed(2);
//     let surgePricingRate = surges[(Math.ceil(Math.random() * surges.length - 1))];
//     if (!fs.existsSync('history.txt') ) {
//       writer = csvWriter({headers: ['sessionId', 'userId', 'rideEvent', 'rideType', 'requestTimestamp', 'origin', 'destination', 'driverId', 'price', 'surgePricingRate']});  
//       writer.pipe(fs.createWriteStream('history.txt')); 
//       writer.write([sessionId, userId, rideEvent, rideType, requestTimestamp, origin, destination, driverId, price, surgePricingRate]);
//       writer.end(); 
//     } else {
//       let writer = csvWriter({sendHeaders: false});  
//       writer.pipe(fs.createWriteStream('history.txt', {flags: 'a'})); 
//       writer.write({
//         sessionId: sessionId,
//         userId: userId,
//         rideEvent: rideEvent,
//         rideType: rideType,
//         requestTimestamp: requestTimestamp,
//         origin: origin,
//         destination: destination,
//         driverId: driverId,
//         price: price, 
//         surgePricingRate: surgePricingRate
//       });
//       writer.end();   
//     }
 //    const queryString1 = 'insert into history(sessionId, userId, rideEvent, rideType, requestTimestamp, origin, destination, driverId, price, surgePricingRate) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
 //    const values1 = [sessionId, userId, rideEvent, rideType, requestTimestamp, origin, destination, driverId, price, surgePricingRate];
 //    connection.query(queryString1, values1, function(err, results) {
 //      if (err) {
 //    	console.log(err);
 //      } 
	// });
    // let file = './history.csv';
    // connection.query("load data infile 'history.csv' into table history fields terminated by ', lines terminated by '\n' ignore 1 lines", function(err, results) {
    //   if (err) {
    //     console.log(err);
    //   } 
    // });
//   }
// }

// fakeHistory();
console.timeEnd('jax');