<template>
	<v-overlay
		id="move-choice-overlay"
		class="d-flex flex-column justify-center align-center"
		:value="!!selectedCard"
	>
		<!-- Cancel button -->
		<div
			id="close-wrapper"
			class="d-flex justify-end my-4"
		>
			<v-btn
				icon
				data-cy="cancel-move"
				@click="$emit('cancel')"
			>
				<v-icon x-large>
					mdi-close
				</v-icon>
			</v-btn>
		</div>
		<div
			v-if="selectedCard"
			class="d-flex justify-center"
		>
			<card
				:suit="selectedCard.suit"
				:rank="selectedCard.rank"
			/>
		</div>
		<!-- Move choices -->
		<div
			id="options-wrapper"
			class="my-4"
		>
			<move-choice-card
				move-name="Scuttle"
			/>
		</div>
	</v-overlay>
</template>

<script>
import MoveChoiceCard from '@/components/GameView/MoveChoiceCard.vue';
import Card from '@/components/GameView/Card.vue';

export default {
	name: 'MoveChoiceOverlay',
	components: {
		MoveChoiceCard,
		Card,
	},
	props: {
		selectedCard: {
			type: Object,
			default: null,
		}
	}
}
</script>

<style scoped lang="scss">
#move-choice-overlay {
	& #close-wrapper {
		width: 85%;
	}
}
</style>