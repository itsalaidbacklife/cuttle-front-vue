<template>
  <v-app id="app">
    <v-main>
      <!-- <HelloWorld/> -->
      <login-signup/>
    </v-main>
  </v-app>
</template>

<script>
// import HelloWorld from './components/HelloWorld';
import LoginSignup from './components/LoginSignup';

export default {
  name: 'App',

  components: {
    // HelloWorld,
    LoginSignup
  },

  data: () => ({
    //
  }),
};
</script>

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