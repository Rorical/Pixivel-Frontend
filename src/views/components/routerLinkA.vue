<template>
	<a ref="a">
		<slot></slot>
	</a>
</template>

<script>
	export default {
		name: 'Common.routerLinkA',
		props: {
			to: {
				type: Object
			},
			handle: {
				type: Function
			}
		},
		methods: {
			guardEvent(e) {
				// don't redirect with control keys
				if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) {
					return
				}
				// don't redirect when preventDefault called
				if (e.defaultPrevented) {
					return
				}
				// don't redirect on right click
				if (e.button !== undefined && e.button !== 0) {
					return
				}
				// don't redirect if `target="_blank"`
				if (e.currentTarget && e.currentTarget.getAttribute) {
					var target = e.currentTarget.getAttribute('target');
					if (/\b_blank\b/i.test(target)) {
						return
					}
				}
				// this may be a Weex event which doesn't have this method
				if (e.preventDefault) {
					e.preventDefault();
				}
				return true
			}
		},
		mounted() {
			var guardEvent = this.guardEvent
			var router = this.$router
			var handle = this.handle
			var current = this.$route
			var ref = router.resolve(this.to, current)
			var location = ref.location
			this.handler = function(e) {
				if (guardEvent(e)) {
					if(handle){
						handle()
					}
					router.push(location)
					return false
				}
			}
			this.$el.href = ref.href
			this.$el.addEventListener('click', this.handler, false)
		},
		beforeDestroy() {
			this.$el.removeEventListener('click', this.handler, false)
		},
		destroyed(){
			this.$el.removeEventListener('click', this.handler, false)
		}
	}
</script>

<style>
</style>
