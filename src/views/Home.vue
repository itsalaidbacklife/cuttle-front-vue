<template>
	<div class="home">
		<img
			alt="Vue logo"
			src="../assets/logo.png"
		>
		<h1>HOME PAGE</h1>
		<!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
	</div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";

export default {
	name: "Home",
	components: {
		// HelloWorld
	},
	mounted() {
		console.log('loaded home component');
		this.$store.dispatch('requestGameList');
	}
};
</script>
