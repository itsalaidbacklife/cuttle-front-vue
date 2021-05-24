<template>
	<v-dialog
		v-model="show"
		persistent
		max-width="750"
	>
		<v-card
			v-if="oneOff"
			id="cannot-counter-dialog"
		>
			<v-card-title>Cannot Counter</v-card-title>
			<v-card-text>
				Your opponent has played the {{ oneOff.name }} as a one-off
				<span v-if="target"> targetting your {{ target.name }}</span>
				<div class="d-flex justify-center align-center my-8">
					<card
						:suit="oneOff.suit"
						:rank="oneOff.rank"
					/>
					<p class="ml-8">
						{{ oneOff.ruleText }}
					</p>
					<div id="target-wrapper" v-if="target">
						<span id="target-icon-wrapper" class="d-flex justify-center align-center">
							<v-icon id="target-icon" x-large color="red">mdi-target</v-icon>
						</span>
						<card
							:suit="target.suit"
							:rank="target.rank"
						/>
					</div>
				</div>
				You cannot Counter, because you do not have a two.
			</v-card-text>
			<v-card-actions class="d-flex justify-end">
				<v-btn
					data-cy="cannot-counter-resolve"
					color="primary"
					depressed
					@click="$emit('resolve')"
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
		},
		target: {
			default: null,
		},
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

<style lang="scss" scoped>
#target-wrapper {
	display: inline-block;
 	position: relative;

	& #target-icon-wrapper {
		display: block;
		position: absolute;
		width: 100%;
		height: 100%;
		z-index: 1;
	}
}
</style>