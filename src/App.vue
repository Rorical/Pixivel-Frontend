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
