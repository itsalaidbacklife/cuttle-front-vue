<template>
	<div class="rule-preview">
		<v-img
			v-if="!animate"
			:src="require(`../assets/game_images/${staticImg}`)"
			:alt="`How to play ${title} in Cuttle`"
		/>
		<v-img
			v-else
			:src="animatedImg"
			aspect-ratio="1.7778"
			:alt="`Animated preview of ${title} in Cuttle`"
		/>
		<p class="mt-2">
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
		<div class="d-flex justify-center">
			<v-btn
				outlined
				@click="$emit('click', !animate)"
			>
				<v-icon>mdi-play</v-icon>
				Preview Move
			</v-btn>
		</div>
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