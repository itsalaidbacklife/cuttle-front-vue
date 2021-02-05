<template>
	<div 
		class="mx-4 player-card" 
		:class="{'selected': isSelected}"
		@click="$emit('click')"
	>
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
			required: true
		},
		rank: {
			type: Number,
			required: true
		},
		isSelected:{
			type: Boolean,
			default: false
		},
	}
}
</script>
<style scoped lang="scss">
.player-card {
  position: relative;
  width: 15vh;

  & img {
    margin-top: 16px;
	  width: 100%;
  }
}
.selected {
	transform: scale(1.1);
	img {
		border: 3px solid rgb(235, 255, 147);
		border-radius: 5px;
	}
	
}
</style>
