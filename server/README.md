# How to use the server

- Install [Docker](https://www.docker.com/products/docker-desktop) and [Docker Compose](https://docs.docker.com/compose/install/) on your machine.
- In the terminal, run the command `docker-compose up -d` or `docker compose up -d` in the `dropbeartable` directory.
- install mongoDB Compass and use the connection string mongodb://admin:password@localhost:27017/
- from the home screen click on 'create database' enter the database name 'test' and collection name 'restaurants'
- from the home screen click on the newly created 'test' database, then click on the collection 'restaurants'
- from the restaurants collection page click on 'ADD DATA' a drop down menu will appear click on 'import file'
- click 'browse' from the pop up menu and select the 'restaurants.json' file found in the server folder and click 'DONE'
- the restaurants database is now populated.

# REST API

| Method | API endpoints | Description |
|--------|---------------|-------------|
| POST   | /bookings     | Create a new reservation | 
| POST   | /admin        | Create a new restaurant | 
| GET    | /bookings     | View all existing reservations | 
| GET    | /bookings/:id | View existing reservation with ID "id" | 
| GET 	 | /restaurants  | View all existing restaurants | 
| GET    | /restaurants/:id | View existing restaurant with ID "id" | 
| PUT    | /bookings/:id | Update existing reservation with ID "id" | 
| PUT    | /admin/:id    | Update existing restaurant with ID "id" | 
| DELETE | /bookings/:id | Delete existing reservation with ID "id" | 
| DELETE | /admin/:id    | Delete existing restaurant with ID "id" | 

for further information see the OpenApi docs at http://localhost:3000/docs

# Notification section

in addition to the above endpoints there is an SSE endpoint for notifying clients when someone has made a booking, this will be fully implemented by the client side, as per the tutorial

# Test

there are two simple tests in booking.test.js that test a regex for validating that the user has sent a syntactically correct Object ID

# commands to test the API

- we start by returning all restaurants in the DB to test to see if our DB upload was successfull

curl --location --request GET 'http://localhost:3000/restaurants' \
--data-raw ''

- we can then add a new restaurant to the restaurant DB 

curl --location --request POST 'http://localhost:3000/admin' \
--header 'Content-Type: application/json' \
--data-raw '{
	"restaurant_name": "testaurant",
	"restaurant_location": "Betoota, QLD",
	"restaurant_image": "burger.jpg",
	"capacity": 35,
	"available_times": ["11:00am - 12:00pm", "12:00pm - 1:00pm", "6:00pm - 7:00pm", "7:00pm - 8:00pm", "8:00pm - 9:00pm"]
}'

- we can also return just a single restaurant by ID, lets return "happy burgers" with the ID 6109dc9adcf23a013990701d

curl --location --request GET 'http://localhost:3000/restaurants/6109dc9adcf23a013990701d' \
--data-raw ''

- we can also delete a restaurant by ID, lets delete "happy burgers"

curl --location --request DELETE 'http://localhost:3000/admin/6109dc9adcf23a013990701d' \
--data-raw ''

- to make sure our delete worked, try and return "happy burgers" again and should get an error response as it does not exist anymore 

curl --location --request GET 'http://localhost:3000/restaurants/6109dc9adcf23a013990701d' \
--data-raw ''

- we can also update a restaurant by ID, lets update "zolipasta" with ID 6109e1dd9eeb470171aa29f6 to include a new available time "1:00pm - 2:00pm"

curl --location --request PUT 'http://localhost:3000/admin/6109e1dd9eeb470171aa29f6' \
--header 'Content-Type: application/json' \
--data-raw '{
        "available_times": [
            "11:00am - 12:00pm",
            "12:00pm - 1:00pm",
            "1:00pm - 2:00pm",
            "6:00pm - 7:00pm",
            "7:00pm - 8:00pm",
            "8:00pm - 9:00pm"
        ],
        "restaurant_name": "zolipasta",
        "restaurant_location": "Betoota, QLD",
        "restaurant_image": "pasta.jpg",
        "capacity": 60
    }'

- we can then return it to see the update went through

curl --location --request GET 'http://localhost:3000/restaurants/6109e1dd9eeb470171aa29f6' \
--data-raw ''

