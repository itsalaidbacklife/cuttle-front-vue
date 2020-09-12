<template>
	<div id="lobby-wrapper">
		<h1>Lobby for {{ gameId }}</h1>
	</div>
</template>
<script>
export default {
	name: 'Lobby',
	computed: {
		gameId() {
			return this.$store.state.game.gameId;
		}
	}
}
</script>