<template>
    <div class="container-fluid maincontainer">
        <Banner />
        <SSE />
        <BookingForm :restaurant="this.$store.getters.getCurrent" />
    </div>
</template>

<script>
import Banner from '../components/Banner.vue'
import BookingForm from '../components/BookingForm.vue'
import SSE from '../components/SSE.vue'

export default {
    name: 'Create',
    components: {
        Banner,
        BookingForm,
        SSE
    },
    data () {
        return {
        }
    }
}
</script>
