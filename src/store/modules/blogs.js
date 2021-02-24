import asyncGetter from '@/assets/jsComponents/asyncGetter'
import Vue from 'vue'

const state = {
	blogPosts: [],
	latestBlogs: [],
	blogsLoading: false
}

const mutations = {
	setBlogs(state, payload) {
		state.blogPosts = payload
	},
	setLatestBlogs(state, payload) {
		state.latestBlogs = payload
	},
	addBlog(state, newBlog) {
		state.blogPosts.unshift(newBlog)

	},
	configureLatestBlogs(state) {
		state.latestBlogs = state.blogPosts.slice(0, 3)
	},
	updateBlog(state, data) {
		let index = state.blogPosts.findIndex((blog) => {
			return blog._id === data._id
		})
		Vue.set(state.blogPosts, index, data)
	},

	deleteBlog(state, BlogId) {
		let index = state.blogPosts.findIndex((Blog) => {
			return Blog._id === BlogId
		})
		Vue.delete(state.blogPosts, index)
		// state.blogPosts = state.blogPosts.filter((b) => b._id !== BlogId)
	}
}

const actions = {
	async setBlogs(context) {
		const blogs = await asyncGetter('/blogs', {
			get: true
		})
		context.commit('setBlogs', blogs)
	},
	async setLatestBlogs(context) {
		const blogs = await asyncGetter('/blogs/latest', {
			get: true
		})
		context.commit('setLatestBlogs', blogs)
	},
	async postBlog(context, payload) {
		const blog = await asyncGetter('/blogs', {
			post: true,
			requiresAuth: true,
			body: {
				...payload
			}
		})

		// context.commit('setLatestBlogs', blog)
		context.commit('addBlog', blog)
		context.commit('configureLatestBlogs')
	},
	async updateBlog(context, payload) {
		const blog = await asyncGetter('/blogs', {
			put: true,
			requiresAuth: true,
			id: payload._id,
			body: {
				...payload
			}
		})
		context.commit('updateBlog', blog)
	},
	async clapForBlog(context, payload) {
		await asyncGetter(
			'/blogs',
			{
				put: true,
				id: payload._id,
				body: { ...payload }
			},
			'/clap'
		)
		
	},
	async deleteBlog(context, payload) {
		await asyncGetter('/blogs', {
			requiresAuth: true,
			delete: true,
			id: payload
		})
		context.commit('deleteBlog', payload)
	}
}

export default {
	state,
	mutations,
	actions,
	namespaced: true
}
