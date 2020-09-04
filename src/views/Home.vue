<template>
	<div class="home">
		<img
			alt="Vue logo"
			src="../assets/logo.png"
		>
		<h1>HOME PAGE</h1>
		<!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
		<ul>
			<li
				v-for="game in gameList"
				:key="game.id"
			>
				Game: {{ game.name }}
			</li>
		</ul>
		{{ gameList }}
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
	computed: {
		gameList() {
			return this.$store.state.gameList.games;
		},
	},
	mounted() {
		this.$store.dispatch('requestGameList');
	}
};
</script>
