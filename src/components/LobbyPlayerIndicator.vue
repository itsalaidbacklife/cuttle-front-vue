<template>
	<div
		class="player-indicator"
		:class="{'ready': playerReady, 'player-in': playerEmail != null}"
		elevation="1"
	>
		<div class="avatar text-truncate">
			<h3>
				{{ message }}
			</h3>
		</div>
		<div v-if="playerReady" class="ready-overlay text-truncate mt-2">
			READY
		</div>
	</div>
</template>

<script>
export default {
	name: 'LobbyPlayerIndicator',
	props: {
		playerEmail: {
			type: String,
			default: null,
		},
		playerReady: {
			type: Boolean,
			default: false,
		}
	},
	computed: {
		message() {
			return this.playerEmail || 'Invite'
		}
	}
}
</script>

<style lang="scss" scoped>
.player-indicator {
	position: relative;
    display: inline-flex;
    justify-content: center;
    align-items: center;
	background-color: var(--v-neutral-lighten3);
    padding: 48px;
	border-radius: 8px;
}
.player-in {
	background-image: linear-gradient(45deg, var(--v-secondary-base), var(--v-primary-base));
}
.avatar {
	display: inline-block;
	position: relative;
	width: 200px;
	height: 200px;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	border: 4px dashed var(--v-accent-darken1);
	background-color: var(--v-neutral-base)
}
.ready .avatar {
    border: 4px solid var(--v-accent-base);
}
.ready-overlay {
	display: flex;
	position: absolute;
	justify-content: center;
	align-items: flex-end;
	padding-bottom: 16px;
	padding-top: 16px;
	height: 100%;
	width: 100%;
	// background-color: rgba(0, 0, 0, .3);
	color: #ffffff;
	border-radius: 8px;
	font-size: 1.5rem;
}
</style>