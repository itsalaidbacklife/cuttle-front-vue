<template>
	<div 
		class="mx-4 player-card" 
		:class="{'selected': isSelected}"
		:data-cy="`${rank}-${suit}`"
		@click="$emit('click')"
	>
		<div
			v-if="isValidTarget"
			class="target-overlay"
		/>
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
		border: 3px solid var(--v-accent-lighten1);
		border-radius: 5px;
	}
}
.target-overlay {
	display: block;
	position: absolute;
	width: 100%;
	height: 100%;
	z-index: 1;
	background-color: var(--v-accent-lighten1);
	opacity: .6;
	cursor: pointer;
}
</style>
