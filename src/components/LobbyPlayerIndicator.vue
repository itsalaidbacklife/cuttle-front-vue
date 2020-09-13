<template>
	<div
		class="player-indicator"
		:class="{'ready': playerReady}"
	>
		<h3>
			{{ message }}
		</h3>
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

<style>
.player-indicator {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    height: 200px;
    width: 200px;
    background-color: #C4C4C4;
    padding: 16px;
}
.ready {
    border: 4px solid #4CAF50;
}
</style>