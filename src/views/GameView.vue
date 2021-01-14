<template>
	<div id="game-view-wrapper">
		<!-- Opponent Hand -->
		<div 
			id="opponent-hand"
			class="d-flex justify-center align-center px-2 pb-2 mx-auto" 
		>
			Opponent Hand
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
			class="d-flex justify-center align-center px-2 pt-2 mx-auto"
		>
			Player Hand
		</div>
	</div>
</template>

<script>
export default {
	name: 'GameView',
	computed: {
		player() {
			return this.$store.state.game.players[this.$store.state.game.myPNum];
		},
		opponent() {
			return this.$store.getters.opponent;
		},
		playPointTotal() {
			return this.player.points.reduce((total, card)=> total + card.rank, 0);
		},
		opponentPointTotal() {
			return this.opponent.points.reduce((total, card)=> total + card.rank, 0);
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
	width: 50%;
	height: 20vh;
	background: rgba(0, 0, 0, 0.46);
}

#field {
	width: 100%;
	height: 60vh
}

#player-hand {
	width: 50%;
	height: 20vh;
	background: rgba(0, 0, 0, 0.14);
}


</style>