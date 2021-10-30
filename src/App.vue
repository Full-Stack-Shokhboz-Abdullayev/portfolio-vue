<template>
	<div>
		<div
			class="editToggler btn"
			v-if="adminLoggedIn"
			@click="$store.commit('toggleEditMode')"
		>
			<i class="fa fa-edit"></i>
		</div>

		<modal :draggable="draggable" :height="'auto'" name="login">
			<login></login>
		</modal>
		<modal :draggable="draggable" :height="'auto'" name="logout">
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
		if (process.env.NODE_ENV === 'production') {
			console.log = () => {}
		}
	},
	methods: {
		...mapActions('Auth', ['checkUser'])
	},
	head() {
		return {
			title: "Shokhboz Abdullaev's Blog/Portfolio",
			titleTemplate: '%s | shox-pro.com',
			meta: [
				{
					property: 'og:image',
					content: 'https://shox-pro.com/assets/photo1-min.jpg'
				},

				{
					property: 'og:site_name',
					content: "Shokhboz Abdullaev's Blog/Portfolio"
				},
				{ property: 'og:type', content: 'website' },

				{
					property: 'og:url',
					content: 'https://shox-pro.com'
				},
				{ name: 'robots', content: 'index,follow' }
			]
		}
	},
	computed: {
		currentYear() {
			return new Date().getFullYear()
		},
		...mapState('Auth', ['adminLoggedIn']),
		draggable() {
			const toMatch = [
				/Android/i,
				/webOS/i,
				/iPhone/i,
				/iPad/i,
				/iPod/i,
				/BlackBerry/i,
				/Windows Phone/i
			]

			return !toMatch.some((toMatchItem) => {
				return navigator.userAgent.match(toMatchItem)
			})
		}
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
.vm--container {
	z-index: 1500 !important;
}
</style>
