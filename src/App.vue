<template>
  <v-app>
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
