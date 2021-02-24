import asyncGetter from '@/assets/jsComponents/asyncGetter'
import Vue from 'vue'

const state = {
	projects: [],
	featuredProjects: []
}

const getters = {
	projectsLoading(state) {
		return state.projects.length === 0
	}
}

const mutations = {
	setFeaturedProjects(state, payload) {
		state.featuredProjects = payload
	},
	setProjects(state, payload) {
		state.projects = payload
		state.projectsLoading = false
	},
	postProject(state, payload) {
		state.projects = [
			payload,
			...state.projects
		]
	},
	deleteProject(state, projectId) {
		const index = state.projects.findIndex((i) => i._id === projectId)
		Vue.delete(state.projects, index)
		console.log(state.projects)

		// state.projects = state.projects.filter((i) => i._id !== projectId)
	},
	updateProject(state, data) {
		let index = state.projects.findIndex((project) => {
			return project._id === data._id
		})
		Vue.set(state.projects, index, data)
	}
}

const actions = {
	async setFeaturedProjects(context) {
		const data = await asyncGetter('/projects/featured', {
			get: true
		})
		if (data) {
			context.commit('setFeaturedProjects', data)
		}
	},
	async setProjects(context) {
		const data = await asyncGetter('/projects', {
			get: true
		})
		if (data) {
			context.commit('setProjects', data)
		}
	},
	async postProject(context, payload) {
		const data = await asyncGetter('/projects', {
			requiresAuth: true,
			post: true,
			body: payload
		})
		if (data.length !== 0) {
			context.commit('postProject', data)
		}
	},
	async deleteProject(context, projectId) {
		const data = await asyncGetter('/projects', {
			requiresAuth: true,
			delete: true,
			id: projectId
		})
		if (data.length !== 0) {
			context.commit('deleteProject', projectId)
		}
	},
	async updateProject(context, body) {
		const data = await asyncGetter('/projects', {
			requiresAuth: true,
			put: true,
			id: body._id,
			body
		})
		if (data.length !== 0) {
			context.commit('updateProject', data)
		}
	}
}

export default {
	state,
	getters,
	mutations,
	actions,
	namespaced: true
}
