<template>
  <div v-if="messages" >
    <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
        <div id="SSEToast" class="toast hide" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
        
        <strong class="me-auto">🐨 DropBearTable</strong>
        <small>Just now</small>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body" v-for="(message, idx) in messages" :key="idx">
        {{ message }}
        </div>
    </div>
    </div>
  </div>
</template>

<script>
export default {
    name: 'SSE',
    data() {
        return {
            messages: [],
        }
    },
    mounted() {
        const url = 'http://localhost:3000/notification'
        const sse = new EventSource(url)
        sse.addEventListener("bookingCreated", (e) => {
            console.log('booking created')
            this.handleUpdate(JSON.parse(e.data))
        })
        sse.addEventListener("message", (e) => {
            console.log('MESSAGE')
            console.log(e.data)
        })
    },
    methods: {
        handleUpdate(message) {
            this.messages.push(`You're booking on the ${message.bookingdate} at ${message.bookingtime} has been confirmed!`)
        }
    }
}
</script>