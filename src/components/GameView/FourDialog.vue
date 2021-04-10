<template>
	<v-dialog v-model="show" persistent>
		<v-card id="four-discard-dialog">
			<v-card-title>Discard Two Cards</v-card-title>
			<v-card-text>
				<p>
					Your Opponent has resolved a Four One-Off.
					You must discard two cards. Click to select cards to discard.
				</p>
				<!-- Cards in hand -->
				<div class="d-flex flex-wrap">
					<card
						v-for="card in hand"
						:key="card.id"
						:suit="card.suit"
						:rank="card.rank"
						:data-discard-card="`${card.rank}-${card.suit}`"
					/>
				</div>
			</v-card-text>
			<v-card-actions class="d-flex justify-end">
				<v-btn
					color="primary"
					data-cy="close-four-dialog"
				>
					Discard
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import Card from '@/components/GameView/Card.vue';

export default {
	name: 'FourDialog',
	components: {
		Card,
	},
	props: {
		value: {
			required: true,
			type: Boolean,
		},
	},
	data() {
		return {
			selectedIndices: [],
		}
	},
	computed: {
		show: {
			get() {
				return this.value;
			},
			set(val) {
				this.$emit('input', val);
			},
		},
		hand() {
			return this.$store.state.game.players[this.$store.state.game.myPNum].hand;
		},
	},
}
</script>