<template>
	<div 
		class="mx-4 player-card" 
		:class="{'selected': isSelected}"
		@click="$emit('click')"
	>
		<div
			v-if="isValidTarget"
			class="selection-overlay"
		>
		</div>
		<img
			:src="require(`../../assets/cards/card_${suit}_${rank}.png`)"
		>
	</div>
</template>

<script>
export default {
	name: 'Card',
	props: {
		suit: {
			type: Number,
			required: true,
		},
		rank: {
			type: Number,
			required: true,
		},
		isSelected:{
			type: Boolean,
			default: false,
		},
		isValidTarget: {
			type: Boolean,
			default: false,
		},
	},
}
</script>
<style scoped lang="scss">
.player-card {
  position: relative;
  width: 15vh;

  & img {
	width: 100%;
	display: block;
	position: relative;
  }
}
.selected {
	transform: scale(1.1);
	img {
		border: 3px solid rgb(235, 255, 147);
		border-radius: 5px;
	}
}
.selection-overlay {
	display: block;
	position: absolute;
	width: 100%;
	height: 100%;
	z-index: 1;
	background-color: rgba(11, 241, 109, 0.4);
	cursor: pointer;
}
</style>
