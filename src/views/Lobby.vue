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
					data-cy="exit-button"
					@click="leave"
				>
					EXIT
				</v-btn>
			</v-col>
			<v-spacer />
			<v-col cols="3">
				<v-btn
					contained
					color="primary"
					data-cy="ready-button"
					@click="ready"
				>
					{{ readyButtonText }}
				</v-btn>
			</v-col>
		</v-row>
		<!-- Usernames -->
		<v-row>
			<v-col offset="1">
				<lobby-player-indicator
					:player-email="myUserName"
					:player-ready="iAmReady"
					data-cy="my-indicator"
				/>
			</v-col>
			<v-col offset="1">
				<lobby-player-indicator
					:player-email="opponentName"
					:player-ready="opponentIsReady"
					data-cy="opponent-indicator"
				/>
			</v-col>
		</v-row>
	</v-container>
</template>
<script>
import LobbyPlayerIndicator from '../components/LobbyPlayerIndicator';
import { mapGetters } from 'vuex';

export default {
	name: 'Lobby',
	components: {
		LobbyPlayerIndicator,
	},
	computed: {
		...mapGetters([
			'opponentName',
			'opponentIsReady',
			'myUserName'
		]),
		gameId() {
			return this.$store.state.game.id;
		},
		iAmReady() {
			return this.$store.state.game.myPNum === 0 ? this.$store.state.game.p0Ready : this.$store.state.game.p1Ready;
		},
		readyButtonText() {
			return this.iAmReady ? 'UNREADY' : 'READY';
		},
		opponentIsHere() {
			return this.$store.state.game.players.length == 2;
		},
	},
	mounted() {
		this.$store.dispatch('requestLobbyData');
	},
	methods: {
		ready() {
			this.$store.dispatch('requestReady');
		},
		leave() {
			this.$store.dispatch('requestLeaveLobby')
				.then(() => {
					this.$router.push('/');
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}
}
</script>