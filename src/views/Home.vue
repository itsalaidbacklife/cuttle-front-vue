<template>
	<div class="home">
		<div class="container">
			<v-btn
				id="btn-logout"
				rounded
				color="primary"
				data-cy="btn-logout"
				@click="logout"
			>
				Logout
			</v-btn>
			<img
				id="logo"
				alt="Vue logo"
				src="../assets/logo.png"
			>
			<h1 class="page-title">
				CUTTLE
			</h1>
			<div id="game-list-card">
				<h2 id="home-card-title">
					Games
				</h2>
				<v-row>
					<v-col cols="9">
						<div id="game-list">
							<p
								v-if="gameList.length === 0"
								data-cy="text-if-no-game"
							>
								No Active Games
							</p>
							<div
								v-for="game in gameList"
								:key="game.id"
							>
								<game-list-item
									:name="game.name"
									:p0ready="game.p0Ready ? 1 : 0"
									:p1ready="game.p1Ready ? 1 : 0"
									:game-id="game.id"
								/>
							</div>
						</div>
					</v-col>
					<v-col
						id="side-nav"
						cols="3"
					>
						<v-btn
							rounded
							color="primary"
							href="https://human-ai-interaction.github.io/cuttle-bot/"
							target="_blank"
						>
							Play with AI
						</v-btn>
					</v-col>
				</v-row>
				<v-row>
					<h2>Create Game</h2>
					<v-text-field
						v-model="newGameName"
						outlined
						data-cy="create-game-input"
						@keyup.enter="submitNewGame"
					/>
					<v-btn
						color="primary"
						data-cy="create-game-btn"
						@click="submitNewGame"
					>
						Submit
					</v-btn>
				</v-row>
			</div>
		</div>
	</div>
</template>
<script>
import GameListItem from "@/components/GameListItem.vue";
export default {
	name: "Home",
	components: {
		// HelloWorld
		GameListItem
	},
	data() {
		return {
			newGameName: ""
		};
	},
	computed: {
		gameList() {
			return this.$store.state.gameList.games;
		}
	},
	mounted() {
		this.$store.dispatch("requestGameList");
	},
	methods: {
		submitNewGame() {
			console.log("submitting new game");
			this.$store
				.dispatch("requestCreateGame", this.newGameName)
				.then(() => {
					this.newGameName = "";
				})
				.catch(() => {
					console.log("Error creating game");
				});
		},
		logout(){
			console.log("loggin out")
			this.$store
				.dispatch("requestLogout")
				.then(() => {
					this.$router.push("/login");
				})
				.catch((err) => {
					if (err) console.error(err)
					console.log("Error logging out");
				});
		}
	}
};
</script>
<style scoped lang="scss">
.container {
  width: 75%;
  margin: 10px auto;
  display: flex;
  justify-content: center;
  flex-direction: column;
}

#logo {
  margin: 0 auto;
}

#btn-logout {
	position: absolute;
	top: 5px;
	right: 5px;
}

.page-title {
  margin: 0 auto;
  text-align: center;
}

#game-list-card {
  border-radius: 15px;
  padding: 45px;
  -webkit-box-shadow: 1px 2px 6px 3px rgba(119, 119, 119, 0.24);
  box-shadow: 1px 2px 6px 3px rgba(119, 119, 119, 0.24);
}

#game-list {
  background-color: #efefef;
  min-height: 30vh;
  max-height: 50vh;
  overflow: auto;
  display: flex;
  flex-direction: column;
  padding: 20px 10px;

  p {
    text-align: center;
  }
}

#side-nav {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

#home-card-title {
  font-size: 2em;
}

p {
  margin-top: 16px;
}
</style>