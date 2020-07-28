<template>
	<div class="waterfall" v-masonry transition-duration="200ms" item-selector=".waterfall-item" fit-width="true">
		<ImageCard v-masonry-tile v-for="item in images" class="waterfall-item" :image="item" :cardWidth="cardWidth" :imageType="imageType"/>
	</div>
</template>

<script>
	import ImageCard from './ImageCard';
	export default {
		name: 'Image.Waterfall',
		props: {
			images: {
				type: Array
			},
			cardWidth: {
				type: Number,
				default: 268
			},
			imageType: {
				type: String,
				default:"large"
			}
		},
		watch:{
			"images":"waterChanged"
		},
		components: {
			ImageCard
		},
		methods: {
			waterChanged(){
				
				this.commitDetail()
				this.$nextTick(() => {
					this.$redrawVueMasonry()
				})
			},
			commitDetail(){
				for(var i = 0; i < this.images.length; i ++){
					var image = this.images[i]
					if(!this.$store.getters["detail/findById"](image.id)["image"].id){
						this.$store.commit("detail/setImage", {id:image.id,key:"image",value:image})
					}
					
				}
			}
		},
		created(){
			this.commitDetail()
		}
	}
</script>

<style lang="scss">
	
</style>
