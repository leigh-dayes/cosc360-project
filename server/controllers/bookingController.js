const Reservation = require('../models/reservation');
const Restaurant = require('../models/restaurant')
const { validationResult } = require('express-validator');
const { isValidObjectID, isStatus } = require('../services/bookingValidation');
// client list for SSE notifications 
let clients = [];
// send events to all clients
const sendEvents = (newBooking) => {
    clients.forEach(client => client.res.write(`event: bookingCreated\ndata: ${JSON.stringify(newBooking)}\n\n`))
}

//Create a booking
exports.create_booking = async (req, res) => {
    let errors = validationResult(req)
    //Check for client data errors
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    //make sure supplied restaurant id is a valid Object ID
    if (!isValidObjectID(req.body.restaurant)){
        let err1 = {
            "value": req.body.restaurant,
            "msg": "Not a valid object ID",
            "param": "restaurant",
            "location": "body"
        }
        return res.status(400).json({errors: [err1]})
    }
    // make sure valid status
    if (!isStatus(req.body.status)){
        let err1 = {
            "value": req.body.status,
            "msg": "Not a valid status",
            "param": "status",
            "location": "body"
        }
        return res.status(400).json({errors: [err1]})
    }
    //check to see if booking restaurant ID is valid
    let is_restaurant = await Restaurant.findById(req.body.restaurant).exec();
    //return error if so
    if (!is_restaurant) {
        let err = {
            "value": req.body.restaurant,
            "msg": "it appears we dont have a restaurant with that ID",
            "param": "restaurant",
            "location": "body"
        }
        return res.status(400).json({errors: [err]});
    }else {
        // check booking against base capacity
        let under_cap = is_restaurant.capacity - req.body.numguests
        if (under_cap < 0) {
            let err = {
                "value": req.body.numguests,
                "msg": "number of guests exceeds base capacity of this restaurant",
                "param": "numguests",
                "location": "body"
            }
            return res.status(400).json({errors: [err]})
        }
        // get time of proposed booking
        let time_of_booking = req.body.bookingtime;
        //make sure restaurant takes bookings at that time
        let open_during = is_restaurant.available_times.includes(time_of_booking);
        if(!open_during){
            let err = {
                "value": req.body.bookingtime,
                "msg": "this restaurant is not open during the requested time",
                "param": "booking time",
                "location": "body"
            }
            return res.status(400).json({errors: [err]})
        }
        // assume no current reservations 
        let current_reservations = false;
        let restaurant_reservations = false;
        // check to see if there is atleast one other booking for this restaurant at this time and date
        let other_bookings = await Reservation.findOne({ restaurant: req.body.restaurant, bookingtime: req.body.bookingtime, bookingdate: req.body.bookingdate});
        //aggregate to get count of all existing bookings at proposed bookign time.
        console.log(other_bookings)
        if (other_bookings != null) {
            current_reservations = await Reservation.aggregate().
                    match({bookingtime: time_of_booking}).
                    match({bookingdate: req.body.bookingdate}).
                    group({_id: '$restaurant', count: { $sum: '$numguests'}});
                    // filter for only the restaurant of interest
                    restaurant_reservations = current_reservations.filter(res => res._id == req.body.restaurant);
        } 
        //if there are existing reservations at this restaurant
        if (restaurant_reservations) {
            // check if there is enough space for the new booking
            let has_space = is_restaurant.capacity - restaurant_reservations[0].count - req.body.numguests;
            // return error if not enough space
            if (has_space < 0) {
                let err = {
                    "value": req.body.numguests,
                    "msg": "it appears this restaurant does not have space for this many at guest at the specified time",
                    "param": "number of guests",
                    "location": "body"
                }
                return res.status(400).json({errors: [err]});
            }
        }
        //if no errors create booking object
        let reservation = new Reservation({
            restaurant: is_restaurant._id,
            status: req.body.status,
            bookingdate: req.body.bookingdate,
            bookingtime: req.body.bookingtime,
            numguests: req.body.numguests,
            username: req.body.username,
            mobilenum: req.body.mobilenum,
            specreq: req.body.specreq
        })
        //save booking
        let complete_reservation = await reservation.save();
        if (complete_reservation) {
            res.status(201).json(complete_reservation)
            return sendEvents(complete_reservation)
        }
        //In case something went wrong
        return res.status(400).json({errors: [err]})
    }
}


