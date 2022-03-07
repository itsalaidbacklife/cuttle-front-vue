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
}
</script>