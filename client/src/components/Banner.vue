<template>
<div class="banner">
    <div class="row mx-auto p-3" style="width: 600px;">
        <router-link :to="{ name:'Homepage' }"><img class="rounded" src="../assets/banner.jpg" alt="logo" height="300"></router-link>
    </div>
</div>
</template>
<script>
export default {
    name: 'Banner'
}
</script>
<style>
.banner {
    background-color: #BFCBC2;
}
</style>