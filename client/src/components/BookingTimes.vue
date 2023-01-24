<script>
export default {
    name: 'BookingTimes',
    props: {
        time: {
            type: String,
            required: true
        }
    }
}
</script>

<template>
    <option :value="time">{{ time }}</option>
</template>