<template>
	<v-container id="login-container">
		<v-row>
			<!-- Left side form -->
			<v-col
				cols="5"
			>
				<h1>Login</h1>
				<v-text-field
					outlined
					hint="Username"
				/>
				<v-text-field
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
						Log In
					</v-btn>
				</div>

				<p>Don't Have an account?
					<v-btn
						text
						color="primary"
					>
						Sign Up
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
		}
	},
	methods: {
		submitLogin() {
			console.log('Submitting Login from vue component');
			this.$store.dispatch('requestLogin', {
				email: this.username,
				password: this.password,
			});
		},
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