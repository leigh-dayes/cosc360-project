<template>
    <div class="container-fluid maincontainer">
        <Banner />
        <ModifyForm :booking="this.$store.state.currentReservation" />
    </div>
</template>

<script>
import Banner from '../components/Banner.vue'
import ModifyForm from '../components/ModifyForm.vue'

export default {
    name: 'Edit',
    components: {
        Banner,
        ModifyForm
    },
    data() {
        return {
        }
    }
}
</script>
