<template>
	<div class="home">
		<div class="container">
			<img
				id="logo"
				alt="Vue logo"
				src="../assets/logo.png"
			>
			<h1 class="page-title">
				HOME PAGE
			</h1>
			<div id="game-list-card">
				<h2 id="home-card-title">
					Games
				</h2>
				<v-row>
					<v-col cols="9">
						<div id="game-list">
							<div
								v-for="game in gameList"
								:key="game.id"
							>
								<game-list-item
									:name="game.name"
									:p0ready="game.p0Ready ? 1 : 0"
									:p1ready="game.p1Ready ? 1 : 0"
								/>
							</div>
						</div>
					</v-col>
					<v-col cols="2">
						<v-btn
							rounded
							color="primary"
						>
							Play with AI
						</v-btn>
					</v-col>
				</v-row>
			</div>
		</div>
	</div>
</template>
<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";
import GameListItem from "@/components/GameListItem.vue";
export default {
	name: "Home",
	components: {
		// HelloWorld
		GameListItem
	},
	computed: {
		gameList() {
			return this.$store.state.gameList.games;
		},
	},
	mounted() {
		this.$store.dispatch('requestGameList');
	}
};
</script>
<style scoped lang="scss">
.container {
	width: 50%;
	margin: 10px auto;
	display: flex;
	justify-content: center;
	flex-direction: column;
}
#logo {
	margin: 0 auto;
}
.page-title{
	margin: 0 auto;
	text-align: center;
}
#game-list-card{
	border-radius: 15px;
	padding: 45px;
	-webkit-box-shadow: 1px 2px 6px 3px rgba(119,119,119,0.24) ;
	box-shadow: 1px 2px 6px 3px rgba(119,119,119,0.24) ;
}
#game-list{
	background-color: #efefef;
}
#home-card-title{
	font-size: 2em;
}
#login-container button.v-btn {
  padding: 0 32px 0;
}
#login-button-container {
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
}
p {
  margin-top: 16px;
}
</style>