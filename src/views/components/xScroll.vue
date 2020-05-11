<template>
	<nav ref="xscroll" class="x-list scrollbar" @mouseenter="enterxscroll" @mouseleave="leavexscroll" >
		<a @click="gotao(pic.id)" v-if="pic.x_restrict==0||isR18" href="javascript:void(0)" :title="pic.title" :key="pic.id" class="card border-0 one" v-for="pic in pics">
			<div class="one-img" :alt="pic.title" v-lazy:background-image="replaceImg(pic.image_urls.square_medium)"></div>
			<div class="carousel-indicators">
				<h4 class="text-white">{{pic.title}}</h4>
			</div>
			<div class="imgnums" v-if="pic.page_count>1">
				<badge type="default text-white"><i class="ni ni-ungroup"></i> {{pic.page_count}}</badge>
			</div>
		</a>
	</nav>
</template>

<script>
	import CONFIG from '@/config.json'
	import storage from 'good-storage'
	export default {
	    name: 'Common.xScroll',
		props:{
			pics:{
				type:Array
			}
		},
	    data() {
			return {
				ScrollLock: true,
				targetblank: storage.get("targetblank") == "true"?true:false,
				isR18: storage.get("r18")=="true"?true:false
			}
		},
		methods:{
			replaceImg(url){
				return url.replace("https://i.pximg.net/",CONFIG.SMALL_IMAGE_PROXY_HOST)
			},
			enterxscroll() {
				window.addEventListener('mousewheel', this.xscroll, { passive: false });
			},
			leavexscroll() {
				window.removeEventListener('mousewheel', this.xscroll, { passive: false });
			},
			gotao(id){
				this.leavexscroll()
				if(this.targetblank){
					window.open(this.$router.resolve({name:'作品详情',query:{id:id}}).href, '_blank');
				}else{
					this.$router.push({name:'作品详情',query:{id:id}})
				}
			},
			xscroll(e) {
				e.preventDefault();
				e.stopPropagation();
				if (!this.ScrollLock) {
					this.ScrollLock = true
					this.$refs.xscroll.scrollTo({
						left: this.$refs.xscroll.scrollLeft + e.deltaY * 4,
						behavior: "smooth"
					});
					setTimeout(() => {
						this.ScrollLock = false;
					}, 170);
				}
			},
		},
		mounted(){
			this.ScrollLock = false;
		},
		destroyed(){
			this.leavexscroll()
		}
	}
	
</script>

<style>
</style>
