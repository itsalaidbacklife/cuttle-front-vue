<template>
	<div class="home">
		<div class="container">
			<v-btn
				id="btn-logout"
				rounded
				outlined
				color="primary"
				data-cy="btn-logout"
				@click="logout"
			>
				Logout
			</v-btn>
			
			<div id="game-list-card">
				<v-row>
					<v-col cols="9">
						<v-row id="card-content-header">
							<v-col cols="3">
								<h1 id="home-card-title">
									Games
								</h1>
							</v-col>
							<v-col cols="9">
								<v-row id="add-new-game">
									<v-col cols="3">
										<h2>Create Game</h2>
									</v-col>
									<v-col cols="5">
										<v-text-field
											v-model="newGameName"
											outlined
											hide-details
											:dense="$vuetify.breakpoint.mdAndDown ? true : false"
											data-cy="create-game-input"
											@keyup.enter="submitNewGame"
										/>
									</v-col>
									<v-col cols="4">
										<v-btn
											color="primary"
											:small="$vuetify.breakpoint.mdAndDown ? true : false"
											data-cy="create-game-btn"
											@click="submitNewGame"
										>
											Create New Game
										</v-btn>
									</v-col>
								</v-row>
							</v-col>
						</v-row>
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
									:status="game.status"
									:num-players="game.numPlayers"
								/>
							</div>
						</div>
					</v-col>
					<v-col
						id="side-nav"
						cols="3"
					>
						<img
							id="logo"
							alt="Vue logo"
							src="../assets/logo.png"
						>
						<v-btn
							rounded
							outlined
							color="secondary"
							:small="$vuetify.breakpoint.mdAndDown ? true : false"
							href="https://human-ai-interaction.github.io/cuttle-bot/"
							target="_blank"
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
  width: 90%;
  margin: 10vh auto;
  display: flex;
  justify-content: center;
  flex-direction: column;
}

h1 {
	background: linear-gradient(268.89deg, rgba(98, 2, 238, 0.87) 73.76%, rgba(253, 98, 34, 0.87) 99.59%);
	background-clip: text;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
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
  padding: 20px;
}

#card-content-header {
	display: flex;
	align-items: center;
}

#add-new-game {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
}

#game-list {
  background: #EFEFEF;
	border: 1px solid #FD6222;
	box-sizing: border-box;
	border-radius: 15px;
	min-height: 55vh;
  max-height: 80vh;
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

@media (max-width: 979px) and (orientation: landscape) {
	h2 {
		font-size: 1.25rem;
	}

	#logo {
		width: 64px;
		height: 64px;
	}

	.container {
		width: 95%;
		margin: 0 auto;
		max-height: 95vh;
	}

	#game-list-card {
	  padding: 5px;
	}

	#game-list {
		box-sizing: border-box;
		border-radius: 10px;
		min-height: 55vh;
		max-height: 60vh;
		overflow: auto;
		display: flex;
		flex-direction: column;
		padding: 5px;

		p {
			text-align: center;
		}
	}

	#card-content-header {
		padding: 0;
		display: flex;
		align-items: center;
	}

}
</style>