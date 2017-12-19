DROP DATABASE IF EXISTS oober;

CREATE DATABASE oober;

USE oober;

CREATE TABLE users (
	userId int NOT NULL AUTO_INCREMENT,
	email varchar(50),
	password varchar(50),
	firstName varchar(20),
	lastName varchar(20),
	phoneNumber varchar(25),
	userRating double,
	PRIMARY KEY (userId)
);

CREATE TABLE history (
	eventId int NOT NULL AUTO_INCREMENT,
	sessionId int,
	userId int,
	rideEvent varchar(20),
	rideType varchar(20),
	requestTimestamp datetime,
	origin varchar(60),
	destination varchar(60),
	driverId int,
	price decimal(10, 2),
	surgePricingRate int,
	PRIMARY KEY (eventId)
);

ALTER TABLE history ADD FOREIGN KEY (userId) references users (userId);