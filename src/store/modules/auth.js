import asyncGetter from '@/assets/jsComponents/asyncGetter'
import {
	setWithExpiry,
	getWithExpiry,
	days
} from '@/assets/jsComponents/localStorageExpire'
// import Vue from 'vue'

const state = {
	adminLoggedIn: false
}

const mutations = {
	login(state, user) {
		state.adminLoggedIn = user.role === 'admin'
	},
	logout(state) {
		state.adminLoggedIn = false
		localStorage.removeItem('jid256')
	}
}

const actions = {
	async login({ commit }, payload) {
		const response = await asyncGetter('/auth/login', {
			post: true,
			auth: true,
			body: { ...payload }
		})
		if (response.success) {
			setWithExpiry('jid256', response.token, days(10))
			commit('login', response.user)
			return { success: response.success } //success
		}
		return response //failure
	},
	async checkUser({ commit }) {
		const token = getWithExpiry('jid256')
		if (!token) {
			return
		}
		const response = await asyncGetter('/auth/auto-login', {
			post: true,
			body: {},
			requiresAuth: true
		})
		if (response.success) {
			commit('login', response.user)
		} else if (!response.success) {
			localStorage.removeItem('jid256')
		}
	},

	async logout({ commit }) {
		const data = await asyncGetter('/auth/logout', { get: true })

		if (data.success) {
			commit('logout')
		}
	}
}

export default {
	state,
	mutations,
	actions,
	namespaced: true
}
