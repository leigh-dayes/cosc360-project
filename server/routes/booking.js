//Set up Router
const express = require('express');
const router = express.Router();
const booking_controller = require('../controllers/bookingController');
const bookingValidator = require('../services/bookingValidation');

//SSE
router.get('/notification', booking_controller.booking_made_notification)
/**
 * @openapi
 * /bookings:
 *  post:
 *    summary: Add a reservation
 *    tags: [Reservations]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              restaurant:
 *                type: Schema.Types.ObjectId
 *                example: 6109dc9adcf23a013990701d
 *              bookingdate:
 *                type: string
 *                example: 2021-07-27
 *              bookingtime:
 *                type: string
 *                example: 11:00am - 12:00pm
 *              numguests:
 *                type: number
 *                example: 20
 *              username:
 *                type: string
 *                example: I.M. Hungry
 *              mobilenum:
 *                type: string
 *                example: 0400000000
 *              specreq:
 *                type: string
 *                example: Require a high chair
 *    consumes:
 *      - application/json
 *    produces: 
 *      - application/json
 *    responses:
 *      201:
 *        description: Returns a booking
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                _id: 
 *                  type: Schema.Types.ObjectId
 *                  example: 6110d97db6211501cedf64b6
 *                restaurant:
 *                  type: Schema.Types.ObjectId
 *                  example: 6109dc9adcf23a013990701d
 *                bookingdate:
 *                  type: string
 *                  example: 2021-07-27
 *                bookingtime:
 *                  type: string
 *                  example: 11:00am - 12:00pm
 *                numguests:
 *                  type: number
 *                  example: 20
 *                username:
 *                  type: string
 *                  example: I.M. Hungry
 *                mobilenum:
 *                  type: string
 *                  example: 0400000000
 *                specreq:
 *                  type: string
 *                  example: Require a high chair
 *                __v:
 *                  type: integer
 *                  format: int64
 *      400:
 *        description: Returns an error array
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                errors:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      value: 
 *                        type: string
 *                        example: req.body.restaurant
 *                      msg:
 *                        type: string
 *                        example: Not a valid object ID
 *                      param:
 *                        type: string
 *                        example: restaurant
 *                      location:
 *                        type: string
 *                        example: body
 */
router.post('/bookings', bookingValidator.validateReservationData, booking_controller.create_booking); //requires validation
/**
 * @openapi
 * /admin:
 *  post:
 *    summary: Add a restaurant
 *    tags: [Admin]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              restaurant_name:
 *                type: string
 *                example: Happy Burgers
 *              restaurant_location:
 *                type: string
 *                example: Betoota, QLD
 *              restaurant_image:
 *                type: string
 *                example: burgers.jpg
 *              capacity:
 *                type: number
 *                example: 35
 *              available_times:
 *                type: array
 *                example: [11:00am - 12:00pm, 12:00pm - 1:00pm, 1:00pm - 2:00pm]
 *    consumes:
 *      - application/json
 *    produces: 
 *      - application/json
 *    responses:
 *      201:
 *        description: Returns a restaurant
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                available_times: 
 *                  type: array
 *                  example: [11:00am - 12:00pm, 12:00pm - 1:00pm, 1:00pm - 2:00pm]
 *                _id:
 *                  type: Schema.Types.ObjectId
 *                  example: 61119931d6061302bc7dda7a
 *                restaurant:
 *                  type: Schema.Types.ObjectId
 *                  example: 6109dc9adcf23a013990701d
 *                restaurant_name:
 *                  type: string
 *                  example: Happy Burgers
 *                restaurant_location:
 *                  type: string
 *                  example: Betoota, QLD
 *                restaurant_image:
 *                  type: string
 *                  example: burgers.jpg
 *                capacity:
 *                  type: number
 *                  example: 35
 *                __v:
 *                  type: integer
 *                  format: int64
 *      500:
 *        description: Server Error
 */
