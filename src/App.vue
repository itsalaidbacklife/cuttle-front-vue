<template>
  <v-app id="app">
    <!-- <div id="nav"> -->
      <!-- <router-link to="/">Home</router-link> | -->
      <!-- <router-link to="/about">About</router-link> -->
    <!-- </div> -->
    <router-view/>
  </v-app>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Berkshire+Swash&display=swap');
@import url('https://fonts.googleapis.com/css2?family=BioRhyme:wght@200;300;400;700;800&display=swap');

#app {
  font-family: 'BioRhyme', serif;
}

h1, h2 {
  font-family: 'Berkshire Swash', cursive;
}
</style>
