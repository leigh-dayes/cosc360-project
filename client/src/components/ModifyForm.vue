<script>
import BookingTimes from './BookingTimes.vue'
export default {
    name: 'ModifyForm',
    components: {
        BookingTimes
    },
    props: {
        booking: Object
    },
    data () {
        return {
            btime: null,
            bdate: null,
            bguests: null,
            buser: null,
            bmob: null,
            bspec: null,
            errors: []
        }
    },
    methods: {
        updateBooking() {
            this.errors = []
            //some validation
            if (this.btime === null)
                this.errors.push("Please enter a booking time")
            if (!this.errors.length) {
                let payload = {
                    restaurant: this.booking._id,
                    status: "Processing",
                    bookingdate: this.bdate,
                    bookingtime: this.btime,
                    numguests: this.bguests,
                    username: this.buser,
                    mobilenum: this.bmob,
                    specreq: this.bspec
                }
                this.$store.dispatch('updateReservation', payload)
                .then(this.$store.dispatch('initReservations'))
                .then(this.$router.push({ name: 'Existing' }))
            }
        }
    },
    mounted() {
        //only allow bookings 2 weeks in advance
        let dateEl = document.getElementById("bookingdate")
        let date = new Date()
        //min date
        let year = date.getFullYear()
        let month = date.getMonth() +1
        let day = date.getDate()
        if (month < 10) { month = "0" + month}
        if (day < 10) { day = "0" + day}
        let ymdmin = year + "-" + month + "-" + day
        dateEl.setAttribute("min", ymdmin)
        //max date
        date.setDate(date.getDate()+14)
        let yearmax = date.getFullYear()
        let monthmax = date.getMonth() +1
        let daymax = date.getDate()
        if (monthmax < 10) { monthmax = "0" + monthmax}
        if (daymax < 10) { daymax = "0" + daymax}
        let ymdmax = yearmax + "-" + monthmax + "-" + daymax
        dateEl.setAttribute("max", ymdmax)
    }
}
</script>

<template>
<div>
    <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
        <li v-for="error in errors" :key="error">{{ error }}</li>
        </ul>
    </p>
    <form class="p-3" id="bookingform" onsubmit="event.preventDefault(); validateBooking();" @submit="updateBooking">
		<h2 class="sub">Your booking at {{ booking.restaurant_name }}</h2>
		<h3 class="sub">Edit Booking details</h3>
        <div class="row">
		<div class="col mb-3">
			<label for="bookingdate" class="form-label">Date</label>
			<input type="date" class="form-control" id="bookingdate" v-model="bdate" :placeholder="booking.bookingdate" required>
		</div>
		<div class="col mb-3">
			<label for="bookingtime" class="form-label">Time</label>
			<select id="bookingtime" v-model="btime" class="form-control">
				<option selected="">{{ booking.bookingtime }}</option>
				<BookingTimes v-for="time in booking.available_times" :key="time"
                    :time="time" />
			</select>
        </div>
		</div>
        <div class="row">
		<div class="mb-3 col">
			<label for="numguests" class="form-label">Number of guests</label>
			<input type="number" class="form-control" v-model="bguests" id="numguests" :placeholder="booking.numguests" min="1" :max="booking.capacity" required>
		</div>
		<div class="mb-3 col">
			<label for="username" class="form-label">Username</label>
			<input type="text" class="form-control" id="username" v-model="buser" :placeholder="booking.username" required>
		</div>
		<div class="mb-3 col">
			<label for="mobilenum" class="form-label">Mobile Number</label>
			<input type="tel" class="form-control" id="mobilenum" v-model="bmob" :placeholder="booking.mobilenum" pattern="04[0-9]{8}" required>
		</div>
        </div>
		<div class="mb-3">
			<label for="specreq" class="form-label">Special Requests</label>
			<textarea class="form-control" id="specreq" v-model="bspec" :placeholder="booking.special_requests"></textarea>
		</div>
		<button type="submit" class="btn btn-primary btn-dark" >Confirm Update</button>
	</form>
</div>
</template>

