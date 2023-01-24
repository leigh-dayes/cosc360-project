const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReservationSchema = new Schema({
    restaurant: {
        type: Schema.Types.ObjectId,
        ref: 'Restaurant',
        require: true
    },
    status: {
        type: String,
        require: true
    },
    bookingdate: {
        //was going to use date data type but was proving to be overly complicated to match with
        type: String,
        require: true
    },
    bookingtime: {
        type: String,
        require: true
    },
    numguests: {
        type: Number,
        require:true
    },
    username: {
        type: String,
        require: true
    },
    mobilenum: { 
        type: String,
        require: true
    },
    specreq: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model('Reservation', ReservationSchema);