router.post('/admin', bookingValidator.validateRestaurantData, booking_controller.create_restaurant);
/**
 * @openapi
 * /bookings:
 *  get:
 *    summary: Return all existing reservations
 *    tags: [Reservations]
 *    produces: 
 *      - application/json
 *    parameters: []
 *    responses:
 *      200:
 *        description: Returns an array of reservations
 *        content:
 *          application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    _id: 
 *                      type: Schema.Types.ObjectId
 *                      example: 6110d97db6211501cedf64b6
 *                    restaurant:
 *                      type: object
 *                      properties:
 *                        available_times: 
 *                          type: array
 *                          example: [11:00am - 12:00pm, 12:00pm - 1:00pm, 1:00pm - 2:00pm]
 *                        _id:
 *                          type: Schema.Types.ObjectId
 *                          example: 61119931d6061302bc7dda7a
 *                        restaurant:
 *                          type: Schema.Types.ObjectId
 *                          example: 6109dc9adcf23a013990701d
 *                        restaurant_name:
 *                          type: string
 *                          example: Happy Burgers
 *                        restaurant_location:
 *                          type: string
 *                          example: Betoota, QLD
 *                        restaurant_image:
 *                          type: string
 *                          example: burgers.jpg
 *                        capacity:
 *                          type: number
 *                          example: 35
 *                        __v:
 *                          type: integer
 *                          format: int64
 *                    bookingdate:
 *                      type: string
 *                      example: 2021-07-27
 *                    bookingtime:
 *                      type: string
 *                      example: 11:00am - 12:00pm
 *                    numguests:
 *                      type: number
 *                      example: 20
 *                    username:
 *                      type: string
 *                      example: I.M. Hungry
 *                    mobilenum:
 *                      type: string
 *                      example: 0400000000
 *                    specreq:
 *                      type: string
 *                      example: Require a high chair
 *                    __v:
 *                      type: integer
 *                      format: int64
 *      404:
 *        description: Returns an error array
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                errors:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      value: 
 *                        type: string
 *                        example: reservations
 *                      msg:
 *                        type: string
 *                        example: No reservations saved
 *                      param:
 *                        type: string
 *                        example: _id
 *                      location:
 *                        type: string
 *                        example: database
 */
router.get('/bookings', booking_controller.read_booking_all);
/**
 * @openapi
 * /bookings/{reservation_id}:
 *  get:
 *    summary: Return a reservation by ID
 *    tags: [Reservations]
 *    produces: 
 *      - application/json
 *    parameters:
 *    - name: reservation_id
 *      in: path
 *      description: ID of the reservation to be returned
 *      required: true
 *      type: ObjectId
 *    responses:
 *      200:
 *        description: Returns a reservation
 *        content:
 *          application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    _id: 
 *                      type: Schema.Types.ObjectId
 *                      example: 6110d97db6211501cedf64b6
 *                    restaurant:
 *                      type: object
 *                      properties:
 *                        available_times: 
 *                          type: array
 *                          example: [11:00am - 12:00pm, 12:00pm - 1:00pm, 1:00pm - 2:00pm]
 *                        _id:
 *                          type: Schema.Types.ObjectId
 *                          example: 61119931d6061302bc7dda7a
 *                        restaurant:
 *                          type: Schema.Types.ObjectId
 *                          example: 6109dc9adcf23a013990701d
 *                        restaurant_name:
 *                          type: string
 *                          example: Happy Burgers
 *                        restaurant_location:
 *                          type: string
 *                          example: Betoota, QLD
 *                        restaurant_image:
 *                          type: string
 *                          example: burgers.jpg
 *                        capacity:
 *                          type: number
 *                          example: 35
 *                        __v:
 *                          type: integer
 *                          format: int64
 *                    bookingdate:
 *                      type: string
 *                      example: 2021-07-27
 *                    bookingtime:
 *                      type: string
 *                      example: 11:00am - 12:00pm
 *                    numguests:
 *                      type: number
 *                      example: 20
 *                    username:
 *                      type: string
 *                      example: I.M. Hungry
 *                    mobilenum:
 *                      type: string
 *                      example: 0400000000
 *                    specreq:
 *                      type: string
 *                      example: Require a high chair
 *                    __v:
 *                      type: integer
 *                      format: int64
 *      404:
 *        description: Returns an error array
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                errors:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      value: 
 *                        type: string
 *                        example: req.params.id
 *                      msg:
 *                        type: string
 *                        example: No booking found for the requested ID
 *                      param:
 *                        type: ObjectId
 *                        example: _id
 *                      location:
 *                        type: string
 *                        example: params
 */
