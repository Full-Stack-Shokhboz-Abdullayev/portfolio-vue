<template>
	<div class="logout-dialog py-4 theme-bg-light">
		<button @click="closeLogout" class="close-btn btn">
			<i class="fal fa-times"></i>
		</button>
		<h3 class="logout-dialog__title text-center">
			Are you sure to logout?
		</h3>
		<div
			class="btn-container d-flex justify-content-around align-items-center"
		>
			<button @click="closeLogout" class="btn btn-danger">Cancel</button>
			<button @click="logoutAndClose" class="btn">Yes, sure.</button>
		</div>
	</div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
	methods: {
		closeLogout() {
			this.$modal.hide('logout')
			const routeName = this.$route.name
			if (routeName === 'add-blog') {
				this.$router.push({ name: 'blog' })
			}
		},
		async logoutAndClose() {
			await this.logout()
			this.closeLogout()
		},
		...mapActions('Auth', ['logout'])
	}
}
</script>

<style scoped>
.btn-container {
	margin-top: 5.5rem;
}
</style>
