<template>
	<v-card
		ripple
		:disabled="disabled"
		:class="{'pointer': !disabled}"
	>
		<v-card-title class="d-flex justify-center">
			<h2>{{ moveName }}</h2>
		</v-card-title>
		<v-card-text class="d-flex flex-column justify-center align-center">
			<v-icon v-if="iconName" x-large>
				{{ iconName }}
			</v-icon>
			<p>{{ moveDescription }}</p>
			<p
				v-if="disabled && !!disabledExplanation"
				class="red--text"
			>
				{{ disabledExplanation }}
			</p>
		</v-card-text>
	</v-card>
</template>
<script>
export default {
	name: 'MoveChoiceCard',
	props: {
		moveName: {
			type: String,
			required: true,
		},
		moveDescription: {
			type: String,
			default: '',
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		disabledExplanation: {
			type: String,
			default: '',
		},
	},
	computed: {
		/**
		 * Returns string name of which icon to display
		 */
		iconName() {
			switch(this.moveName) {
			case 'Points':
				return 'mdi-numeric';
			case 'Scuttle':
				return 'mdi-skull-crossbones';
			case 'One-Off':
				return 'mdi-delete';
			case 'Glasses':
				return 'mdi-sunglasses';
			case 'Royal':
				return 'mdi-crown';
			default:
				return null;
			}
		},
	}
}
</script>

<style scoped lang="scss">
.pointer {
	cursor: pointer;
}
</style>