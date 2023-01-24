<script>
import Reservation from './Reservation.vue'

export default {
    name: 'ExistingReservations',
    components: {
        Reservation
    },
    props: {
        reservations: [Object, Array]
    }
}
</script>

<template>
<div class="reservation_table">
    <table class="table table-hover table-responsive" id="confirmedBookings">
        <thead>
            <tr>
                <th class="col">Edit</th>
                <th class="col">Delete</th>
                <th scope="col">Restaurant</th>
                <th scope="col">Date</th>
                <th scope="col">Time</th>
                <th scope="col">No. Guests</th>
                <th scope="col">Username</th>
                <th scope="col">Mobile No.</th>
                <th scope="col">Special Requests</th>
                <th scope="col">Status</th>
            </tr>
        </thead>
        <tbody>
            <Reservation v-for="res in reservations" :key="res._id"
                :booking_id="res._id"
                :id="res.restaurant._id"
                :restaurant_name="res.restaurant.restaurant_name"
                :date="res.bookingdate"
                :time="res.bookingtime"
                :num_guests="res.numguests"
                :username="res.username"
                :phone_number="res.mobilenum"
                :special_requests="res.specreq"
                :available_times="res.restaurant.available_times"
                :capacity="res.restaurant.capacity" />
        </tbody>
    </table>
</div>
</template>