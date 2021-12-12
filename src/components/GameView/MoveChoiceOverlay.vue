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
				:move-description="move.moveDescription"
				:disabled="move.disabled"
				:disabled-explanation="move.disabledExplanation"
				:card-width="cardWidth"
				class="mx-4"
				@click="handleClick(move)"
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
		opponentQueenCount: {
			type: Number,
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
				const pointsDescription =  cardRank === 1 ? 'Gain 1 point' : `Gain ${cardRank} points`;
				let oneOffDisabled = !this.isPlayersTurn;
				let oneOffDisabledExplanation = 'It\'s not your turn';
				// Twos and nines depend on opponent queen count
				if ([2, 9].includes(cardRank) && this.isPlayersTurn) {
					if (this.opponentQueenCount >= 2) {
						oneOffDisabled = true;
						oneOffDisabledExplanation = `You can't play a ${cardRank} while your opponent has two or more queens`;
					} else {
						let validTargetExists;
						switch (cardRank) {
						case 2:
							validTargetExists = this.$store.getters.opponent.faceCards.length >= 1;
							if (!validTargetExists) {
								oneOffDisabled = true;
								oneOffDisabledExplanation = 'There are no Royals to target';
							}
							break;
						case 9:
							const validTargets = this.$store.getters.opponent.points.length + this.$store.getters.opponent.faceCards.length;
							validTargetExists = validTargets >= 1;
							if (!validTargetExists) {
								oneOffDisabled = true;
								oneOffDisabledExplanation = 'There are no point cards or Royals to target';
							}
							break;
						}
					}
				}
				res = [
					// Points
					{
						moveName: 'Points',
						moveDescription: pointsDescription,
						disabled: !this.isPlayersTurn,
						disabledExplanation: 'It\'s not your turn'
					},
					// Scuttle
					{
						moveName: 'Scuttle',
						moveDescription: 'Scrap a lower point card',
						disabled: !this.isPlayersTurn || !this.hasValidScuttleTarget,
						disabledExplanation: this.isPlayersTurn ? 'You can only scuttle smaller point cards' : 'It\'s not your turn',
					},
					// One-Off
					{
						moveName:'One-Off',
						moveDescription: this.selectedCard.ruleText,
						disabled: oneOffDisabled,
						disabledExplanation: oneOffDisabledExplanation,
					},
				];
				break;
			case 8:
				res = [
					// Points
					{
						moveName: 'Points',
						moveDescription: `Gain ${cardRank} points`,
						disabled: !this.isPlayersTurn,
						disabledExplanation: 'It\'s not your turn'
					},
					// Scuttle
					{
						moveName: 'Scuttle',
						moveDescription: 'Scrap a lower point card',
						disabled: !this.isPlayersTurn || !this.hasValidScuttleTarget, 
						disabledExplanation: this.isPlayersTurn ? 'You can only scuttle smaller point cards' : 'It\'s not your turn'
					},
					// Glasses
					{
						moveName: 'Glasses',
						moveDescription: 'Your opponent plays open handed',
						disabled: !this.isPlayersTurn,
						disabledExplanation: 'It\'s not your turn'
					},
				]
				break;
			case 10:
				res = [
					// Points
					{
						moveName: 'Points',
						moveDescription: `Gain ${cardRank} points`,
						disabled: !this.isPlayersTurn,
						disabledExplanation: 'It\'s not your turn'
					},
					// Scuttle
					{
						moveName: 'Scuttle',
						moveDescription: 'Scrap a lower point card',
						disabled: !this.isPlayersTurn || !this.hasValidScuttleTarget, 
						disabledExplanation: this.isPlayersTurn ? 'You can only scuttle smaller point cards' : 'It\'s not your turn'
					},
				];
				break;
			case 11:
				let ableToJack = false;
				let disabledExplanation = 'It\'s not your turn';
				if (this.isPlayersTurn) {
					ableToJack = this.opponentQueenCount === 0;
					disabledExplanation = 'You cannot jack your opponent\'s points while they have a queen';
				}
				res = [
					{
						moveName: 'Royal',
						moveDescription: 'Steal an opponent\'s point card',
						disabled: !ableToJack,
						disabledExplanation,
					},
				];
				break;
			case 12:
			case 13:
				res = [
					{
						moveName: 'Royal',
						moveDescription: this.selectedCard.ruleText,
						disabled: !this.isPlayersTurn,
						disabledExplanation: 'It\'s not your turn'
					},
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
		cardWidth() {
			switch (this.moveChoices.length) {
			case 1:
				return '100%';
			case 2:
				return '50%';
			case 3:
			default:
				return '30%';
			}
		},
	}, // End computed{}
	methods: {
		handleClick(move) {
			switch(move.moveName) {
			case 'Points':
				this.$emit('points');
				break;
			case 'Royal':
			case 'Glasses':
				this.$emit('faceCard');
				break;
			case 'Scuttle':
				this.$emit('scuttle');
			case 'OneOff':
				this.$emit('one-off');
				break;
			}
		}
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