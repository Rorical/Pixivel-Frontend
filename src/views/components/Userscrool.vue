<template>
	<nav ref="xscroll" class="x-list scrollbar" style="height: auto !important;" @mouseenter="enterxscroll" @mouseleave="leavexscroll" >
		<infinite-loading @infinite="infiniteHandler" spinner="spiral" ref="infiniteLoading">
			<span slot="no-more">
				
			</span>
		</infinite-loading>
		<a @click="gotao(user.user.id)" href="javascript:void(0)" :title="user.user.name" class="card border-0 one" v-for="user in Users">
			<div class="one-img" :alt="user.title" v-lazy:background-image="replaceImg(user.user.profile_image_urls.medium)"></div>
			<div class="carousel-indicators">
				<h4 class="text-white">{{user.user.name}}</h4>
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
			keyword:{
				type:String
			}
		},
	    data() {
			return {
				ScrollLock: true,
				targetblank: storage.get("targetblank") == true?true:storage.set("targetblank",false),
				Users:[]
			}
		},
		methods:{
			infiniteHandler($state){
				if (!this.keyword) {
					$state.complete();
					return;
				}
				this.axios
					.get(CONFIG.API_HOST, {
						params: {
							type: "search_user",
							word: this.keyword
							}
						})
					.then((response, state) => {
						if (!response.data.user_previews || response.data.user_previews.length==0) {
							$state.complete();
							return;
						}
						this.Users = (response.data.user_previews)
						$state.loaded();
						$state.complete();
					}).catch(err => {
						$state.complete();
						console.error(err.response.status);
					});
			},
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
					window.open(this.$router.resolve({name:'用户',query:{id:id}}).href, '_blank');
				}else{
					this.$router.push({name:'用户',query:{id:id}})
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
		}
	}
	
</script>

<style>
</style>
