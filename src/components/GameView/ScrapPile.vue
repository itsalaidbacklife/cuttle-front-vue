<template>
	<v-dialog
		v-model="show"
		persistent
		max-width="750"
		scrollable
	>
		<v-card
			id="scrap-dialog"
		>
			<v-card-title>Scrap Pile</v-card-title>
			<v-card-text>
				<div class="d-flex flex-wrap justify-center align-center my-8">
					<card
						v-for="(card, index) in scrap"
						:key="card.id"
						class="mx-1 my-1"
						:suit="card.suit"
						:rank="card.rank"
						:is-selected="selectedScrapCard && card.id === selectedScrapCard.id"
						:data-scrap-dialog-card="`${card.rank}-${card.suit}`"
						@click="selectCard(index)"
					/>
				</div>
			</v-card-text>
		</v-card>
	</v-dialog>
</template>

<script>
import Card from '@/components/GameView/Card.vue';

export default {
	name: 'ScrapDialog',
	components: {
		Card,
	},
	props: {
		value: {
			type: Boolean,
			required: true,
		},
		// oneOff: {
		// 	type: Object,
		// 	default: null,
		// },
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
