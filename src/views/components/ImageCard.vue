<template>
	<router-link :to="{name:'作品详情',query:{id:image.id}}" v-if="this.image.x_restrict==0||this.isR18" class="card the-img shadow--hover" v-bind:style="{ width: cardWidth + 'px', height: image.height * (cardWidth / image.width) + 'px' }">
		<div class="spinner-box loading-imgcard" v-if="loading">
		  <div class="circle-border">
		    <div class="circle-core"></div>
		  </div>  
		</div>
		<div class="imgerror" v-if="loadError">
			<h1 class="errortext">Error</h1>
		</div>
		<div ref="image" class="one-img"  v-lazy:background-image="source">
		</div>
		<div class="carousel-indicators img-title" v-if="!loadError">
			<h2 class="text-white">{{image.title}}</h2>
		</div>
	</router-link>
</template>

<script>
	import CONFIG from '@/config.json'
	import storage from 'good-storage'
	export default {
		name: 'Image.ImageCard',
		props: {
			image: {
				type: Object
			},
			cardWidth: {
				type: Number,
				default: 268
			},
			imageType: {
				type: String
			},
		},
		data(){
			return{
				loading: true,
				loadError: false,
				isR18: storage.get("r18")=="true"?true:false
			}
		},
		methods: {
			replaceImg(url){
				return url.replace("https://i.pximg.net/",CONFIG.SMALL_IMAGE_PROXY_HOST)
			}
		},
		computed:{
			source(){
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
				return this.replaceImg(this.image["image_urls"][this.imageType])
			}
		},
		mounted(){
		}
	}
</script>

<style>
</style>
