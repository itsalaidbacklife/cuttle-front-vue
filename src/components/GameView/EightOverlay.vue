<template>
	<v-overlay
		id="eight-overlay"
		v-model="showOverlay"
		opacity=".6"
	>
		<div
			id="close-wrapper"
			class="d-flex justify-end"
		>
			<v-btn
				icon
				data-cy="cancel-eight"
				@click="$emit('cancel')"
			>
				<v-icon x-large>
					mdi-close
				</v-icon>
			</v-btn>
		</div>
		<div
			id="options-wrapper"
			class="d-flex justify-space-around"
		>
			<div
				data-cy="eight-for-points"
				class="d-flex flex-column align-center option"
				@click="$emit('points')"
			>
				<h3>POINTS</h3>
				<card
					:suit="card.suit"
					:rank="card.rank"
				/>
				<p>Worth 8 points</p>
			</div>
			<div
				data-cy="eight-as-glasses"
				class="d-flex flex-column align-center option"
				@click="$emit('glasses')"
			>
				<h3>GLASSES</h3>
				<img
					id="glasses-img"
					:src="require(`../../assets/cards/Glasses_${suitName}.jpg`)"
					alt="Glasses Eight"
				>
				<p>Reveal your opponent's hand</p>
			</div>
		</div>
	</v-overlay>
</template>

<script>
import Card from '@/components/GameView/Card.vue';

export default {
	name: 'EightOverlay',
	components: {
		Card,
	},
	props: {
		value: {
			required: true,
			type: Boolean,
		},
		card: {
			required: true,
			// Card must be an 8
			validator: (card) => {
				return Object.hasOwnProperty.call(card, 'suit') && 
				Object.hasOwnProperty.call(card, 'rank') &&
				card.rank === 8 &&
				[0, 1, 2, 3].includes(card.suit);
			}
		},
	},
	computed: {
		showOverlay: {
			get() {
				return this.value;
			},
			set(val) {
				this.$emit(val);
			}
		},
		suitName() {
			switch (this.card.suit) {
			case 0:
				return 'Clubs';
			case 1:
				return 'Diamonds';
			case 2:
				return 'Hearts';
			case 3:
				return 'Spades';
			default:
				throw new Error(`Cannot find glasses image url for invalid card suit: ${this.card.suit}`);
			}
		},
	}
}
</script>

<style lang="scss">
#eight-overlay {

	& .v-overlay__content {
		width: 80%;
		
		& #options-wrapper {
			position: relative;
			width: 100%;

			& .option {
				cursor: pointer;
			}

			& #glasses-img {
				max-width: 200px;
			}
		}

		& #close-wrapper {
			width: 85%;
		}
	}
}
</style>