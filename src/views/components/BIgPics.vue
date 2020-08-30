<template>
	<div class="bigpics" :style="{'width': cliwidth}" v-viewer="{'url': 'source', 'title':((t)=>{return image.title + '_' + t.src.substring(t.src.lastIndexOf('_')+2,t.src.lastIndexOf('.'))})}">
		<BigImgCard :image="img" :key="index" v-for="(img,index) in sourceimg" :style="{'height': index==0?cliheight:''}" />
		<base-button ref="showbt" type="secondary" class="show-more" v-if="this.image.meta_pages&&this.image.meta_pages.length>1"
		 @click="changeShow()">{{isShowMore?"收起":"展示更多..."}}</base-button>
	</div>
</template>

<script>
	import BigImgCard from './BigImgCard';
	import storage from 'good-storage'
	export default {
		name: 'Image.BigPics',
		props: {
			image: {
				type: Object
			}
		},
		data() {
			return {
				isShowMore: false,
				Hpercent: 95,
				cliWid: document.body.clientWidth,
				isR18: storage.get("r18") == true ? true : storage.set("r18", false)
			}
		},
		components: {
			BigImgCard
		},
		created() {
			this.isShowMore = this.$store.getters["detail/findById"](this.image.id)["show"]
		},
		methods: {
			changeShow() {
				if (this.isShowMore) {
					this.isShowMore = false
					document.documentElement.scrollTop = 0
				} else {
					this.isShowMore = true
				}
				this.$store.commit("detail/setImage", {
					id: this.image.id,
					key: "show",
					value: this.isShowMore
				})

			},
		},
		computed: {
			sourceimg() {
				if (this.image.meta_pages) {
					if (this.image.meta_pages.length == 0) {
						var dic = this.image["image_urls"]
						dic["original"] = this.image.meta_single_page["original_image_url"]
						return [{
							"image_urls": dic
						}]
					}
					if (this.isShowMore) {
						return this.image.meta_pages
					} else {
						return [this.image.meta_pages[0]]
					}
				} else {
					return []
				}
			},
			cliwidth() {
				return this.cliWid < 760 ? this.Hpercent + 'vmin' : (this.image.height > this.image.width ? (this.image
					.width / this.image.height) * this.Hpercent + 'vmin' : this.Hpercent + 'vmin')
			},
			cliheight() {
				return this.cliWid < 760 ? (this.image.height / this.image.width) * this.Hpercent + 'vmin' : (this.image
					.width > this.image.height ? (this.image.height / this.image.width) * this.Hpercent + 'vmin' : this.Hpercent +
					'vmin')
			}
		},
		mounted() {
			const that = this
			window.onresize = () => {
				return (() => {
					that.cliWid = document.body.clientWidth
				})()
			}
		}
	}
</script>

<style>
</style>
