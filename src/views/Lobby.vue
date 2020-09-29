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
					data-cy="ready-button"
					@click="ready"
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
			'opponentIsReady'
		]),
		gameId() {
			return this.$store.state.game.id;
		},
		iAmReady() {
			return this.$store.state.game.myPNum === 0 ? this.$store.state.game.p0Ready : this.$store.state.game.p1Ready;
		},
		opponentIsHere() {
			return this.$store.state.game.players.length == 2;
		},
		opponentIsReady() {
			return this.opponentIsHere && this.$store.state.game.myPNum === 0 ? this.$store.state.game.p1Ready : this.$store.state.game.p0Ready;
		}
	},
	methods: {
		ready() {
			this.$store.dispatch('requestReady');
		}
	},
	mounted() {
		this.$store.dispatch('requestLobbyData');
	}
}
</script>