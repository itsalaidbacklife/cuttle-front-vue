<template>
	<v-dialog
		v-model="show"
		persistent
		max-width="750"
	>
		<v-card
			v-if="oneOff && !choseToCounter"
			id="counter-dialog"
		>
			<v-card-title>Chance to Counter</v-card-title>
			<v-card-text>
				Your opponent has played the {{ oneOff.name }} as a one-off.
				<div class="d-flex justify-center align-center my-8">
					<card
						:suit="oneOff.suit"
						:rank="oneOff.rank"
					/>
					<p class="ml-8">
						{{ oneOff.ruleText }}
					</p>
				</div>
				Would you like to play a two to counter?
			</v-card-text>
			<v-card-actions class="d-flex justify-end">
				<v-btn
					data-cy="decline-counter-resolve"
					color="primary"
					depressed
					@click="resolve"
				>
					Resolve
				</v-btn>
				<v-btn
					data-cy="counter"
					color="primary"
					depressed
					@click="choseToCounter = true"
				>
					Counter
				</v-btn>
			</v-card-actions>
		</v-card>
		<!-- Choose which two to use to counter -->
		<v-card
			v-if="oneOff && choseToCounter"
			id="choose-two-dialog"
		>
			<v-card-title>Choose Two</v-card-title>
			<v-card-text>
				<p>
					Which Two would you like to counter with? (Click the card)
				</p>
				<div id="twos-in-hand" class="d-flex justify-center">
					<card
						v-for="two in twosInHand"
						:key="two.id"
						:suit="two.suit"
						:rank="two.rank"
						:data-counter-dialog-card="`${two.rank}-${two.suit}`"
						@click="counter(two)"
					/>
				</div>
			</v-card-text>
			<v-card-actions>
				<v-btn text color="primary" data-cy="cancel-counter" @click="resolve">
					Cancel
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import Card from '@/components/GameView/Card.vue';

export default {
	name: 'CounterDialog',
	components: {
		Card,
	},
	props: {
		value: {
			type: Boolean,
			required: true,
		},
		oneOff: {
			required: true,
		},
		// list of card objects for available twos
		twosInHand: {
			required: true,
		},
	},
	data() {
		return {
			choseToCounter: false,
		}
	},
	computed: {
		show: {
			get() {
				return this.value;
			},
			set(val) {
				this.$emit('input', val);
			}
		}
	},
	methods: {
		counter(two) {
			this.$emit('counter', two.id);
			this.choseToCounter = false;
		},
		resolve() {
			this.choseToCounter = false;
			this.$emit('resolve');
		}
	}
}
</script>

<style lang="scss" scoped></style>
