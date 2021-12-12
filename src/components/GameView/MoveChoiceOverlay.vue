<template>
	<v-overlay id="move-choice-overlay" :value="true">
		<!-- Cancel button -->
		<div
			id="close-wrapper"
			class="d-flex justify-end"
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
		<!-- Move choices -->
		<div id="options-wrapper">
			<move-choice-card
				move-name="Scuttle"
			/>
		</div>
	</v-overlay>
</template>

<script>
import MoveChoiceCard from '@/components/GameView/MoveChoiceCard.vue';

export default {
	name: 'MoveChoiceOverlay',
	components: {
		MoveChoiceCard
	},
}
</script>

<style scoped lang="scss">
#move-choice-overlay {
	& #close-wrapper {
		width: 85%;
	}
}
</style>