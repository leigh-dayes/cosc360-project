<template>
    <div class="container-fluid maincontainer">
        <Banner />
        <RestaurantRow :restaurants="this.$store.state.restaurants" />
        <BarGraph :data="this.$store.getters.reservationData" />
    </div>
</template>

<script>
import Banner from '../components/Banner.vue'
import RestaurantRow from '../components/RestaurantRow.vue'
import BarGraph from '../components/BarGraph.vue'

export default {
    name: 'Homepage',
    components: {
        Banner,
        RestaurantRow,
        BarGraph
    },
    data() {
        return {
            initialValues: [230, 308, 520, 130, 950]
        }
    },
    created() {
        this.$store.dispatch('initRestaurants'),
        this.$store.dispatch('initReservations')
    }
}
</script>
