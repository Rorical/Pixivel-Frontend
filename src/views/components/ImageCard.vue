<template>
	<router-link-a :target="targetblank?'_blank':''" :handle="()=>{commitDetail(image);}" :to="{name:'作品详情',query:{id:image.id}}" v-if="image.sanity_level < Sanity&&image.x_restrict==0||isR18"
	 class="card the-img shadow--hover" v-bind:style="{ width: cardWidth + 'px', height: image.height * (cardWidth / image.width) + 'px' }">
		<div class="spinner-box loading-imgcard" v-if="loading">
			<div class="circle-border">
				<div class="circle-core"></div>
			</div>
		</div>
		<div class="imgerror" v-if="loadError">
			<h1 class="errortext">Error</h1>
		</div>
		<div class="imgnums" v-if="image.page_count>1">
			<badge type="default text-white"><i class="ni ni-ungroup"></i> {{image.page_count}}</badge>
		</div>
		<div ref="image" class="one-img" v-lazy:background-image="source">
		</div>
		<div class="carousel-indicators img-title" v-if="!loadError">
			<h2 class="text-white">{{image.title}}</h2>
		</div>
	</router-link-a>
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
		data() {
			return {
				loading: true,
				loadError: false,
				isR18: storage.get("r18") == true ? true : storage.set("r18", false),
				Sanity: storage.get("Sanity")?storage.get("Sanity"):storage.set("Sanity",5),
				targetblank: storage.get("targetblank") == true ? true : storage.set("targetblank", false),
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
				return url.replace("https://i.pximg.net/", this.getProxy(this.image.id))
			},
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
		},
		computed: {
			source() {
				this.$Lazyload.$on('loaded', ({
					el,
					src
				}) => {
					if (src == this.source) {
						this.loading = false;
					}
				});
				this.$Lazyload.$on('error', ({
					el,
					src
				}) => {
					if (src == this.source) {
						this.loading = false;
						this.loadError = true;
					}
				});
				return this.replaceImg(this.image["image_urls"][this.imageType])
			}
		},
		mounted() {
		}
	}
</script>

<style>
</style>
