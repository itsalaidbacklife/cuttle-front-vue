<template>
	<v-row
		class="list-item"
		data-cy="game-list-item"
	>
		<v-col
			sm="2"
			lg="3"
		>
			<v-img
				:src="require('../assets/logo_head.svg')"
				class="my-1"
				contain
				:height="$vuetify.breakpoint.md ? 64 : 32"
			/>
		</v-col>
		<v-col 
			sm="7" 
			lg="6"
		>
			<p data-cy="game-list-item-name">
				{{ name }}
			</p>
			<p>{{ readyText }} players</p>
		</v-col>
		<v-col
			cols="3"
			class="list-item-button"
		>
			<v-btn
				color="primary"
				rounded
				:disabled="!status"
				:small="$vuetify.breakpoint.lg ? false : true"
				@click="subscribeToGame"
			>
				JOIN
			</v-btn>
		</v-col>
	</v-row>
</template>

<script>
export default {
	name: 'GameListItem',
	props: {
		name: {
			type: String, 
			default: ''
		},
		p0ready:{
			type: Number,
			default: 0
		},
		p1ready:{
			type: Number, 
			default: 0
		},
		gameId: {
			type: Number,
			required: true
		},
		status: {
			type: Boolean,
			required: true,
		},
		numPlayers: {
			type: Number,
			required: true,
		}
	},
	computed:{
		numPlayersReady() {
			return this.p0ready + this.p1ready
		},
		readyText() {
			return `${this.numPlayers} / 2`;
		},
	},
	methods: {
		subscribeToGame() {
			console.log(`click handler for subscribe to ${this.gameId}`);
			console.log(this.gameId);
			this.$store.dispatch('requestSubscribe', this.gameId)
				.then(() => {
					this.$router.push(`/lobby/${this.gameId}`);
				})
				.catch(() => {
					console.log('error subscribing');
				});
		}
	}
};
</script>
<style scoped lang="scss">
.list-item {
	margin-left: 0;
	margin-right: 0;
	text-align: left;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
}
.list-item-button {
	display: flex;
	align-items: center;
	justify-content: center;
}
@media (max-width: 979px) and (orientation: landscape) {
	.list-item {
		margin: 0;
		p {
			line-height: 1rem;
			margin: 3px auto;
		}
	}

}
</style>
