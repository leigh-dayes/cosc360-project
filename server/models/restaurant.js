const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RestaurantSchema = new Schema({
    restaurant_name: {
        type: String,
        require: true
    },
    restaurant_location: {
        type: String,
        require: true
    },
    //try and implement if have the time
    restaurant_image: String,
    capacity: {
        type: Number,
        require: true
    },
    available_times: {
        type: [String],
        require: true
    }
})

module.exports = mongoose.model('Restaurant', RestaurantSchema);
