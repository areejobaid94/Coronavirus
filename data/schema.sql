DROP TABLE IF EXISTS allCases;

CREATE TABLE allCases (
	id serial PRIMARY KEY,
	Country VARCHAR ( 250 ),
	CountryCode VARCHAR ( 250 ),
	TotalConfirmed VARCHAR ( 250 ),
	TotalDeaths VARCHAR ( 250 ),
    TotalRecovered VARCHAR ( 250 ),
    Date  VARCHAR ( 250 )
);
