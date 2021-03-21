<template>
	<v-overlay
		id="nine-overlay"
		v-model="showOverlay"
		opacity=".6"
	>
		<!-- Cancel/Close overlay -->
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
				data-cy="nine-scuttle"
				class="d-flex flex-column align-center option"
				@click="$emit('scuttle')"
			>
				<h3>SCUTTLE</h3>
				<card
					:suit="target.suit"
					:rank="target.rank"
				/>
				<v-icon
					large
					class="mt-2"
				>
					mdi-delete
				</v-icon>
				<p>Scrap/Destroy Target</p>
			</div>

			<div
				data-cy="nine-one-off"
				class="d-flex flex-column align-center option"
				@click="$emit('one-off')"
			>
				<h3>ONE-OFF</h3>
				<card
					:suit="target.suit"
					:rank="target.rank"
				/>
				<v-icon
					large
					class="mt-2"
				>
					mdi-swap-vertical-variant
				</v-icon>
				<p>Return Target to Opponent's Hand</p>
			</div>
		</div>
	</v-overlay>
</template>

<script>
import Card from '@/components/GameView/Card.vue';

export default {
	name: 'NineOverlay',
	components: {
		Card,
	},
	props: {
		value: {
			required: true,
			type: Boolean,
		},
		nine: {
			required: true,
			// Card must be an 9
			validator: (card) => {
				return Object.hasOwnProperty.call(card, 'suit') && 
				Object.hasOwnProperty.call(card, 'rank') &&
				card.rank === 9 &&
				[0, 1, 2, 3].includes(card.suit);
			}
		},
		target: {
			required: true,
			validator: (card) => {
				return Object.hasOwnProperty.call(card, 'suit') && 
				Object.hasOwnProperty.call(card, 'rank') &&
				card.rank > 0 && card.rank <= 13 &&
				[0, 1, 2, 3].includes(card.suit);
			}
		}
	},
	computed: {
		// Enable parent to v-model this component
		showOverlay: {
			get() {
				return this.value;
			},
			set(val) {
				this.$emit('input', val);
			}
		},
		canScuttle() {
			return (
				this.nine.rank > this.target.rank ||
                (
                	this.nine.rank === this.target.rank &&
                    this.nine.suit > this.target.suit
                )
			);
		},
	},
}
</script>

<style lang="scss">
#nine-overlay {

	& .v-overlay__content {
		width: 80%;
		
		& #options-wrapper {
			position: relative;
			width: 100%;

			& .option {
				cursor: pointer;
			}
		}

		& #close-wrapper {
			width: 85%;
		}
	}
}
</style>
