<template>
	<div
		class="dropdown-select"
		tabindex="0"
		ref="dropdown"
		@focus="showDropdown"
		@blur="closeDropdown"
		:class="{ isOpen: isOpen }"
	>
		<p
			class="theme-bgs dropdown-select__placeholder m-0 py-2 px-4 position-relative"
			:class="{ packageSelected: selected }"
		>
			<span>
				{{ placeholder }}
			</span>
			<i class="fal fa-chevron-down down-icon"></i>
		</p>
		<transition name="dropped">
			<transition-group
				v-if="isOpen"
				tag="ul"
				:key="forced"
				name="dropdown-anime"
				@appear="dropdownAppear"
				class="dropdown-select__list theme-bgs pl-0 py-2 shadow"
			>
				<li
					v-for="(item, index) in options"
					:key="item.name"
					@click.stop="selectItem(index)"
					class="dropdown-select__list-item p-2 pl-4 my-1"
				>
					{{ item.name }}
				</li>
			</transition-group>
		</transition>
	</div>
</template>

<script>
export default {
	data: () => ({
		isOpen: false,
		delay: 0,
		forced: false
	}),
	
	methods: {
		showDropdown() {
			this.isOpen = true
			this.forced = !this.forced
		},
		closeDropdown() {
			this.delay = 0
			this.isOpen = false
		},
		dropdownAppear(e) {
			e.style.transition = `0.3s ease-in-out all`
			e.style.transitionDelay = `${this.delay}s`
			this.delay += 0.1
		},
		selectItem(index) {
			this.$emit('packageSelected', index)
			this.$refs.dropdown.blur()
		}
	},
	props: {
		placeholder: String,
		options: Array,
		selected: Boolean
	}
}
</script>

<style lang="scss">
.down-icon {
	position: absolute;
	right: 10px;
	top: 50%;
	transform: translateY(-50%);
}
.isOpen {
	.down-icon {
		transform: translateY(-50%) rotate(180deg) !important;
	}
}
.packageSelected {
	font-weight: bold;
	font-size: 18px;
	span {
		color: var(--pr-primary-color);
	}
}
.dropdown-select__placeholder {
	cursor: pointer !important;
	background: var(--pr-cbtn);
	border-radius: 5px;
	i {
		transition: 0.3s ease-in-out all;
	}
}
.dropdown-select {
	position: relative !important;
}
.dropped-enter {
	opacity: 0;
}
.dropped-enter-active {
	transition: 0.3s ease-in-out all;
}
.dropped-leave-active {
	opacity: 0;
	transform: translateX(-50%) translateY(10%) !important;
	transition: 0.3s ease-in-out all;
}
.dropdown-select__list {
	position: absolute;
	width: 75%;
	left: 50%;
	border-radius: 5px;
	transform: translateX(-50%);
	top: 120%;
	z-index: 10;
	&-item {
		list-style: none;
		cursor: pointer !important;
		// transition: 0.1s ease-in-out box-shadow !important;
		&:hover {
			transition: 0.1s ease-in-out box-shadow !important;
			box-shadow: inset 3px 0px 0px var(--pr-primary-color) !important;
		}
	}
}

.dropdown-anime-enter {
	transform: translateX(-20%);
	opacity: 0;
	pointer-events: none;
}
/* .dropdown-anime-enter-to {
	transition: 0.3s ease-in-out all !important;
} */
</style>