//Read an existing restaurant by id
exports.read_restaurants_id = async (req, res) => {
    //make sure hexadecimal and 12 bytes
    if (!isValidObjectID(req.params.id)){
        let err1 = {
            "value": req.params.id,
            "msg": "Not a valid object ID",
            "param": "_id",
            "location": "params"
        }
        return res.status(400).json({errors: [err1]})
    }
    //if its a valid length ID try finding it
    let existing_restaurant = await Restaurant.findById(req.params.id).exec();
    if (existing_restaurant) {
        return res.status(200).json(existing_restaurant);
    }
    //valid length but not present in DB
    let err = {
        "value": req.params.id,
        "msg": "No booking found for the requested ID",
        "param": "_id",
        "location": "params"
    }
    return res.status(404).json({errors: [err]})
    
}

//Read an existing booking by id
exports.read_booking_id = async (req, res) => {
    //make sure hexadecimal and 12 bytes
    if (!isValidObjectID(req.params.id)){
        let err1 = {
            "value": req.params.id,
            "msg": "Not a valid object ID",
            "param": "_id",
            "location": "params"
        }
        return res.status(400).json({errors: [err1]})
    }
    //if its a valid length ID try finding it
    let existing_reservation = await Reservation.findById(req.params.id).populate('restaurant').exec();
    if (existing_reservation) {
        return res.status(200).json(existing_reservation);
    }
    //valid length but not present in DB
    let err = {
        "value": req.params.id,
        "msg": "No booking found for the requested ID",
        "param": "_id",
        "location": "params"
    }
    return res.status(404).json({errors: [err]})
    
}


//Return all reservations
exports.read_booking_all = async (req, res) => {
    let existing_reservations = await Reservation.find().populate('restaurant').exec();
    if (existing_reservations) {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
        return res.status(200).json(existing_reservations);
    }
    let err = {
        "value": "reservations",
        "msg": "No reservations saved",
        "param": "_id",
        "location": "database"
    }
    return res.status(404).json({errors: [err]})  
}


