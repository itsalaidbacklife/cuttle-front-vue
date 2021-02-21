<template>
	<v-dialog
		v-model="show"
	>
		<v-card id="cannot-counter-dialog">
			<v-card-title>Cannot Counter</v-card-title>
			<v-card-text>
				<!-- Your opponent has played the {{ oneOff.name }} as a one-off. You cannot counter, because you do not have a two.
				<card
					:suit="oneOff.suit"
					:rank="oneOff.rank"
				/> -->
			</v-card-text>
			<v-card-actions class="d-flex justify-end">
				<v-btn
					data-cy="resolve"
					color="primary"
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
		// Card,
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