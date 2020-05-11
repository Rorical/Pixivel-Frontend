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
		components: {
			ImageCard
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	
</style>
