
<script>
import Restaurant from './Restaurant.vue'

export default {
    name: 'RestaurantRow',
    components: {
        Restaurant
    },
    props: {
        restaurants: [Object, Array]
    }
}
</script>

<template>
<div class="row row mx-auto p-3">
    <h3>Book your night out here!</h3>
    <Restaurant v-for="item in restaurants" :key="item.restaurant_name"
        :restaurant_image="item.restaurant_image"
        :restaurant_name="item.restaurant_name"
        :restaurant_location="item.restaurant_location"
        :capacity ="item.capacity"
        :available_times="item.available_times"
        :id="item._id" />
</div>
</template>

<style>
.row {
    background-color: #BFCBC2;
}
</style>