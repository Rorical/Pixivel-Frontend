<template>
	<div id="app">
		<notifications></notifications>
		<router-view></router-view>
	</div>
</template>

<script>
	import storage from 'good-storage'
	export default {
		data() {
			return {
				bodycolor: storage.get("bodycolor") ? storage.get("bodycolor") : "#FFFFFF",
			};
		},
		computed: {},
		beforeCreate() {

		},
		mounted() {
			document.body.style.backgroundColor = this.bodycolor
		}
	};
</script>

<style lang="scss">
	
	@media (min-width: 768px){
		.navbar-vertical .navbar-collapse:before {
		    content: ' 新年快乐！ ' !important;
		    text-align: center !important;
		    display: block;
		    margin: 0.1rem -1rem !important;
		    font-weight: 600;
		    font-size: 0.875rem;
			color: rgb(17, 205, 239);
		}
		#sidenav-main {
			background: {
				image: url(./assets/newyear.webp);
				position: bottom;
				size: contain;
				repeat: no-repeat;
			}
		}
	}
	
</style>
