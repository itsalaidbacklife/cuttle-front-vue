<template>
	<v-dialog v-model="show">
		<v-card id="game-over-dialog">
			<v-card-title
				v-if="playerWins"
				data-cy="victory-heading"
			>
				You Win
			</v-card-title>
			<v-card-title
				v-else
				data-cy="loss-heading"
			>
				You Lose
			</v-card-title>
			<v-card-actions>
				<v-btn
					color="primary"
					data-cy="gameover-go-home"
					@click="goHome"
				>
					Go Home
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
export default {
	name: 'GameOverDialog',
	props: {
		value: {
			type: Boolean,
			required: true,
		},
		playerWins: {
			type: Boolean,
			required: true,
		},
	},
	computed: {
		show: {
			get() {
				return this.value;
			},
			set(newValue) {
				this.$emit('input', newValue);
			},
		},
	},
	methods: {
		goHome() {
			this.$router.push('/');
			this.$store.commit('setGameOver', {
				gameOver: false,
				conceded: false,
				winner: null,
			});
		},
	},
}
</script>