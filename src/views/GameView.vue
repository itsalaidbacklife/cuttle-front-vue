<template>
	<div id="game-view-wrapper">
		<!-- Opponent Hand -->
		<div 
			id="opponent-hand"
			class="d-flex flex-column justify-start align-center px-2 pb-2 mx-auto" 
		>
			<div 
				id="opponent-hand-cards"
				class="d-flex justify-center align-start"
			>
				<div
					v-for="card in opponent.hand"
					:key="card.id"
					class="opponent-card mx-2"
				/>
			</div>
			<div id="opponent-score">
				{{ opponentPointTotal }}
			</div>
		</div>
		<!-- Field -->
		<div
			id="field"
			class="d-flex justify-center align-center p-2 mx-auto"
		>
			Field
		</div>
		<!-- Player Hand -->
		<div
			id="player-hand"
			class="d-flex flex-column justify-end align-center px-2 pt-2 mx-auto"
		>
			<div id="player-score">
				{{ playerPointTotal }}
			</div>

			<div
				id="player-hand-cards"
				class="d-flex justify-center align-end"
			> 
				<card 
					v-for="card in player.hand"
					:key="card.id"
					:suit="card.suit"
					:rank="card.rank"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import Card from '@/components/GameView/Card.vue';

export default {
	name: 'GameView',
	components: {
		Card,
	},
	computed: {
		player() {
			return this.$store.state.game.players[this.$store.state.game.myPNum];
		},
		opponent() {
			return this.$store.getters.opponent;
		},
		playerPointTotal() {
			return this.player.points.reduce((total, card)=> total + card.rank, 0) || 0;
		},
		opponentPointTotal() {
			return this.opponent.points.reduce((total, card)=> total + card.rank, 0) || 0;
		},
	}
}
</script>

<style lang="scss" scoped>
#game-view-wrapper {
	color: #FFF;
	width: 100%;
	height: 100%;
	background: linear-gradient(180deg, #6202EE 14.61%, #FD6222 100%), #C4C4C4;
}

#opponent-hand {
	min-width: 50%;
	height: 20vh;
}

#opponent-hand-cards {
	// width: 100%;
	height: 80%;
	background: rgba(0, 0, 0, 0.46);

	& .opponent-card {
		height: 90%;
		width: 10vw;
		display: inline-block;
		position: relative;
		background: conic-gradient(from 259.98deg at 49.41% 65.83%, #6020EE 0deg, #FD6222 360deg), #858585;
		transform: rotate(180deg);
	}
}

#player-hand-cards {
	width: 100%;
	height: 80%;
	background: rgba(0, 0, 0, 0.46);
}

#field {
	width: 100%;
	height: 60vh
}

#player-hand {
	width: 50%;
	height: 20vh;
}




</style>