<template>
	<v-menu :close-on-content-click="true">
		<!-- Activator -->
		<template #activator="{ on, attrs }">
			<v-btn
				id="game-menu-activator"
				v-bind="attrs"
				class="ma-2"
				icon
				v-on="on"
			>
				<v-icon large color="neutral lighten-1">mdi-cog</v-icon>
			</v-btn>
		</template>
		<!-- Menu -->
		<v-list id="game-menu">
			<!-- Concede Dialog (Initiate + Confirm) -->
			<v-dialog>
				<template #activator="dialogActivator">
					<v-list-item
						v-bind="dialogActivator.attrs"
						data-cy="concede-initiate"
						v-on="dialogActivator.on"
					>
						Concede
					</v-list-item>
				</template>
				<v-card id="concede-menu">
					<v-card-title>Concede?</v-card-title>
					<v-card-text>
						The game will end and your opponent will win.
					</v-card-text>
					<v-card-actions class="d-flex justify-end">
						<v-btn text color="primary">
							Cancel
						</v-btn>
						<v-btn color="error" depressed data-cy="concede-confirm" @click="concede">
							Concede
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</v-list>
	</v-menu>
</template>

<script>
export default {
	name: 'GameMenu',
	methods: {
		concede() {
			this.$store.dispatch('requestConcede');
		},
	}
}
</script>