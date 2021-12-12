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
			class="d-flex justify-space-between my-4"
		>
			<move-choice-card
				v-for="move in moveChoices"
				:key="move.moveName"
				:move-name="move.moveName"
				:disabled="move.disabled"
				:disabled-explanation="move.disabledExplanation"
				class="mx-4"
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
		},
		isPlayersTurn: {
			type: Boolean,
			required: true,
		},
	},
	computed: {
		/**
		 * Returns list of objects representing the available moves,
		 * based on the selected card
		 */
		moveChoices() {
			if (!this.selectedCard) return [];
			let res = [];
			let cardRank;
			if (this.resolvingSeven) {
				if (!this.cardSelectedFromDeck) return [];
				cardRank = this.cardSelectedFromDeck.rank;
			}
			else {
				if (!this.selectedCard) return [];
				cardRank = this.selectedCard.rank;
			}
			switch (cardRank) {
			case 1:
			case 2:
			case 3:
			case 4:
			case 5:
			case 6:
			case 7:
			case 9:
				res = [
					{ moveName: 'Points', disabled: !this.isPlayersTurn, disabledExplanation: 'It\'s not your turn' },
					{ moveName:'One-Off', disabled: !this.isPlayersTurn, disabledExplanation: 'It\'s not your turn' },
					{ 
						moveName: 'Scuttle', 
						disabled: !this.isPlayersTurn || !this.hasValidScuttleTarget, 
						disabledExplanation: this.isPlayersTurn ? 'You can only scuttle smaller point cards' : 'It\'s not your turn'
					}
				];
				break;
			}
			return res;
		},
		/**
		 * @return boolean whether there is a legal scuttle using selected card
		 */
		hasValidScuttleTarget() {
			// Can't scuttle with a royal
			if (this.selectedCard.rank >= 11) return false;
			// Return true iff at least one opponent point card is scuttleable w/ selected card
			return this.$store.getters.opponent.points.some((opponentPointCard) => {
				return this.selectedCard.rank > opponentPointCard.rank ||
					(
						this.selectedCard.rank === opponentPointCard.rank && 
						this.selectedCard.suit > opponentPointCard.suit
					);
			});
		},
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