router.get('/bookings/:id', booking_controller.read_booking_id);
/**
 * @openapi
 * /restaurants:
 *  get:
 *    summary: Return all restaurants
 *    tags: [Restaurants]
 *    produces: 
 *      - application/json
 *    parameters: []
 *    responses:
 *      200:
 *        description: Returns an array of restaruants
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                available_times: 
 *                  type: array
 *                  example: [11:00am - 12:00pm, 12:00pm - 1:00pm, 1:00pm - 2:00pm]
 *                _id:
 *                  type: Schema.Types.ObjectId
 *                  example: 61119931d6061302bc7dda7a
 *                restaurant:
 *                  type: Schema.Types.ObjectId
 *                  example: 6109dc9adcf23a013990701d
 *                restaurant_name:
 *                  type: string
 *                  example: Happy Burgers
 *                restaurant_location:
 *                  type: string
 *                  example: Betoota, QLD
 *                restaurant_image:
 *                  type: string
 *                  example: burgers.jpg
 *                capacity:
 *                  type: number
 *                  example: 35
 *                __v:
 *                  type: integer
 *                  format: int64
 *      404:
 *        description: Returns an error array
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                errors:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      value: 
 *                        type: string
 *                        example: restaurant
 *                      msg:
 *                        type: string
 *                        example: No restaurants saved
 *                      param:
 *                        type: string
 *                        example: _id
 *                      location:
 *                        type: string
 *                        example: database
 */
router.get('/restaurants', booking_controller.read_restaurants_all);
/**
 * @openapi
 * /restaurants/{restaurant_id}:
 *  get:
 *    summary: Return a restaurant by ID
 *    tags: [Restaurants]
 *    produces: 
 *      - application/json
 *    parameters:
 *    - name: restaurant_id
 *      in: path
 *      description: ID of the restaurant to be returned
 *      required: true
 *      type: ObjectId
 *    responses:
 *      200:
 *        description: Returns a restaurant
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                available_times: 
 *                  type: array
 *                  example: [11:00am - 12:00pm, 12:00pm - 1:00pm, 1:00pm - 2:00pm]
 *                _id:
 *                  type: Schema.Types.ObjectId
 *                  example: 61119931d6061302bc7dda7a
 *                restaurant:
 *                  type: Schema.Types.ObjectId
 *                  example: 6109dc9adcf23a013990701d
 *                restaurant_name:
 *                  type: string
 *                  example: Happy Burgers
 *                restaurant_location:
 *                  type: string
 *                  example: Betoota, QLD
 *                restaurant_image:
 *                  type: string
 *                  example: burgers.jpg
 *                capacity:
 *                  type: number
 *                  example: 35
 *                __v:
 *                  type: integer
 *                  format: int64
 *      404:
 *        description: Returns an error array
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                errors:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      value: 
 *                        type: string
 *                        example: req.params.id
 *                      msg:
 *                        type: string
 *                        example: No booking found for the requested ID
 *                      param:
 *                        type: string
 *                        example: _id
 *                      location:
 *                        type: string
 *                        example: params
 */
router.get('/restaurants/:id', booking_controller.read_restaurants_id);
/**
 * @openapi
 * /bookings/{reservation_id}:
 *  put:
 *    summary: Update a reservation by ID
 *    tags: [Reservations]
 *    parameters:
 *    - name: reservation_id
 *      in: path
 *      description: ID of the reservation to be updated
 *      required: true
 *      type: ObjectId
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              restaurant:
 *                type: Schema.Types.ObjectId
 *                example: 6109dc9adcf23a013990701d
 *              bookingtime:
 *                type: string
 *                example: 11:00am - 12:00pm
 *              numguests:
 *                type: number
 *                example: 20
 *              username:
 *                type: string
 *                example: I.M. Hungry
 *              mobilenum:
 *                type: string
 *                example: 0400000000
 *              specreq:
 *                type: string
 *                example: Require a high chair
 *    consumes:
 *      - application/json
 *    responses:
 *      200:
 *        description: OK
 *      404:
 *        description: Returns an error array
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                errors:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      value: 
 *                        type: string
 *                        example: req.body.restaurant
 *                      msg:
 *                        type: string
 *                        example: it appears we dont have a restaurant with that ID
 *                      param:
 *                        type: string
 *                        example: restaurant
 *                      location:
 *                        type: string
 *                        example: body
 *      400:
 *        description: Returns an error array
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                errors:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      value: 
 *                        type: string
 *                        example: req.body.numguests
 *                      msg:
 *                        type: string
 *                        example: number of guests exceeds base capacity of this restaurant
 *                      param:
 *                        type: string
 *                        example: numguests
 *                      location:
 *                        type: string
 *                        example: body
 */
