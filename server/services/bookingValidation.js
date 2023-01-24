const { body } = require('express-validator');
//could not find a validator.js method to do this, so ill do it myself
let statuses = [
    "Processing",
    "Confirmed",
    "Cancelled",
    "Completed"
]
exports.isStatus = (status) => {
    return statuses.includes(status)
}
//validation criteria
exports.validateReservationData = [
    body('bookingdate').trim().isDate().withMessage('Not a valid date'),
    body('mobilenum').trim().isMobilePhone('en-AU').withMessage('Not a valid phone number'),
    body('numguests').trim().isNumeric().withMessage('Number of guests must be a number'),
]
exports.validateRestaurantData = [
    body('capacity').trim().isNumeric().withMessage('Capacity must be a number')
]
exports.isValidObjectID = (obj_id) => {
    //hex regex
    let re = /[0-9A-Fa-f]{24}/g;
    return re.test(obj_id);
}