<template>
	<v-dialog
		v-model="show"
		persistent
	>
		<v-card>
			<v-card-title>Reconnect to Game</v-card-title>
			<v-card-text>
				<p>
					You have disconnected due to inactivity. Log in again to resume your session
				</p>
				<!-- Login Form -->
				<v-text-field
					v-model="username"
					outlined
					:dense="$vuetify.breakpoint.mdAndDown ? true : false"
					label="Email"
					data-cy="username"
				/>
				<v-text-field
					v-model="password"
					outlined
					label="Password"
					:dense="$vuetify.breakpoint.mdAndDown ? true : false"
					type="password"
					data-cy="password"
				/>
			</v-card-text>
			<v-card-actions class="d-flex justify-end">
				<v-btn
					color="primary"
					depressed
					@click="login"
				>
					Log In
				</v-btn>
			</v-card-actions>
		</v-card>
		<v-snackbar
			v-if="showSnackBar"
			color="error"
			class="d-flex justify-space-between"
		>
			{{ snackBarMessage }}
			<v-btn
				icon
				@click="clearSnackBar"
			>
				<v-icon>mdi-close</v-icon>
			</v-btn>
		</v-snackbar>
	</v-dialog>
</template>

<script>
export default {
	name: 'ReauthenticateDialog',
	props: {
		value: {
			type: Boolean,
			required: true,
		},
	},
	data() {
		return {
			username: this.$store.state.auth.email,
			password: '',
			isLoggingIn: true,
			showSnackBar: false,
			snackBarMessage: '',
		}
	},
	computed: {
		show: {
			get() {
				return this.value;
			},
			set(val) {
				this.$emit('input', val);
			},
		},
	},
	methods: {
		login() {
			this.isLoggingIn = true;
			this.$store.dispatch('requestReauthenticate', {
				email: this.username,
				password: this.password,
			}).then(() => {
				this.clearSnackBar();
				this.clearForm();
				this.isLoggingIn = false;
				this.$emit('reauthenticated');
			})
				.catch(this.handleError);
		},
		handleError(message) {
			this.showSnackBar = true;
			this.snackBarMessage = message;
			this.isLoggingIn = false;
		},
		clearSnackBar() {
			this.showSnackBar = false;
			this.snackBarMessage = '';
		},
		clearForm() {
			this.username = '';
			this.password = '';
		}
	}
}
</script>