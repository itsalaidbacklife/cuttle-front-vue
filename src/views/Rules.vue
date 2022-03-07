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
			<h1>Rules of Cuttle</h1>
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
			<h1>Goal</h1>
			<p class="d-block">
				The goal is to be the first player to have 21 or more points worth of point cards on your field. 
				The first player to reach the goal wins immediately.
			</p>
		</v-row>
		<!-- Play -->
		<v-row>
			<h1>Play</h1>
		</v-row>
		<v-row>
			<v-col md="4">
				<rule-preview
					icon="cards-playing-spade-multiple"
					title="Draw"
					description="Take one card from the Deck"
					static-img="cuttle_ace_one_off.png"
				/>
			</v-col>
			<v-col md="4">
				<div>
					<div>
						<p>
							<v-icon color="black">
								mdi-cards-playing-spade-multiple
							</v-icon>
							<strong class="ml-2">Ace:</strong>
						</p>
						<v-img src="../assets/game_images/cuttle_ace_one_off.png" />
					</div>
				</div>
			</v-col>
			<v-col md="4">
				<div>
					<div>
						<p>
							<v-icon color="black">
								mdi-cards-playing-spade-multiple
							</v-icon>
							<strong class="ml-2">Ace:</strong>
						</p>
						<v-img src="../assets/game_images/cuttle_ace_one_off.png" />
					</div>
				</div>
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
}
</script>
<style scoped>
#logo {
	height: 20vh;
	margin: 0 auto;
}
</style>