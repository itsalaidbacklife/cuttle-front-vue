<template>
	<v-expand-transition>
		<v-card
			v-if="show"
			id="turn-token"
			rounded="circle"
			height="90"
			width="90"
			elevation="3"
			class="mx-2 d-flex flex-column justify-center align-center"
			:color="cardColor"
		>
			<v-card-text class="d-flex align-center flex-column black--text">
				<!-- <h3 class="turn-token-text">
				</h3> -->
				<span>{{ whoseTurn }}</span>
				<v-img :src="require('@/assets/logo_head_no_background.svg')" max-height="48" contain />
				<span>Turn</span>
			</v-card-text>
		</v-card>
	</v-expand-transition>
</template>

<script>
export default {
	name: 'TurnToken',
	props: {
		show: {
			type: Boolean,
			required: true,
		},
		isPlayersTurn: {
			type: Boolean,
			default: true,
		},
	},
	computed: {
		whoseTurn() {
			return this.isPlayersTurn ? 'Your' : 'Their';
		},
		cardColor() {
			return this.isPlayersTurn ? 'accent' : 'secondary';
		}
	},
}
</script>

<style lang="scss" scoped>
h3.turn-token-text {
	font-weight: 700;
	color: var(--v-accent-lighten2);
}
</style>
