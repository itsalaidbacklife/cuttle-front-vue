<template>
	<div class="mt-4">
		<div id="select-wrapper">
			<v-select
				id="scrap-sort-dropdown"
				v-model="sortByRank"
				data-cy="scrap-sort-dropdown"
				:items="sortOptions"
				label="Sort"
				outlined
				hide-details
			/>
		</div>
		<div class="d-flex flex-wrap justify-center align-center mb-4 mt-2">
			<!-- Empty Placeholder -->
			<template v-if="cards.length === 0">
				<div class="d-flex flex-column">
					<p>There are no cards in the scrap pile.</p>
					<v-icon x-large>
						mdi-cancel
					</v-icon>
				</div>
			</template>
			<!-- Cards in the scrap -->
			<card
				v-for="(card) in sortedCards"
				:key="card.id"
				class="mx-1 my-1"
				:suit="card.suit"
				:rank="card.rank"
				:data-scrap-dialog-card="`${card.rank}-${card.suit}`"
			/>
		</div>
	</div>
</template>

<script>
import Card from '@/components/GameView/Card.vue';
import { sortBy } from 'lodash';

export default {
	name: 'CardListSortable',
	components: {
		Card,
	},
	props: {
		cards: {
			type: Array,
			required: true,
		},
	},
	data() {
		return {
			sortByRank: false,
			sortOptions: [
				{text: 'Chronologically', value: false},
				{text: 'By Rank', value: true},
			],
		}
	},
	computed: {
		sortedCards() {
			return this.sortByRank ? sortBy(this.cards, 'rank') : this.cards;
		},
	}
}
</script>

<style lang="scss" scoped>
#select-wrapper {
	max-width: 300px;
}
</style>
