<template>
<div>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-10">
    <div class="container-fluid">
      <router-link :to="{ name:'Homepage' }"> 🐨 |</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarColor01">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link :to="{ name:'Existing' }"> View existing reservations |</router-link>
          </li>
        </ul>	        
      </div>
    </div>
  </nav>
  <router-view/>
</div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
