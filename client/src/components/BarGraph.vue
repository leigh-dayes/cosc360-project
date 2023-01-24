<template>
  <div class="p-3">
    <h3>Where everyone is eating!</h3>
    <svg width="420" height="300">
      <g class="bar" v-for="(d, i) in data" :transform="`translate(0, ${42 * i})`" :key="i">
        <rect :width="d.r_num * 10" height="40"/>
        <text x="20" y="25" font-size="25" fill="grey">{{ d.r_name }}</text>
      </g>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'BarGraph',
  props: {
      data: {
          type: Array,
          required: true
      }
  }
}
</script>

<style>
.bar {
  fill: #aaa;
  height: 21px;
  transition: fill .3s ease;
  cursor: pointer;
  width: 100%;
}
.bar:hover,
.bar:focus {
  fill: #BFCBC2;
}
</style>