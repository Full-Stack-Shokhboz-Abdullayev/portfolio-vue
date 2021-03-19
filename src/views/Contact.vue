<template>
	<div class="bg-contact2 main-wrapper">
		<section class="cta-section position-relative theme-bgs py-5">
			<div class="container text-center single-col-max-width">
				<h2 class="heading">{{ $t('header.links.contact') }}</h2>
				<div class="intro">
					<i18n tag="div" class="mb-2" path="contact.subtitle1">
						<template slot="email">
							<a href="mailto:shokhboz11abdullayev@gmail.com"
								>shokhboz11abdullayev@gmail.com</a
							>
						</template>
					</i18n>
					<p class="mt-2">
						{{ $t('contact.subtitle2') }}
					</p>
					<!-- <p class="m-0"></p>
					<p class="m-0">We can contact as well.</p> -->
					<ul class="list-inline mt-2 mb-0 no-decor no-list">
						<li
							v-for="(i, index) in socials"
							:key="index"
							class="list-inline-item mx-3"
						>
							<a :href="i.link">
								<i class="fab fa-1_5x" :class="i.icon"></i>
							</a>
						</li>
					</ul>
					<transition name="message-animation">
						<p v-if="sent" class="message-sent">{{ msg }}</p>
					</transition>
				</div>
			</div>
			<!--//container-->
		</section>

		<div class="container-contact2">
			<form
				class="contact2-form validate-form"
				@submit.prevent="sendMessage"
				autocomplete="off"
			>
				<div
					class="wrap-input2 validate-input"
					data-validate="Name is required"
				>
					<input
						autocomplete="off"
						class="input2"
						v-model.trim="contactInfo.fullName"
						type="text"
						name="name"
						required
						@change="validate"
					/>
					<div class="grey"></div>
					<div class="slide"></div>
					<div class="cword">{{ $t('contact.form.fullName') }}</div>
				</div>
				<div
					class="wrap-input2 validate-input"
					data-validate="Valid email is required: ex@abc.xyz"
				>
					<input
						autocomplete="off"
						class="input2"
						type="text"
						name="email"
						v-model.trim="contactInfo.email"
						required
						@change="validate"
					/>
					<div class="grey"></div>
					<div class="slide"></div>
					<div class="cword">{{ $t('contact.form.email') }}</div>

					<span class="focus-input2" data-placeholder="EMAIL" />
				</div>
				<div class="mb-5">
					<dropdown
						class="my-dropdown-toggle"
						:options="services"
						@packageSelected="changeSelection"
						:placeholder="selection"
					>
					</dropdown>
					<p class="text-center mt-3 mb-0">
						<router-link
							tag="a"
							:to="{
								name: 'servicesPricing'
							}"
						>
							Don't have an idea to select a package?
						</router-link>
					</p>
				</div>
				<div
					class="wrap-input2 validate-input"
					data-validate="Message is required"
				>
					<textarea
						autocomplete="off"
						class="input2"
						name="message"
						required
						v-model.trim="contactInfo.msg"
						@change="validate"
					/>
					<div class="grey"></div>
					<div class="slide"></div>
					<div class="cword">{{ $t('contact.form.message') }}</div>

					<span class="focus-input2" data-placeholder="MESSAGE" />
				</div>
				<div class="container-contact2-form-btn">
					<div class="wrap-contact2-form-btn">
						<div class="contact2-form-bgbtn" />
						<button
							class="contact2-form-btn position-relative btn w-50"
						>
							{{ $t('contact.form.send') }}
							<app-loading
								v-if="sending"
								:condition="sending"
								:small="true"
							></app-loading>
							<div class="ct" :class="{ shown: sent }">
								<svg viewBox="0 0 100 100">
									<polyline
										id="tick"
										points="25.5,53.5 39.5,67.5 72.5,34.5"
									/>
								</svg>
							</div>
						</button>
					</div>
				</div>
			</form>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import validate from '@/assets/jsComponents/validate'
import asyncGetter from '@/assets/jsComponents/asyncGetter'
import gsap from 'gsap'
import Dropdown from '@/components/routesComps/Dropdown.vue'

const tl = gsap.timeline({
	defaults: {
		ease: 'ease',
		duration: 0.2
	}
})

export default {
	data() {
		return {
			opened: false,
			sending: false,
			sent: false,
			msg: '',
			selection: 'Select a Package',
			contactInfo: {
				fullName: '',
				email: '',
				msg: '',
				package: ''
			},
			packageRequired: false
		}
	},

	methods: {
		validate,
		async sendMessage() {
			if (this.contactInfo.package.length === 0) {
				this.packageRequired = true
				return
			}
			this.sending = true
			const { msg } = await asyncGetter('/send-msg', {
				post: true,
				body: {
					...this.contactInfo
				}
			})

			this.contactInfo = {
				fullName: '',
				email: '',
				package: '',
				msg: ''
			}
			this.selection = 'Select a Package'
			this.msg = msg
			this.sending = false
			document
				.querySelectorAll('.contact2-form .wrap-input2')
				.forEach((i) => {
					i.classList.remove('filled')
				})

			tl.from(
				'#tick',
				{
					strokeDashoffset: 70
				},
				'+=0.6'
			).from(
				'.ct',
				{
					opacity: 1
				},
				'+=0.6'
			)
			this.sent = true
		},
		changeSelection(index) {
			this.selection = this.services[index].name + ' Package Selected'
			this.contactInfo.package = this.services[index].value
		}
	},
	watch: {
		sent(cur) {
			setTimeout(() => {
				if (cur) {
					this.sent = false
				}
			}, 1500)
		}
	},
	components: {
		Dropdown
	},
	computed: {
		...mapState(['socials']),
		services() {
			return [
				{
					name: this.$t('services.packages.basic.title'),
					value: 'Basic'
				},
				{
					name: this.$t('services.packages.standard.title'),
					value: 'Standard'
				},
				{
					name: this.$t('services.packages.premium.title'),
					value: 'Premium'
				}
			]
		}
	},
	mounted() {
		if (this.$route.query.package) {
			this.contactInfo.package = this.services[
				this.$route.query.package
			].value
			this.selection =
				this.services[this.$route.query.package].name +
				' Package Selected'
		}
	},
	head() {
		return {
			title: 'Contact'
		}
	}
}
</script>

<style lang="scss" scoped>
.main-wrapper {
	width: calc(100% - 280px);
	min-height: 100vh;
	background-size: cover;
	background-repeat: no-repeat;

	background-position: center;
}
.message-sent {
	position: absolute;
	bottom: 0;
	width: 100%;
	left: 0;
	font-size: 20px !important;
}
.message-animation-enter {
	transform: translateY(20px);
	opacity: 0;
	pointer-events: none;
}
.message-animation-leave-active {
	transform: translateY(-20px);
	opacity: 0;
	pointer-events: none;
	transition: 0.4s ease-in-out all;
}
.message-animation-enter-active {
	transition: 0.4s ease-in-out all;
}
svg {
	width: 56px;
	stroke: white;
	stroke-width: 5;
	stroke-dasharray: 70;
	stroke-dashoffset: 0;
	fill: transparent;
}
.ct {
	position: absolute;
	width: 100%;
	background: #54b689 !important;
	height: 100%;
	display: flex;
	opacity: 0;
	justify-content: center;
	align-items: center;
	top: 0;
	left: 0;
	transition: 0.3s ease opacity;
	&.shown {
		transition-delay: 0.4s;
		opacity: 1;
	}
}
</style>
