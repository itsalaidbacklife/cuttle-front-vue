<template>
	<v-dialog
		v-model="show"
		persistent
		max-width="750"
	>
		<v-card id="cannot-counter-dialog" v-if="oneOff">
			<v-card-title>Cannot Counter</v-card-title>
			<v-card-text>
				Your opponent has played the {{ oneOff.name }} as a one-off.
				<div class="d-flex justify-center align-center my-8">
					<card
						:suit="oneOff.suit"
						:rank="oneOff.rank"
					/>
					<p class="ml-8">{{oneOff.ruleText}}</p>
				</div>
				You cannot Counter, because you do not have a two.
			</v-card-text>
			<v-card-actions class="d-flex justify-end">
				<v-btn
					data-cy="resolve"
					color="primary"
					depressed
				>
					Resolve
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import Card from '@/components/GameView/Card.vue';

export default {
	name: 'CannotCounterDialog',
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