<template>
	<nav ref="xscroll" class="x-list scrollbar" @mouseenter="enterxscroll" @mouseleave="leavexscroll">
		<router-link-a :target="targetblank?'_blank':''" :to="{name:'作品详情',query:{id:pic.id}}" :handle="()=>{commitDetail(pic);leavexscroll();}"
		 v-if="pic.sanity_level < 5&&pic.x_restrict==0||isR18" :title="pic.title" :key="pic.id" class="card border-0 one"
		 v-for="pic in pics">
			<div class="one-img" :alt="pic.title" v-lazy:background-image="replaceImg(pic.image_urls.square_medium)"></div>
			<div class="carousel-indicators">
				<h4 class="text-white">{{pic.title}}</h4>
			</div>
			<div class="imgnums" v-if="pic.page_count>1">
				<badge type="default text-white"><i class="ni ni-ungroup"></i> {{pic.page_count}}</badge>
			</div>
		</router-link-a>
	</nav>
</template>

<script>
	import CONFIG from '@/config.json'
	import storage from 'good-storage'
	
	export default {
		name: 'Common.xScroll',
		props: {
			pics: {
				type: Array
			}
		},
		components:{
			
		},
		data() {
			return {
				ScrollLock: true,
				targetblank: storage.get("targetblank") == true ? true : storage.set("targetblank", false),
				isR18: storage.get("r18") == true ? true : storage.set("r18", false)
			}
		},
		methods: {
			commitDetail(image) {
				if (!this.$store.getters["detail/findById"](image.id)["image"].id) {
					this.$store.commit("detail/setImage", {
						id: image.id,
						key: "image",
						value: image
					})
				}
				return false
			},
			replaceImg(url) {
				url = url.replace("https://i.pximg.net/", CONFIG.SMALL_IMAGE_PROXY_HOST)
				var ua = navigator.userAgent.toLowerCase()
				if (ua.match(/version\/([\d.]+).*safari/i)) {
					url = url.replace("_10_webp", "_70")
				}
				return url
			},
			enterxscroll() {
				window.addEventListener('mousewheel', this.xscroll, {
					passive: false
				});
			},
			leavexscroll() {
				window.removeEventListener('mousewheel', this.xscroll, {
					passive: false
				});
			},
			xscroll(e) {
				e.preventDefault();
				e.stopPropagation();
				if (!this.ScrollLock) {
					this.ScrollLock = true
					if (this.$refs.xscroll) {
						this.$refs.xscroll.scrollTo({
							left: this.$refs.xscroll.scrollLeft + e.deltaY * 4,
							behavior: "smooth"
						});
					}
					setTimeout(() => {
						this.ScrollLock = false;
					}, 170);
				}
			},
		},
		mounted() {
			this.ScrollLock = false;
		},
		beforeDestroy() {
			this.leavexscroll()
		},
		destroyed(){
			this.leavexscroll()
		}
	}
</script>

<style>
</style>
