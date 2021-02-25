<template>
	<v-dialog
		v-model="show"
		persistent
		max-width="750"
	>
		<v-card
			v-if="oneOff"
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
					data-cy="resolve"
					color="primary"
					depressed
					@click="$emit('resolve')"
				>
					Resolve
				</v-btn>
				<v-btn
					data-cy="counter"
					color="primary"
					depressed
					@click="$emit('counter')"
				>
					Counter
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
	}
}
</script>

<style lang="scss" scoped></style>
