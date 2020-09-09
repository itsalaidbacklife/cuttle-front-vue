<template>
	<div class="home">
		<img
			alt="Vue logo"
			src="../assets/logo.png"
		>
		<h1>Open Games</h1>
		<!-- List of existing games -->
		<ul>
			<li
				v-for="game in gameList"
				:key="game.id"
			>
				Game: {{ game.name }}
			</li>
		</ul>
		<!-- Create New Game -->
		<div>
			<h2>Create Game</h2>
			<v-text-field
				v-model="newGameName"
				outlined
				@keyup.enter="submitNewGame"
			/>
			<v-btn
				color="primary"
				@click="submitNewGame"
			>
				Submit
			</v-btn>
		</div>
	</div>
</template>

<script>

export default {
	name: "Home",
	components: {
		// HelloWorld
	},
	data() {
		return {
			newGameName: ''
		}
	},
	computed: {
		gameList() {
			return this.$store.state.gameList.games;
		},
	},
	mounted() {
		this.$store.dispatch('requestGameList');
	},
	methods: {
		submitNewGame() {
			console.log('submitting new game');
			this.$store.dispatch('requestCreateGame', this.newGameName)
				.then(() => {
					this.newGameName = '';
				})
				.catch(() => {
					console.log('Error creating game');
				});
		}
	}
};
</script>
