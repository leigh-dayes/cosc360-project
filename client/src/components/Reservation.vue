<script>
export default {
    name: 'Reservation',
    props: {
        booking_id: {
            type: String,
            required: true
        },
        id: {
            type: String,
            required: true
        },
        restaurant_name: {
            type: String,
            required: true
        },
        date: {
            type: String,
            required: true
        },
        time: {
            type: String,
            required: true
        },
        num_guests: {
            type: Number,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        phone_number: {
            type: String,
            required: true
        },
        special_requests: {
            type: String,
            required: true
        },
        available_times: {
            type: Array,
            required: true
        },
        capacity: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            status: "Confirmed"
        }
    },
    methods: {
        edit() {
            let payload = {
                booking_id: this.booking_id,
                _id: this.id,
                restaurant_name: this.restaurant_name,
                bookingdate: this.date,
                bookingtime: this.time,
                numguests: this.num_guests,
                username: this.username,
                mobilenum: this.phone_number,
                specreq: this.special_requests,
                available_times: this.available_times,
                capacity: this.capacity
            }
            this.status = "Pending"
            this.$store.dispatch('updateCurrentReservation', payload)
            .then(this.$router.push({ name: 'Edit' }))
        },
        deleteBooking() {
            let payload = {
                booking_id: this.booking_id,
                _id: this.id,
                restaurant_name: this.restaurant_name,
                bookingdate: this.date,
                bookingtime: this.time,
                numguests: this.num_guests,
                username: this.username,
                mobilenum: this.phone_number,
                specreq: this.special_requests,
                available_times: this.available_times,
                capacity: this.capacity
            }
            this.status = "Cancelled"
            this.$store.dispatch('updateCurrentReservation', payload)
            .then(this.$store.dispatch('deleteReservation'))
            .then(this.$store.dispatch('initReservations'))
        }
    }
}
</script>

<template>
<tr>
    <td>
        <button type="button" class="btn btn-outline-primary" @click="edit">
            <i class="bi bi-pencil-square"></i>
        </button>
    </td>
    <td>
        <button type="button" class="btn btn-outline-danger" @click="deleteBooking">
            <i class="bi bi-x-circle"></i>
        </button>
    </td>
    <td>{{ restaurant_name }}</td>
    <td>{{ date }}</td>
    <td>{{ time }}</td>
    <td>{{ num_guests }}</td>
    <td>{{ username }}</td>
    <td>{{ phone_number }}</td>
    <td>{{ special_requests }}</td>
    <td>{{ status }}</td>
</tr>
</template>
<style>

</style>