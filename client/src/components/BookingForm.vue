<script>
import BookingTimes from './BookingTimes.vue'
    
export default {
    name: 'BookingForm',
    components: {
        BookingTimes
    },
    props: {
        restaurant: Object
    },
    data() {
        return {
            status: "Processing",
            bdate: null,
            btime: null,
            bnum: null,
            buser: null,
            bspec: null,
            bmob: null,
            errors: []
        }
    },
    methods: {
        confirmBooking() {
            this.errors = []
            //some validation
            if (this.btime === null)
                this.errors.push("Please enter a booking time")
            if (!this.errors.length) {
                let payload = {
                    restaurant: this.restaurant.id,
                    status: "Processing",
                    bookingdate: this.bdate,
                    bookingtime: this.btime,
                    numguests: this.bnum,
                    username: this.buser,
                    mobilenum: this.bmob,
                    specreq: this.bspec
                }
                this.$store.dispatch('createReservation', payload)
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
    <form class="p-3" id="bookingform" onsubmit="event.preventDefault(); validateBooking();" @submit="confirmBooking">
		<h2 class="sub">Let's Eat at {{ $store.getters.getCurrent.restaurant_name }}</h2>
		<h3 class="sub">Enter Booking details</h3>
        <div class="row">
		<div class="col mb-3">
			<label for="bookingdate" class="form-label">Date</label>
			<input type="date" class="form-control" id="bookingdate" v-model="bdate" required>
		</div>
		<div class="col mb-3">
			<label for="bookingtime" class="form-label">Time</label>
			<select id="bookingtime" class="form-control" v-model="btime">
				<option selected="" required>Time</option>
				<BookingTimes v-for="time in this.$store.getters.getCurrent.available_times" :key="time"
                    :time="time" />
			</select>
        </div>
		</div>
        <div class="row">
		<div class="mb-3 col">
			<label for="numguests" class="form-label">Number of guests</label>
			<input type="number" class="form-control" id="numguests" placeholder="2" min="1" :max="this.restaurant.capacity" v-model="bnum" required>
		</div>
		<div class="mb-3 col">
			<label for="username" class="form-label">Username</label>
			<input type="text" class="form-control" id="username" placeholder="Karen" v-model="buser" required>
		</div>
		<div class="mb-3 col">
			<label for="mobilenum" class="form-label">Mobile Number</label>
			<input type="tel" class="form-control" id="mobilenum" placeholder="04########" pattern="04[0-9]{8}" v-model="bmob" required>
		</div>
        </div>
		<div class="mb-3">
			<label for="specreq" class="form-label">Special Requests</label>
			<textarea class="form-control" id="specreq" placeholder="Require a high chair for infant..." v-model="bspec"></textarea>
		</div>
		<button type="submit" class="btn btn-primary btn-dark">Confirm Booking</button>
	</form>
    <!-- Toast Notifications -->
    <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
        <div id="pendingToast" class="toast hide" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
        
        <strong class="me-auto">🐨 DropBearTable</strong>
        <small>Just now</small>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
        Your booking has been sent to the restaurant for confirmation..
        </div>
    </div>
    </div>
</div>
</template>

<style>
.booking {
    background-color: #BFCBC2;
}
</style>