router.put('/bookings/:id', bookingValidator.validateReservationData, booking_controller.update_booking); 
/**
 * @openapi
 * /admin/{restaurant_id}:
 *  put:
 *    summary: Update an existing restaurant by ID
 *    tags: [Admin]
 *    parameters:
 *    - name: restaurant_id
 *      in: path
 *      description: ID of the restaurant to be updated
 *      required: true
 *      type: ObjectId
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              restaurant_name:
 *                type: string
 *                example: Happy Burgers
 *              restaurant_location:
 *                type: string
 *                example: Betoota, QLD
 *              restaurant_image:
 *                type: string
 *                example: burgers.jpg
 *              capacity:
 *                type: number
 *                example: 35
 *              available_times:
 *                type: array
 *                example: [11:00am - 12:00pm, 12:00pm - 1:00pm, 1:00pm - 2:00pm]
 *    consumes:
 *      - application/json
 *    responses:
 *      200:
 *        description: OK
 *      201:
 *        description: Returns a restaurant
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                available_times: 
 *                  type: array
 *                  example: [11:00am - 12:00pm, 12:00pm - 1:00pm, 1:00pm - 2:00pm]
 *                _id:
 *                  type: Schema.Types.ObjectId
 *                  example: 61119931d6061302bc7dda7a
 *                restaurant:
 *                  type: Schema.Types.ObjectId
 *                  example: 6109dc9adcf23a013990701d
 *                restaurant_name:
 *                  type: string
 *                  example: Happy Burgers
 *                restaurant_location:
 *                  type: string
 *                  example: Betoota, QLD
 *                restaurant_image:
 *                  type: string
 *                  example: burgers.jpg
 *                capacity:
 *                  type: number
 *                  example: 35
 *                __v:
 *                  type: integer
 *                  format: int64
 *      400:
 *        description: Returns an error array
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                errors:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      value: 
 *                        type: string
 *                        example: req.params.id
 *                      msg:
 *                        type: string
 *                        example: unable to update restaurant
 *                      param:
 *                        type: string
 *                        example: restaurant
 *                      location:
 *                        type: string
 *                        example: params
 */
router.put('/admin/:id', bookingValidator.validateRestaurantData, booking_controller.update_restaurant); //requires validation
/**
 * @openapi
 * /bookings/{reservation_id}:
 *  delete:
 *    summary: Delete a reservation by ID
 *    tags: [Reservations]
 *    parameters:
 *    - name: reservation_id
 *      in: path
 *      description: ID of the reservation to be deleted
 *      required: true
 *      type: ObjectId
 *    responses:
 *      200:
 *        description: OK
 *      400:
 *        description: Returns an error array
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                errors:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      value: 
 *                        type: string
 *                        example: req.params.id
 *                      msg:
 *                        type: string
 *                        example: this reservation does not exist
 *                      param:
 *                        type: string
 *                        example: _id
 *                      location:
 *                        type: string
 *                        example: params
 */
router.delete('/bookings/:id', booking_controller.delete_booking);
/**
 * @openapi
 * /admin/{restaurant_id}:
 *  delete:
 *    summary: Remove a restaurant by ID
 *    tags: [Admin]
 *    parameters:
 *    - name: restaurant_id
 *      in: path
 *      description: ID of the restaurant to be deleted
 *      required: true
 *      type: ObjectId
 *    responses:
 *      200:
 *        description: OK
 *      400:
 *        description: Returns an error array
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                errors:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      value: 
 *                        type: string
 *                        example: req.params.id
 *                      msg:
 *                        type: string
 *                        example: this restaurant does not exist
 *                      param:
 *                        type: string
 *                        example: _id
 *                      location:
 *                        type: string
 *                        example: params
 */
router.delete('/admin/:id', booking_controller.delete_restaurant);
//this will be an admin page for adding restaurants client-side



module.exports = router;