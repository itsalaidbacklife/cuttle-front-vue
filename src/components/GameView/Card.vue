<template>
	<div class="mx-2 player-card">
		<v-img :src="require(`../../assets/cards/card_${suit}_${rank}.png`)" />
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
  height: 90%;
}
</style>
