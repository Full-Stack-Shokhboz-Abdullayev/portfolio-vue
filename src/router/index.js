import Vue from 'vue'
import VueRouter from 'vue-router'
import Meta from 'vue-meta'
import NProgress from 'nprogress'
import store from '@/store/index'
import { getWithExpiry } from '../assets/jsComponents/localStorageExpire'
import asyncGetter from '../assets/jsComponents/asyncGetter'
// import About from '@/views/About.vue'
// import Projects from '@/views/Projects.vue'
// import ServicesPrices from '@/views/ServicesPrices.vue'
// import Resume from '@/views/Resume.vue'
// import Blogs from '@/views/Blogs/index.vue'
// import Blog from '@/views/Blogs/Blog.vue'
// import AddBlog from '@/views/Blogs/AddBlog.vue'
// import Contact from '@/views/Contact.vue'

const About = () => import('@/views/About.vue')
const Projects = () => import('@/views/Projects.vue')
const ServicesPrices = () => import('@/views/ServicesPrices.vue')
const Resume = () => import('@/views/Resume.vue')
const Blogs = () => import('@/views/Blogs/index.vue')
const Contact = () => import('@/views/Contact.vue')
const Blog = () => import('@/views/Blogs/Blog.vue')
const AddBlog = () => import('@/views/Blogs/AddBlog.vue')
const NotFound = () => import('@/views/404.vue')

Vue.use(VueRouter)
Vue.use(Meta, {
	keyName: 'head'
})

const routes = [
	{
		path: '/',
		name: 'about',
		component: About
	},
	{
		path: '/projects',
		name: 'projects',
		component: Projects
	},
	{
		path: '/services-pricing',
		name: 'servicesPricing',
		component: ServicesPrices
	},
	{
		path: '/resume',
		name: 'resume',
		component: Resume
	},
	{
		path: '/blog',
		name: 'blog',
		component: Blogs
	},
	{
		path: '/404',
		name: '404',
		component: NotFound
	},

	{
		path: '/blog/add',
		name: 'add-blog',
		component: AddBlog,
		beforeEnter: async (to, from, next) => {
			const adminInStore =
				store.state.Auth.adminLoggedIn &&
				getWithExpiry('jid256')

			if (adminInStore) {
				return next()
			} else if (getWithExpiry('jid256')) {
				const result = await asyncGetter('/auth/auto-login', {
					post: true,
					body: {},
					requiresAuth: true
				})
				if (result.success && result.user.role === 'admin') {
					console.log('Welcome Admin!')
					return next()
				} else if (!result.success) {
					localStorage.removeItem('jid256')
				}
			}

			//else Not Found
			next({ name: '404' })
		}
	},
	{
		path: '/blog/:slug',
		name: 'particular-blog',
		component: Blog,
		beforeEnter: async (to, from, next) => {
			let { blogPosts } = store.state.Blogs

			if (blogPosts.length !== 0) {
				let slugs = blogPosts.map((i) => i.slug)
				console.log(slugs)
				const routeSlug = to.params.slug
				console.log(routeSlug)
				console.log(slugs.includes(routeSlug))

				if (slugs.includes(routeSlug)) {
					console.log('contains!')
					return next()
				}
			} else {
				const data = await asyncGetter('/blogs/' + to.params.slug, {
					get: true
				})
				console.log(data)
				if (!data.error) {
					return next()
				}
			}
			return next({ name: '404' })
		}
	},
	{
		path: '/contact',
		name: 'contact',
		component: Contact
	},

	{ path: '*', redirect: '/' }
]

const router = new VueRouter({
	routes,
	mode: 'history',
	scrollBehavior(to, from) {
		store.state.prevRoute = from
		if ('scrollRestoration' in window.history) {
			window.history.scrollRestoration = 'manual'
		}
	}
})

router.beforeEach(async (to, from, next) => {
	NProgress.start()
	NProgress.set(0.1)
	next()
})

router.afterEach(() => {
	// setTimeout(() => NProgress.done(), 100)
	NProgress.done()
})
export default router