//Update a reservation
exports.update_booking = async (req, res) => {
    let errors = validationResult(req)
    //Check for client data errors
    if (!errors.isEmpty()) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.status(400).json({errors: errors.array()})
    }
    //make sure valid hex 12 byte
    if(isValidObjectID(req.params.id)){
        // make sure valid status
        if (!isStatus(req.body.status)){
            let err1 = {
                "value": req.body.status,
                "msg": "Not a valid status",
                "param": "status",
                "location": "body"
            }
            res.setHeader('Access-Control-Allow-Origin', '*');
            return res.status(400).json({errors: [err1]})
        }
        //make sure the reservation exists before updating
        let existing_reservation = await Reservation.findById(req.params.id).exec();
        if (existing_reservation) {
            //check if restaurant, date, time or number of guests has changed
            let rest_change = req.body.restaurant == existing_reservation.restaurant;
            let date_change = req.body.bookingdate === existing_reservation.bookingdate;
            let time_change = req.body.bookingtime === existing_reservation.bookingtime;
            let num_change = req.body.numguests === existing_reservation.numguests;
            if (rest_change || date_change || time_change || num_change) {
                //check database to ensure restaurant has capaictiy at this time
                //check to see if booking restaurant ID is valid
                let is_restaurant = await Restaurant.findById(req.body.restaurant).exec();
                //return error if so
                if (!is_restaurant) {
                    let err = {
                        "value": req.body.restaurant,
                        "msg": "it appears we dont have a restaurant with that ID",
                        "param": "restaurant",
                        "location": "body"
                    }
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    return res.status(404).json({errors: [err]});
                }else {
                    // check booking against base capacity
                    let under_cap = is_restaurant.capacity - req.body.numguests
                    if (under_cap < 0) {
                        let err = {
                            "value": req.body.numguests,
                            "msg": "number of guests exceeds base capacity of this restaurant",
                            "param": "numguests",
                            "location": "body"
                        }
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        return res.status(400).json({errors: [err]})
                    }
                    // get time of proposed booking
                    let time_of_booking = req.body.bookingtime;
                    //make sure restaurant takes bookings at that time
                    let open_during = is_restaurant.available_times.includes(time_of_booking);
                    if(!open_during){
                        let err = {
                            "value": req.body.bookingtime,
                            "msg": "this restaurant is not open during the requested time",
                            "param": "booking time",
                            "location": "body"
                        }
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        return res.status(400).json({errors: [err]})
                    }
                    // assume no current reservations 
                    let current_reservations = false;
                    let restaurant_reservations = false;
                    // check to see if there is atleast one other booking for this restaurant at this time and date
                    let other_bookings = await Reservation.findOne({ restaurant: req.body.restaurant, bookingtime: req.body.bookingtime, bookingdate: req.body.bookingdate});
                    //aggregate to get count of all existing bookings at proposed bookign time.
                    console.log(other_bookings)
                    if (other_bookings != null) {
                        current_reservations = await Reservation.aggregate().
                                match({bookingtime: time_of_booking}).
                                match({bookingdate: req.body.bookingdate}).
                                group({_id: '$restaurant', count: { $sum: '$numguests'}});
                                // filter for only the restaurant of interest
                                restaurant_reservations = current_reservations.filter(res => res._id == req.body.restaurant);
                    } 
                    //if there are existing reservations at this restaurant
                    if (restaurant_reservations) {
                        // check if there is enough space for the new booking
                        let has_space = is_restaurant.capacity - restaurant_reservations[0].count - req.body.numguests + existing_reservation.numguests;
                        // return error if not enough space
                        if (has_space < 0) {
                            let err = {
                                "value": req.body.numguests,
                                "msg": "it appears this restaurant does not have space for this many at guest at the specified time",
                                "param": "number of guests",
                                "location": "body"
                            }
                            res.setHeader('Access-Control-Allow-Origin', '*');
                            return res.status(400).json({errors: [err]});
                        }
                    }
                    //if no errors update booking object
                    await Reservation.updateOne({"_id": req.params.id}, 
                    {restaurant: req.body.restaurant,
                    status: req.body.status,
                    bookingdate: req.body.bookingdate, 
                    bookingtime: req.body.bookingtime,
                    numguests: req.body.numguests, 
                    username: req.body.username,
                    mobilenum: req.body.mobilenum, 
                    specreq: req.body.specreq}).exec();
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    return res.status(200).end();
                }
            }else {
                //else no chance of invalid booking
                await Reservation.updateOne({"_id": req.params.id}, 
                {restaurant: req.body.restaurant,
                status: req.body.status,
                bookingdate: req.body.bookingdate, 
                bookingtime: req.body.bookingtime,
                numguests: req.body.numguests, 
                username: req.body.username,
                mobilenum: req.body.mobilenum, 
                specreq: req.body.specreq}).exec();
                res.setHeader('Access-Control-Allow-Origin', '*');
                return res.status(200).end();
            }
        //not an existing reservation, so make one
        } else {
            let is_restaurant = await Restaurant.findById(req.body.restaurant).exec();
            //return error if so
            if (!is_restaurant) {
                let err = {
                    "value": req.body.restaurant,
                    "msg": "it appears we dont have a restaurant with that ID",
                    "param": "restaurant",
                    "location": "body"
                }
                res.setHeader('Access-Control-Allow-Origin', '*');
                return res.status(400).json({errors: [err]});
            }else {
                // check booking against base capacity
                let under_cap = is_restaurant.capacity - req.body.numguests
                if (!under_cap) {
                    let err = {
                        "value": req.body.numguests,
                        "msg": "number of guests exceeds base capacity of this restaurant",
                        "param": "numguests",
                        "location": "body"
                    }
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    return res.status(400).json({errors: [err]})
                }
                // get time of proposed booking
                let time_of_booking = req.body.bookingtime;
                //make sure restaurant takes bookings at that time
                let open_during = is_restaurant.available_times.includes(time_of_booking);
                if(!open_during){
                    let err = {
                        "value": req.body.bookingtime,
                        "msg": "this restaurant is not open during the requested time",
                        "param": "booking time",
                        "location": "body"
                    }
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    return res.status(400).json({errors: [err]})
                }
                // assume no current reservations 
                let current_reservations = false;
                let restaurant_reservations = false;
                // check to see if there is atleast one other booking for this restaurant at this time and date
                let other_bookings = await Reservation.findOne({ restaurant: req.body.restaurant, bookingtime: req.body.bookingtime, bookingdate: req.body.bookingdate});
                //aggregate to get count of all existing bookings at proposed bookign time.
                console.log(other_bookings)
                if (other_bookings != null) {
                    current_reservations = await Reservation.aggregate().
                            match({bookingtime: time_of_booking}).
                            match({bookingdate: req.body.bookingdate}).
                            group({_id: '$restaurant', count: { $sum: '$numguests'}});
                            // filter for only the restaurant of interest
                            restaurant_reservations = current_reservations.filter(res => res._id == req.body.restaurant);
                } 
                //if there are existing reservations at this restaurant
                if (restaurant_reservations) {
                    // check if there is enough space for the new booking
                    let has_space = is_restaurant.capacity - restaurant_reservations[0].count - req.body.numguests;
                    // return error if not enough space
                    if (has_space < 0) {
                        let err = {
                            "value": req.body.numguests,
                            "msg": "it appears this restaurant does not have space for this many at guest at the specified time",
                            "param": "number of guests",
                            "location": "body"
                        }
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        return res.status(400).json({errors: [err]});
                    }
                }
                //if no errors create booking object
                let reservation = new Reservation({
                    restaurant: is_restaurant._id,
                    status: req.body.status,
                    bookingdate: req.body.bookingdate,
                    bookingtime: req.body.bookingtime,
                    numguests: req.body.numguests,
                    username: req.body.username,
                    mobilenum: req.body.mobilenum,
                    specreq: req.body.specreq
                })
                //save booking
                let complete_reservation = await reservation.save();
                if (complete_reservation) {
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    return res.status(201).json(complete_reservation)
                }
                //In case something went wrong
                res.setHeader('Access-Control-Allow-Origin', '*');
                return res.status(400).json({errors: [err]})
            }
        }
    //else invalid object ID
    } else {
        let err = {
            "value": req.body._id,
            "msg": "unable to update reservation",
            "param": "reservation id",
            "location": "body"
        }
        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.status(400).json({errors: [err]})
    }
}


