<template>
	<div>
		<div
			class="editToggler btn"
			v-if="adminLoggedIn"
			@click="$store.commit('toggleEditMode')"
		>
			<i class="fa fa-edit"></i>
		</div>

		<modal :height="'auto'" name="login">
			<login></login>
		</modal>
		<modal :height="'auto'" name="logout">
			<logout></logout>
		</modal>
		<app-header></app-header>
		<keep-alive max="5">
			<div class="min-h">
				<transition name="v-router" mode="out-in">
					<router-view />
				</transition>
			</div>
		</keep-alive>
		<app-footer></app-footer>
	</div>
</template>

<script>
import appHeader from './components/mainComps/Header'
import appFooter from './components/mainComps/Footer'
import { mapState, mapActions } from 'vuex'

export default {
	components: {
		appHeader,
		appFooter,
		login: () => import('./components/mainComps/Login'),
		logout: () => import('./components/mainComps/Logout')
	},

	created() {
		this.checkUser()
	},
	methods: {
		...mapActions('Auth', ['checkUser'])
	},
	head() {
		return {
			title: 'Shokhboz Abdullayev',
			titleTemplate: '%s | shox-pro.com'
		}
	},
	computed: {
		currentYear() {
			return new Date().getFullYear()
		},
		...mapState('Auth', ['adminLoggedIn'])
	}
}
</script>

<style>
.min-h {
	min-height: 100vh !important;
}

.publish-btn {
	position: fixed !important;
	top: 25px;
	right: 55px;
	z-index: 100;
}
.vm--modal {
	background: transparent !important;
}
</style>
