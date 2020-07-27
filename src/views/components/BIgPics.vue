<template>
	<div class="bigpics" :style="{'width': cliwidth}" v-viewer="{'url': 'source', 'title':((t)=>{return image.title + '_' + t.src.substring(t.src.lastIndexOf('_')+2,t.src.lastIndexOf('.'))})}">
		<BigImgCard :image="image" :key="index" v-for="(image,index) in sourceimg" :style="{'height': index==0?cliheight:''}" />
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
				return ((document.body.clientWidth<513?this.image.height<this.image.width:this.image.height>this.image.width) ? (this.image.width / this.image.height) *  this.Hpercent + 'vmin' : this.Hpercent + 'vmin')
			},
			cliheight(){
				return ((document.body.clientWidth<513?this.image.width<this.image.height:this.image.width>this.image.height) ? (this.image.height / this.image.width) *  this.Hpercent + 'vmin' : this.Hpercent + 'vmin')
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
