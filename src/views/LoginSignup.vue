<template>
	<v-container id="login-container">
		<v-row>
			<!-- Left side form -->
			<v-col
				cols="5"
			>
				<h1>{{ buttonText }}</h1>
				<v-text-field
					v-model="username"
					outlined
					hint="Username"
				/>
				<v-text-field
					v-model="pw"
					outlined
					hint="Password"
					type="password"
				/>
				<div id="login-button-container">
					<v-btn
						color="primary"
						rounded
						@click="submitLogin"
					>
						{{ buttonText }}
					</v-btn>
				</div>

				<p>
					{{ switchLabelText }}
					<v-btn
						text
						color="primary"
						@click="switchMode"
					>
						{{ inverseButtonText }}
					</v-btn>
				</p>
			</v-col>

			<!-- Middle Divider -->
			<v-spacer/>
				<v-divider
					vertical
				/>
			<v-spacer/>

			<!-- Right side form -->
			<v-col
				cols="5"
			>
				<h2>Or</h2>
				<v-btn
					color="primary"
					rounded
				>
					Log in with Google
				</v-btn>
			</v-col>			
		</v-row>
	</v-container>
</template>

<script>
export default {
	name: 'LoginSignup',
	data() {
		return {
			username: '',
			pw: '',
			isLoggingIn: true,
		}
	},
	computed: {
		isSigningUp() {
			return !this.isLoggingIn;
		},
		buttonText() {
			if (this.isLoggingIn) {
				return 'Log In';
			}
			return 'Sign Up';
		},
		inverseButtonText() {
			if (this.isLoggingIn) {
				return 'Sign Up';
			}
			return 'Log In';
		},
		switchLabelText() {
			if (this.isLoggingIn) {
				return "Don't have an account?"
			}
			return 'Already have an account?'
		}
	},
	methods: {
		submitLogin() {
			if (this.isLoggingIn) {
				this.$store.dispatch('requestLogin', {
					email: this.username,
					password: this.pw,
				})
				.then(() => {
					this.username = '';
					this.pw = '';
					this.$router.push('/');
				})
				.catch(() => {
					console.log('Error logging in');
				});
			} else {
				this.$store.dispatch('requestSignup', {
					email: this.username,
					password: this.pw,
				})
				.then(() => {
					console.log('Success logging in');
					console.log(this.$store.state.auth.authenticated);
					this.username = '';
					this.pw = '';
					this.$router.push('/');
				})
				.catch(() => {
					// Handle Error
					console.log('Error signing up');
				});
			}
		},
		switchMode() {
			this.isLoggingIn = !this.isLoggingIn;
			this.pw = '';
		}
	},
}
</script>

<style scoped lang="scss">
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