<script>
export default {
    name: 'Restaurant',
    props: {
        restaurant_name: {
            type: String,
            required: true
        },
        restaurant_location: {
            type: String,
            required: true
        },
        restaurant_image: {
            type: String,
            required: true
        },
        capacity: {
            type: Number,
            required: true
        },
        available_times: {
            type: Array,
            required: true
        },
        id: {
            type: String,
            required: true
        }
    },
    methods : {
        newRestaurant() {
            let payload = {
                restaurant_name: this.restaurant_name,
                capaicty: this.capaicty,
                available_times: this.available_times,
                id: this.id
            }
            this.$store.dispatch('updateCurrentRestaurant', payload)
        }
    }
}
</script>
<template>
<div class="col" 
    :restaurant_name="restaurant_name"
    :restaurant_location="restaurant_location"
    :restaurant_image="restaurant_image" >
    <router-link :to="{ name:'Create' }"><img class="pics rounded" :src="restaurant_image" height="150" @click="newRestaurant"></router-link>
    <h3>{{ restaurant_name }}</h3>
    <p>{{ restaurant_location }}</p>
</div>
</template>
<style>
.pics {
	transition: transform .3s;
}
.pics:hover {
	transform: scale(1.1);
}
</style>