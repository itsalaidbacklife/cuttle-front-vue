<template>
	<v-container>
		<v-row>
			<img
				id="logo"
				alt="Cuttle logo"
				src="../assets/logo.png"
				height="20vh"
			>
		</v-row>
		<!-- Rules -->
		<div>
			<h1 class="gradient-text">Rules of Cuttle</h1>
			<p class="d-block">
				Cuttle is a 2 player battle card game played with a standard 52-card deck of cards. 
				It has the strategic nuance of trading card games like Magic, with the elegant balance of a standard deck--and you can play it for free! 
				Test your mettle in the deepest cardgame under the sea!
			</p>
			<div class="d-flex justify-center">
				<v-btn
					to="login"
					text
					color="primary"
				>
					Sign Up To Play Online
				</v-btn>
			</div>
		</div>
		<!-- Goal -->
		<v-row class="flex-column align-start mt-10">
			<h1 class="gradient-text">Goal</h1>
			<p class="d-block">
				The goal is to be the first player to have 21 or more points worth of point cards on your field. 
				The first player to reach the goal wins immediately.
			</p>
		</v-row>
		<!-- Play -->
		<v-row class="flex-column">
			<h1 class="d-block gradient-text">
				Play
			</h1>
			<p class="d-block">
				On your turn you must perform exactly one of the following actions:
			</p>
		</v-row>
		<v-row
			v-for="(ruleRow, rowIndex) in rules"
			:key="rowIndex"
			align="start"
			class="my-6"
		>
			<v-col
				v-for="(rule, colIndex) in ruleRow"
				:key="rule.title"
				md="6"
				sm="12"
			>
				<rule-preview
					v-bind="rule"
					:animate="isRuleSelected(rowIndex, colIndex)"
					@click="selectRule(rowIndex, colIndex)"
				/>
			</v-col>
		</v-row>
	</v-container>
</template>
<script>
import RulePreview from '@/components/RulePreview.vue';

export default {
	name: 'Rules',
	components: {
		RulePreview,
	},
	data() {
		return {
			// Indices in 2d array of rules for active rule
			activeRuleIndices: [],
			rules: [
				// First Row
				[
					{
						title: 'Draw',
						icon: 'cards-playing-spade-multiple',
						description: 'Take one card from the Deck',
						staticImg: 'cuttle_board.png',
						animatedImg: 'https://github.com/cuttle-cards/cuttle-assets/blob/main/assets/draw.gif?raw=true',
					},
					{
						title: 'Points',
						icon: 'numeric',
						description: 'Play a number card from your hand. Worth its rank in points, lasts until scrapped',
						staticImg: 'cuttle_points.png',
						animatedImg: 'https://github.com/cuttle-cards/cuttle-assets/blob/main/assets/points.gif?raw=true',
					},
				],
				// Second Row
				[
					{
						title: 'Scuttle',
						icon: 'skull-crossbones',
						description: 'Scrap an opponent’s point card with a bigger one from your hand',
						staticImg: 'cuttle_scuttle.png',
						animatedImg: 'https://github.com/cuttle-cards/cuttle-assets/blob/main/assets/scuttling.gif?raw=true',
					},
					{
						title: 'Royal',
						icon: 'crown',
						description: 'Play a face card for a persistent benefit based on rank (lasts until scrapped)',
						staticImg: 'cuttle_king.png',
						animatedImg: 'https://github.com/cuttle-cards/cuttle-assets/blob/main/assets/kings.gif?raw=true',
					},
				],
				// Third Row
				[
					{
						title: 'One-Off',
						icon: 'delete',
						description: 'Scrap a number card for an effect based on the rank of the card.',
						staticImg: 'cuttle_one_off_six.png',
						animatedImg: 'https://github.com/cuttle-cards/cuttle-assets/blob/main/assets/six.gif?raw=true',
					},
					{
						title: 'Glasses',
						icon: 'sunglasses',
						description: 'Play an Eight to reveal your opponent’s hand (lasts until scrapped)',
						staticImg: 'cuttle_glasses.png',
						animatedImg: 'https://github.com/cuttle-cards/cuttle-assets/blob/main/assets/glasses.gif?raw=true',
					}
				],
			],
		};
	},
	methods: {
		selectRule(rowIndex, colIndex) {
			if (this.isRuleSelected(rowIndex, colIndex)) {
				this.activeRuleIndices = [];
			}
			else {
				this.activeRuleIndices = [rowIndex, colIndex];
			}
		},
		isRuleSelected(rowIndex, colIndex) {
			if (this.activeRuleIndices.length ===2
			&& rowIndex === this.activeRuleIndices[0]
			&& colIndex === this.activeRuleIndices[1]) {
				return true;
			}
			return false;
		}
	}
}
</script>
<style scoped>
#logo {
	height: 20vh;
	margin: 0 auto;
}
</style>