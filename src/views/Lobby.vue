<template>
	<v-container id="lobby-wrapper">
		<v-row>
			<v-col offset="1">
				<h1>Lobby for {{ gameId }}</h1>
			</v-col>
		</v-row>
		<v-row>
			<v-col
				cols="3"
				offset="1"
			>
				<v-btn
					outlined
					color="primary"
				>
					EXIT
				</v-btn>
			</v-col>
			<v-spacer />
			<v-col cols="3">
				<v-btn
					contained
					color="primary"
					@click="iAmReady = !iAmReady"
				>
					READY
				</v-btn>
			</v-col>
		</v-row>
		<!-- Usernames -->
		<v-row>
			<v-col offset="1">
				<lobby-player-indicator
					:player-email="$store.state.auth.email"
					:player-ready="iAmReady"
				/>
			</v-col>
		</v-row>
	</v-container>
</template>
<script>
import LobbyPlayerIndicator from '../components/LobbyPlayerIndicator';

export default {
	name: 'Lobby',
	components: {
		LobbyPlayerIndicator,
	},
	data() {
		return {
			iAmReady: false,
		}
	},
	computed: {
		gameId() {
			return this.$store.state.game.gameId;
		}
	}
}
</script>