- now that we have played around with the restaurant DB we will move to the reservation DB, and begin with creating a reservation at zolis

curl --location --request POST 'http://localhost:3000/bookings' \
--header 'Content-Type: application/json' \
--data-raw '{
	"restaurant": "6109e1dd9eeb470171aa29f6",
	"status": "Processing",
	"bookingdate": "2021-07-28",
	"bookingtime": "12:00pm - 1:00pm",
	"numguests": 30,
	"username": "I.M. Hungry",
	"mobilenum": "0423555383",
	"specreq": "high chair for infant"
}'

- we can now make another booking for the same restaurant, date and time but try and exceed the capacity (60 for zolis) of the restaurant and see if it fails

curl --location --request POST 'http://localhost:3000/bookings' \
--header 'Content-Type: application/json' \
--data-raw '{
	"restaurant": "6109e1dd9eeb470171aa29f6",
	"status": "Processing",
	"bookingdate": "2021-07-28",
	"bookingtime": "12:00pm - 1:00pm",
	"numguests": 33,
	"username": "We Hungry",
	"mobilenum": "0423555383",
	"specreq": ""
}'

- we are however able to book the above group into a different time slot on the same day

curl --location --request POST 'http://localhost:3000/bookings' \
--header 'Content-Type: application/json' \
--data-raw '{
	"restaurant": "6109e1dd9eeb470171aa29f6",
	"status": "Processing",
	"bookingdate": "2021-07-28",
	"bookingtime": "1:00pm - 2:00pm",
	"numguests": 33,
	"username": "We Hungry",
	"mobilenum": "0423555383",
	"specreq": ""
}'

- and/or the same timeslot on a different day 

curl --location --request POST 'http://localhost:3000/bookings' \
--header 'Content-Type: application/json' \
--data-raw '{
	"restaurant": "6109e1dd9eeb470171aa29f6",
	"status": "Processing",
	"bookingdate": "2021-07-29",
	"bookingtime": "12:00pm - 1:00pm",
	"numguests": 33,
	"username": "We Hungry",
	"mobilenum": "0423555383",
	"specreq": ""
}'

- we can now return all the above successful bookings

curl --location --request GET 'http://localhost:3000/bookings' \
--data-raw ''

- or a single booking by ID, note: the id used is an ObjectID generated on my machine, you may need to enter your own

curl --location --request GET 'http://localhost:3000/bookings/6113309c8bd959022582240f' \
--data-raw ''

- we can modify a booking aswell, but the server will check to make sure the updated booking does not exceed the capacity of the restaurant
note: the id used is an ObjectID generated on my machine, you may need to enter your own

curl --location --request PUT 'http://localhost:3000/bookings/6113309c8bd959022582240f' \
--header 'Content-Type: application/json' \
--data-raw '{
    "restaurant": "6109e1dd9eeb470171aa29f6",
	"status": "Processing",
    "bookingdate": "2021-07-29",
    "bookingtime": "12:00pm - 1:00pm",
    "numguests": 61,
    "username": "We Hungry",
    "mobilenum": "0423555383",
    "specreq": ""
}'

- that will fail as it exceeds the capacity of the restaurant, let's try a valid update note: the id used is an ObjectID generated on my machine, you may need to enter your own

curl --location --request PUT 'http://localhost:3000/bookings/6113309c8bd959022582240f' \
--header 'Content-Type: application/json' \
--data-raw '{
    "restaurant": "6109e1dd9eeb470171aa29f6",
	"status": "Processing",
    "bookingdate": "2021-07-29",
    "bookingtime": "12:00pm - 1:00pm",
    "numguests": 13,
    "username": "We Hungry",
    "mobilenum": "0423555383",
    "specreq": "Less people now"
}'

and finally we can delete a reservation note: the id used is an ObjectID generated on my machine, you may need to enter your own

curl --location --request DELETE 'http://localhost:3000/bookings/6113309c8bd959022582240f' \
--data-raw ''

# Further API testing

- on top of the server-side validation that stop's overbooking at restaurants which was demonstrated above, this program provides the following
	- ID in params or body is MongDB ObjectID validation
	- capacity and numguests are numerical validation
	- mobilenum is a mobile number validation
	- date is a date validation
	- restaurant exists validation
	- reservation exists validation
	- status validation

