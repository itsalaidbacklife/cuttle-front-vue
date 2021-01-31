<template>
	<div class="mx-4 player-card">
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
		}
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
</style>
