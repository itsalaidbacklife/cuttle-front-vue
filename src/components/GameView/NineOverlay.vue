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
				data-cy="cancel-nine"
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
				@click="scuttle"
			>
				<h3 class="my-2">
					SCUTTLE
				</h3>
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
				<div
					v-if="!canScuttle"
					id="nine-cannot-scuttle"
					class="d-flex justify-center align-center pa-8"
				>
					<p>Cannot Scuttle a larger point card</p>
				</div>
			</div>

			<div
				data-cy="nine-one-off"
				class="d-flex flex-column align-center option"
				@click="$emit('one-off')"
			>
				<h3 class="my-2">
					ONE-OFF
				</h3>
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
	methods: {
		scuttle() {
			if (this.canScuttle) {
				this.$emit('scuttle');
			}
		}
	}
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
				position: relative;
				cursor: pointer;
				padding: 16px;
			}
		}

		#nine-cannot-scuttle {
			display: block;
			position: absolute;
			width: 100%;
			height: 100%;
			color: #ffffff;
			background-color: rgba(0, 0, 0, .6);
			font-weight: 600;
		}

		& #close-wrapper {
			width: 85%;
		}
	}
}
</style>
