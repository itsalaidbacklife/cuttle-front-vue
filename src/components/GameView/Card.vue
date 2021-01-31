<template>
	<div class="mx-4 player-card">
		<img
			:src="require(`../../assets/cards/card_${suit}_${rank}.png`)"
      class="mt-8"
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
  width: 10vh;
  height: 150%;
  & img {
	  width: 100%;
  }
}
</style>
