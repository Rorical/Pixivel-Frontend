<template>
	<div class="card the-img">
		<div class="spinner-box loading-imgcard" v-if="loading">
		  <div class="circle-border">
		    <div class="circle-core"></div>
		  </div>  
		</div>
		<div class="imgerror" v-if="loadError">
			<h1 class="errortext">Error</h1>
		</div>
		<img ref="image" :source="largesource" v-if="lazy" class="one-img" v-lazy="source">
		</img>
		
		<div ref="image" v-if="!lazy" class="one-img no-tran" :style='{"background-image":source}'>
		</div>
	</div>
</template>

<script>
	import CONFIG from '@/config.json'
	export default {
		name: 'Image.BigImageCard',
		props: {
			image: {
				type: Object
			},
			lazy:{
				type: Boolean,
				default: true
			}
		},
		data(){
			return{
				loading: true,
				loadError: false
			}
		},
		methods: {
			getProxy(id){
				id = parseInt(id)
				var purl = this.$store.getters["picproxy/getProxy"](id)
				if(purl){
					return purl
				}else{
					this.$store.commit("picproxy/setProxy",{
						id:id
					})
					purl = this.$store.getters["picproxy/getProxy"](id)
					return purl
				}
			},
			replaceImg(url) {
				url = url.replace("https://i.pximg.net/", this.getProxy(this.image.id))
				var ua = navigator.userAgent.toLowerCase()
				if(ua.match(/version\/([\d.]+).*safari/i)){
					url = url.replace("_webp","")
				}
				return url
			},
		},
		computed:{
			source(){
				if(this.lazy){
					return this.replaceImg(this.image.image_urls["large"])
				}else{
					if(this.image["base64"]){
						return "url("+this.image["base64"]+")"
						this.loading = false
					}
				}
				
			},
			largesource(){
				return this.replaceImg(this.image.image_urls["original"])
			}
		},
		mounted(){
			if(this.lazy){
				this.$Lazyload.$on('loaded', ({el, src}) => {
					if (src == this.source) {
						this.loading = false;
					}
				});
				this.$Lazyload.$on('error', ({el, src}) => {
					if (src == this.source) {
						this.loading = false;
						this.loadError = true;
					}
				});
			}
		}
	}
</script>

<style>
</style>
