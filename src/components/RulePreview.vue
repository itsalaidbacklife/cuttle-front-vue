<template>
	<div class="rule-preview">
		<p>
			<v-icon
				v-if="icon"
				color="black"
				class="mr-2"
			>
				mdi-{{ icon }}
			</v-icon>
			<strong>{{ title }}:</strong>
			{{ description }}
		</p>
		<v-img v-if="!animate" :src="require(`../assets/game_images/${staticImg}`)" />
		<!-- <v-img :src="require(staticImg)"></v-img> -->
		<!-- {{staticImg2}} -->
	</div>
</template>
<script>
export default {
	name: 'RulePreview',
	props: {
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		animatedImg: {
			type: String,
			default: '',
		},
		staticImg: {
			type: String,
			required: true,
		},
		animate: {
			type: Boolean,
			default: false,
		},
		icon: {
			type: String,
			default: '',
		},
	},
	computed: {
		// staticImg2() {
		// 	return require(this.staticImg);
		// }
	}
}
</script>