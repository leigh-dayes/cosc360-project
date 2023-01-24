<template>
    <div class="container-fluid maincontainer">
        <Banner />
        <ExistingReservations :reservations="this.$store.state.reservations" />
    </div>
</template>

<script>
import Banner from '../components/Banner.vue'
import ExistingReservations from '../components/ExistingReservations.vue'

export default {
    name: 'Existing',
    components: {
        Banner,
        ExistingReservations
    },
    data() {
        return {
        }
    },
    created() {
        this.$store.dispatch('initReservations')
    }
}
</script>
