<template>
	<v-dialog
		v-model="show"
		persistent
		max-width="750"
	>
		<v-card
			v-if="oneOff"
			id="three-dialog"
		>
			<v-card-title>Select a Card from Scrap</v-card-title>
			<v-card-text>
				<div class="d-flex justify-center align-center my-8">
					<card 
						v-for="(card, index) in scrap"
						:key="card.id"
						:suit="card.suit"
						:rank="card.rank"
						:is-selected="selectedScrapCard && card.id === selectedScrapCard.id"
						:data-scrap-dialog-card="`${card.rank}-${card.suit}`"
						@click="selectCard(index)"
					/>
				</div>
			</v-card-text>
			<v-card-actions
				class="d-flex justify-end"
			>
				<v-btn
					data-cy="three-resolve"
					color="primary"
					:disabled="selectedScrapCard === null"
					outlined
					@click="moveToHand"
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
	name: 'ThreeDialog',
	components: {
		Card,
	},
	props: {
		value: {
			type: Boolean,
			required: true,
		},
		oneOff: {
			type: Object,
			required: true,
		},
		// list of card objects for available twos
		scrap: {
			type: Array,
			required: true,
		},
	},
	data() {
		return {
			choseToCounter: false,
			selectionIndex: null, // when select a card set this value
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
		},
		selectedScrapCard() {
			return this.selectionIndex !== null ? this.scrap[this.selectionIndex] : null;
		},
	},
	methods: {
		moveToHand() {
			const card = this.selectedScrapCard
			this.$emit('resolveThree', card.id);
			this.clearSelection();
		},
		selectCard(index) {
			if (index === this.selectionIndex){
				this.clearSelection();
			} else {
				this.selectionIndex = index;
			}
		},
		clearSelection() {
			this.selectionIndex = null;
		},
	}
}
</script>

<style lang="scss" scoped></style>
