<template>
	<div class="bigpics" :style="{'width': cliwidth + 'vmin'}">
		<BigImgCard :image="image" v-for="image in sourceimg" :style="{'height': cliheight + 'vmin'}" />
	</div>
</template>

<script>
	import BigImgCard from './BigImgCard';
	export default {
		name: 'Image.BigPics',
		props: {
			image: {
				type: Object
			}
		},
		data(){
			return{
				Hpercent: 95
			}
		},
		components: {
			BigImgCard
		},
		methods: {
			
		},
		computed:{
			cliwidth(){
				return this.image.height>this.image.width ? (this.image.width / this.image.height) *  this.Hpercent : this.Hpercent
			},
			cliheight(){
				return this.image.width>this.image.height ? (this.image.height / this.image.width) *  this.Hpercent : this.Hpercent
			},
			sourceimg(){
				if(this.image.meta_pages && this.image.meta_pages.length==0){
					var dic = this.image["image_urls"]
					dic["original"] = this.image.meta_single_page["original_image_url"]
					return [{"image_urls":dic}]
				}
				return this.image.meta_pages
			}
		}
	}
</script>

<style>
</style>