//Delete a reservation
exports.delete_booking = async (req, res) => {
    //make sure is valid hex 12byte
    if(isValidObjectID(req.params.id)) {
        let existing_reservation = await Reservation.findById(req.params.id).exec();
        if (existing_reservation) {
            await Reservation.deleteOne({"_id": req.params.id })
            return res.status(200).end();
        }
        else {
            let err = {
                "value": "reservation_id",
                "msg": "this reservation does not exist",
                "param": "id",
                "location": "URL"
            }
            return res.status(400).json({errors: [err]})
        }
    }
}


//Create restaurant using Admin page
exports.create_restaurant = async (req, res) => {
    let errors = validationResult(req)
    //Check for client data errors
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    //create new restaurant
    let restaurant = new Restaurant ({
        restaurant_name: req.body.restaurant_name,
        restaurant_location: req.body.restaurant_location,
        restaurant_image: req.body.restaurant_image,
        capacity: req.body.capacity,
        available_times: req.body.available_times
    });
    let entered_retaurant = await restaurant.save();
    if (entered_retaurant){
        return res.status(201).json(entered_retaurant);
    }
    //if not then server error
    return res.status(500).end();
}


//read all restaurants from restaurant DB
exports.read_restaurants_all = async (req, res) => {
    let existing_restaurants = await Restaurant.find().exec();
    if (existing_restaurants) {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
        return res.status(200).json(existing_restaurants);
    }
    let err = {
        "value": "restaurants",
        "msg": "No restaurants saved",
        "param": "_id",
        "location": "database"
    }
    return res.status(404).json({errors: [err]})  
}


//update existing restaurant
exports.update_restaurant = async (req, res) => {
    let errors = validationResult(req)
    //Check for client data errors
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    //make sure valid hex 12 byte
    if(isValidObjectID(req.params.id)){
        //make sure the restaurant exists before updating
        let existing_restaurant = await Restaurant.findById(req.params.id).exec();
        if (existing_restaurant) {
            //assume all data is sent back?
            await Restaurant.updateOne({"_id": req.params.id}, 
                {restaurant_name: req.body.restaurant_name,
                restaurant_location: req.body.restaurant_location,
                restaurant_image: req.body.restaurant_image,
                capacity: req.body.capacity,
                available_times: req.body.available_times}).exec();
            return res.status(200).end();
        }
        // if not an existing restaurant then create one
        else{
            let restaurant = new Restaurant({
                restaurant_name: req.body.restaurant_name,
                restaurant_location: req.body.restaurant_location,
                restaurant_image: req.body.restaurant_image,
                capacity: req.body.capacity,
                available_times: req.body.available_times
            });
            let complete_restaurant = await restaurant.save();
            if (complete_restaurant) {
                return res.status(201).json(complete_restaurant)
            }
        //In case something went wrong
        return res.status(400).json({errors: [err]})
        }
    } else {
        let err = {
            "value": req.params._id,
            "msg": "unable to update restaurant",
            "param": "restaurant id",
            "location": "params"
        }
        return res.status(400).json({errors: [err]})
    }
}


//delete existing restaurant
exports.delete_restaurant = async (req, res) => {
    if(isValidObjectID(req.params.id)) {
        let existing_restaurant = await Restaurant.findById(req.params.id).exec();
        if (existing_restaurant) {
            await Restaurant.deleteOne({"_id": req.params.id })
            return res.status(200).end();
        }
        else {
            let err = {
                "value": "restaurant_id",
                "msg": "this restaurant does not exist",
                "param": "id",
                "location": "URL"
            }
            return res.status(400).json({errors: [err]})
        }
    }
}


//SSE booking made notification
exports.booking_made_notification = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    console.log(res)

    const clientID = Date.now();

    const newClient = {
        id: clientID,
        res
    };

    clients.push(newClient);
    res.on('close', () => console.log('connection closed!'));
}
