<template>
	<div class="main-wrapper blog">
		<section class="cta-section theme-bgs py-5">
			<div class="container text-center">
				<h2 class="heading">
					{{ $t('blog.title') }}
				</h2>
				<div class="intro">
					{{ $t('blog.subtitle') }}
				</div>
				<transition name="rotated">
					<div
						v-if="!response.success && response.error.length > 0"
						class="error-message w-75 d-block mx-auto text-light rounded bg-danger mt-5 p-3"
					>
						<p class="text-light">
							{{ response.error }}
						</p>
					</div>
				</transition>

				<transition name="newsletter-added" mode="out-in">
					<div
						key="success-message"
						v-if="response.success && response.message.length > 0"
						class="success-message mt-5 p-2 rounded w-75 d-block mx-auto"
					>
						<p class="text-light">
							{{ response.message }}
						</p>
					</div>
					<form
						key="newsletter-form"
						v-if="!response.success"
						@submit.prevent="subscribeToNewsletter"
						class="signup-form form-inline justify-content-center mt-5 pt-3"
					>
						<div
							class="wrap-input2 validate-input newsletter mr-4"
							data-validate="Valid email is required: ex@abc.xyz"
						>
							<input
								@change="validate"
								autocomplete="off"
								class="input2 blog-subscription"
								type="email"
								v-model.trim="email"
								name="email"
								required
							/>
							<div class="grey"></div>
							<div class="slide"></div>
							<div class="cword">
								{{ $t('contact.form.email') }}
							</div>

							<span
								class="focus-input2"
								data-placeholder="EMAIL"
							/>
						</div>
						<button type="submit" class="btn position-relative">
							Subscribe
							<app-loading
								:condition="subscribing"
								v-if="subscribing"
								:small="true"
							></app-loading>
						</button>
					</form>
				</transition>
				<transition name="fade" mode="out-in">
					<div class="mt-5" v-if="adminLoggedIn">
						<router-link
							:to="{ name: 'add-blog' }"
							tag="button"
							class="btn circle"
						>
							Add Blog
						</router-link>
					</div>
				</transition>
			</div>
			<!--//container-->
		</section>
		<section class="blog-list px-3 py-5 p-md-5">
			<div class="search-wrapper">
				<div class="search-container">
					<i class="fal fa-search"></i>
					<input
						class="search-bar shadow"
						type="text"
						placeholder="Start typing here to search instantly."
						v-model="searchInput"
					/>
					<div class="after"></div>
				</div>
			</div>
			<div class="container mt-5">
				<transition name="fade" mode="out-in">
					<app-loading
						key="loading"
						v-if="blogsLoading"
						:condition="blogsLoading"
					></app-loading>
					<transition-group
						key="blogPosts"
						v-else-if="
							!blogsLoading && searchWrappedBlogs.length !== 0
						"
						name="blog-anime"
						@after-appear="setDelay"
						tag="div"
						class="my-row"
						@appear="appearAnimation"
					>
						<!-- @appear="appearAnimation" -->
						<!--//col-->
						<div
							class="mb-4 blog-media mx-2"
							v-for="blog in blogPosts"
							:key="blog._id"
							v-show="searchWrappedBlogs.includes(blog)"
							:class="{
								'd-inline-block': searchWrappedBlogs.includes(
									blog
								)
							}"
						>
							<div class="card blog-post-card fafa">
								<video
									v-if="blog.posterType === 'video'"
									class="card-img-top"
									preload="metadata"
									paused="true"
								>
									<source
										:src="blog.poster"
										type="video/mp4"
									/>
								</video>
								<img
									v-else
									class="card-img-top"
									:src="blog.poster"
									:alt="blog.heading"
								/>
								<div class="card-body">
									<h5 class="card-title">
										<router-link
											class="theme-link"
											tag="a"
											:to="{
												name: 'particular-blog',
												params: {
													slug: blog.slug
												}
											}"
											v-html="
												$options.filters.highlightSearched(
													blog.heading,
													searchInput
												)
											"
										></router-link>
									</h5>
									<p class="card-text">
										{{ blog.tag }}
										<br />
										<br />
										<b class="blog-lang"
											>{{ $t('blog.language') }}:
											{{ blog.language }}</b
										>
									</p>
									<p class="mb-0">
										<router-link
											class="more-link"
											tag="a"
											:to="{
												name: 'particular-blog',
												params: {
													slug: blog.slug
												}
											}"
											>{{
												$t('regulars.readMore')
											}}
											→</router-link
										>
									</p>
								</div>
								<div class="card-footer fafa">
									<small class="text-muted"
										>{{ $t('regulars.published') }}
										{{ blog.publishedDate }}</small
									>
								</div>
							</div>
							<!--//card-->
						</div>

						<!--//col-->
					</transition-group>
					<div
						key="empty"
						v-else-if="blogPosts.length <= 0"
						class="empty d-flex align-items-center justify-content-center mt-5"
					>
						<div class="d-flex flex-column">
							<p>
								There is no blogs here yet. Or maybe data
								problem occured.
							</p>
							<button
								@click="tryAgain"
								class="btn btn-outline-primary"
							>
								Try again.
							</button>
						</div>
					</div>
					<div
						v-else-if="searchWrappedBlogs.length <= 0"
						key="not-found"
						class="not-found d-flex align-items-center justify-content-center mt-5"
					>
						<svg
							version="1.1"
							id="Sad"
							class="mr-2"
							xmlns="http://www.w3.org/2000/svg"
							xmlns:xlink="http://www.w3.org/1999/xlink"
							x="0px"
							y="0px"
							viewBox="0 0 512 512"
							width="30"
							height="30"
							style="enable-background: new 0 0 512 512"
							xml:space="preserve"
						>
							<g>
								<g>
									<g>
										<path
											d="M256,0C114.615,0,0,114.615,0,256s114.615,256,256,256s256-114.615,256-256S397.385,0,256,0z M256,480
				C132.288,480,32,379.712,32,256S132.288,32,256,32s224,100.288,224,224S379.712,480,256,480z"
										/>
										<circle cx="176" cy="176" r="32" />
										<circle cx="336" cy="176" r="32" />
										<path
											d="M256,240c-79.529,0-144,64.471-144,144h32c0-61.856,50.144-112,112-112s112,50.144,112,112h32
				C400,304.471,335.529,240,256,240z"
										/>
									</g>
								</g>
							</g>
							<g></g>
							<g></g>
							<g></g>
							<g></g>
							<g></g>
							<g></g>
							<g></g>
							<g></g>
							<g></g>
							<g></g>
							<g></g>
							<g></g>
							<g></g>
							<g></g>
							<g></g>
						</svg>

						<p class="m-0">Searched blog not found.</p>
					</div>
				</transition>
				<!--//row-->
			</div>
		</section>
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import validate from '@/assets/jsComponents/validate'
import asyncGetter from '@/assets/jsComponents/asyncGetter'
export default {
	data() {
		return {
			delay: 0.2,
			email: '',
			subscribing: false,
			searchInput: '',
			blogsLoading: true,
			response: {
				success: false,
				message: '',
				error: ''
			}
		}
	},
	computed: {
		...mapState('Blogs', ['blogPosts']),
		...mapState('Auth', ['adminLoggedIn']),
		...mapState(['prevRoute', 'editMode']),
		searchWrappedBlogs() {
			return this.blogPosts.filter((i) =>
				i.heading.toLowerCase().includes(this.searchInput.toLowerCase())
			)
		}
	},
	filters: {
		highlightSearched(words, query) {
			let originalText = words.match(new RegExp(query, 'i'))
			if (originalText) originalText = originalText.join('')
			return words.replace(
				new RegExp(query, 'i'),
				"<span class='sv'>" + originalText + '</span>'
			)
		}
	},
	methods: {
		validate,
		...mapActions('Blogs', ['setBlogs']),
		appearAnimation(e) {
			e.style.transition = ` 0.2s ease-in-out all, 0.5s ease transform, 0.3s ease background`
			e.style.transitionDelay = `${this.delay}s`
			this.delay += 0.15
		},
		setDelay(e) {
			e.style.transition = ` 0.2s ease-in-out all, 0.5s ease transform, 0.3s ease background`

			this.delay = 0.2
		},
		async subscribeToNewsletter() {
			this.subscribing = true
			const data = await asyncGetter('/subscribers', {
				post: true,
				body: {
					email: this.email
				}
			})
			if (data.success) {
				this.response.success = data.success
				this.response.message = data.message
			} else {
				this.response.error = data.error
			}
			this.subscribing = true
		},
		async showBlogs() {
			if (this.blogPosts.length === 0) {
				try {
					await this.setBlogs()
				} catch {
					this.blogsLoading = false
				} finally {
					this.blogsLoading = false
				}
			} else {
				this.blogsLoading = false
			}
		},
		async tryAgain() {
			this.blogsLoading = true
			try {
				await this.setBlogs()
			} catch {
				this.blogsLoading = false
			} finally {
				this.blogsLoading = false
			}
		}
	},

	head() {
		return {
			title: 'Blogs'
		}
	},
	created() {
		this.showBlogs()
	},
	updated() {
		this.showBlogs()
	}
}
</script>

<style lang="scss" scoped></style>
