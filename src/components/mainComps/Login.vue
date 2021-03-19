<template>
	<div class="theme-bg-light login">
		<h3 class="login__title text-center mb-3">Login as Admin.</h3>
		<p class="login__description mb-5 text-center">
			To manage the website you need first authorization.
		</p>
		<button @click="closeLogin" class="close-btn btn">
			<i class="fal fa-times"></i>
		</button>
		<transition name="rotated">
			<div v-if="!success" class="bg-danger error-box mb-5 py-2">
				<p class="text-center text-light mb-0">
					{{ error }}
				</p>
			</div>
		</transition>
		<form
			class="login__form validate-form"
			@submit.prevent="authLogin"
			autocomplete="off"
		>
			<div
				class="wrap-input2 w-100 validate-input position-relative"
				data-validate="Valid email is required: ex@abc.xyz"
			>
				<input
					autocomplete="off"
					class="input2"
					type="email"
					name="email"
					v-model.trim="credentials.email"
					required
					@change="validate"
				/>
				<div class="grey"></div>
				<div class="slide"></div>
				<div class="cword">{{ $t('contact.form.email') }}</div>

				<span class="focus-input2" data-placeholder="EMAIL" />
			</div>
			<div
				class="wrap-input2 w-100 validate-input position-relative"
				data-validate="Valid email is required: ex@abc.xyz"
			>
				<input
					autocomplete="off"
					class="input2"
					type="password"
					name="password"
					v-model.trim="credentials.password"
					required
					@change="validate"
				/>
				<div class="grey"></div>
				<div class="slide"></div>
				<div class="cword">Password</div>

				<span class="focus-input2" data-placeholder="Passowrd" />
			</div>

			<div class="container-contact2-form-btn mt-5">
				<div class="wrap-contact2-form-btn">
					<div class="contact2-form-bgbtn" />
					<button
						class="contact2-form-btn position-relative btn mx-auto btn-block w-50"
					>
						Login

						<app-loading
							v-if="loggingIn"
							:condition="loggingIn"
							:small="true"
						></app-loading>
						<!-- <div class="ct" :class="{ shown: sent }">
							<svg viewBox="0 0 100 100">
								<polyline
									id="tick"
									points="25.5,53.5 39.5,67.5 72.5,34.5"
								/>
							</svg>
						</div> -->
					</button>
				</div>
			</div>
		</form>
	</div>
</template>

<script>
import validate from '../../assets/jsComponents/validate'
import { mapActions } from 'vuex'
export default {
	data: () => ({
		error: '',
		success: true,
		loggingIn: false,
		credentials: {
			email: '',
			password: ''
		}
	}),
	methods: {
		...mapActions('Auth', ['login']),
		validate,
		async authLogin() {
			this.loggingIn = true
			const result = await this.login(this.credentials)

			this.success = result.success
			if (result.success) {
				this.closeLogin()
			} else if (!result.success) {
				this.error = result.error
			}
			this.loggingIn = false
		},
		closeLogin() {
			this.$modal.hide('login')
		}
	}
}
</script>

<style lang="scss">
.login {
	padding: 50px;
	width: 100%;
	transition: 0.2s ease-in-out height !important;
}
.close-btn {
	background: transparent !important;
	position: absolute;
	top: 20px;
	right: 20px;
}
.login__form {
	width: 100% !important;
	input {
		width: 100%;
	}
}
.cursor {
	cursor: pointer;
}
.error-box {
	border-radius: 5px;
}
</style>
