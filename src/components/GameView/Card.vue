<template>
	<v-card
		class="mx-4 player-card"
		:class="{'selected': isSelected, 'glasses': isGlasses, 'jack': isJack}"
		@click="$emit('click')"
	>
		<v-overlay
			v-ripple
			:value="isValidTarget"
			absolute
			color="accent"
			class="valid-move target-overlay"
			opacity=".8"
		/>
		<img
			v-if="isGlasses"
			:src="require(`../../assets/cards/Glasses_${suitName}.jpg`)"
			:alt="`Glasses - $${cardName}`"
		>
		<img
			v-else
			:src="require(`../../assets/cards/card_${suit}_${rank}.png`)"
			:alt="cardName"
		>
	</v-card>
</template>

<script>
export default {
	name: 'Card',
	props: {
		suit: {
			type: Number,
			required: true,
		},
		rank: {
			type: Number,
			required: true,
		},
		isSelected:{
			type: Boolean,
			default: false,
		},
		isValidTarget: {
			type: Boolean,
			default: false,
		},
		isGlasses: {
			type: Boolean,
			default: false,
		},
		isJack: {
			type: Boolean,
			default: false,
		},
		jacks: {
			type: Array,
			default: null,
		}
	},
	computed: {
		suitName() {
			switch(this.suit) {
			case 0:
				return 'Clubs';
			case 1:
				return 'Diamonds';
			case 2:
				return 'Hearts';
			case 3:
				return 'Spades';
			default:
				return 'Invalid Suit Error';
			}
		},
		rankName() {
			switch(this.rank) {
			case 1:
				return 'Ace';
			case 2:
				return 'Two';
			case 3:
				return 'Three';
			case 4:
				return 'Four';
			case 5:
				return 'Five';
			case 6:
				return 'Six';
			case 7:
				return 'Seven';
			case 8:
				return 'Eight';
			case 9:
				return 'Nine';
			case 10:
				return 'Ten';
			case 11:
				return 'Jack';
			case 12:
				return 'Queen';
			case 13:
				return 'King';
			default:
				return 'Invalid Rank Error'
			}
		},
		cardName() {
			return `${this.rankName} of ${this.suitName}`;
		}
	}
}
</script>
<style scoped lang="scss">
.player-card {
  position: relative;
	height: 20vh;
	width: calc(20vh / 1.45);
  min-width: calc(20vh / 1.45);

  & img {
	width: 100%;
	display: block;
	position: relative;
  }

  &.glasses {
	  transform: scale(1.3);
  }
}
.selected {
	transform: scale(1.23);
	img {
		border: 3px solid var(--v-accent-lighten1);
		border-radius: 5px;
	}
}
.jack {
	height: 14vh;
	margin-bottom: -12vh;
	width: calc(14vh / 1.45);
	min-width: calc(14vh / 1.45);
	overflow: visible;

	& img {
		height: 14vh;
		width: calc(14vh / 1.45);
		background-size: cover;
		display: block;
		position: relative;
	}
}
.target-overlay {
	cursor: pointer;
}
</style>
