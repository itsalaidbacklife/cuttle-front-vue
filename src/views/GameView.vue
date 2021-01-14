<template>
	<div id="game-view-wrapper">
		<!-- Opponent Hand -->
		<v-row>
			<v-col>
				<v-btn color="warning">
					Exit
				</v-btn>
			</v-col>
		</v-row>
		<!-- Field -->
		<v-row />
		<!-- Player Hand -->
		<v-row />
	</div>
</template>

<script>
export default {
	name: 'GameView',
}
</script>

<style lang="scss" scoped>
#game-view-wrapper {
	width: 100%;
	height: 100%;
	background: linear-gradient(180deg, #6202EE 14.61%, #FD6222 100%), #C4C4C4;
}
</style>