<template>
	<div
		id="player-hand-targetting"
		class="d-flex justify-start"
		:class="{'my-turn': isPlayersTurn}"
	>
		<card
			:suit="selectedCard.suit"
			:rank="selectedCard.rank"
			:is-selected="true"
			@click="$emit('cancel')"
		/>
		<div
			id="target-selection-header-wrapper"
			class="d-flex flex-column align-center"
		>
			<h1>Choose Scuttle Target</h1>
			<v-btn
				text
				color="primary"
				@click="$emit('cancel')"
			>
				Cancel
			</v-btn>
		</div>
	</div>
</template>

<script>
import Card from '@/components/GameView/Card.vue';

export default {
	name: 'TargetSelectionOverlay',
	components: {
		Card,
	},
	props: {
		value: {
			type: Boolean,
			required: true,
		},
		selectedCard: {
			type: Object,
			required: true,
		},
		isPlayersTurn: {
			type: Boolean,
			required: true,
		},
	}
}
</script>

<style scoped lang="scss">
#player-hand-targetting {
	padding: 32px;
}
#target-selection-header-wrapper {
	width: 100%;
}
</style>