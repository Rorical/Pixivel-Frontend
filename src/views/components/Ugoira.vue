<template>
	<div class="bigpics" :style="{'width': cliwidth + 'vmin'}">
		<BigImgCard :image="imagea" :lazy="false" :style="{'height': cliheight + 'vmin'}" />
	</div>
</template>

<script>
	import BigImgCard from './BigImgCard';
	import CONFIG from '@/config.json'
	import JSZip from 'jszip'
	export default {
		name: 'Image.Ugoira',
		props: {
			image: {
				type: Object
			}
		},
		data() {
			return {
				Hpercent: 95,
				imagea: {
					base64: ""
				},
				pics: [],
				nowtick: 0,
				cliWid: document.body.clientWidth
			}
		},
		components: {
			BigImgCard
		},
		methods: {
			playPics() {
				this.imagea.base64 = this.pics[this.nowtick][0]
				setTimeout(() => {
					this.playPics()
				}, this.pics[this.nowtick][1] - 1)
				this.nowtick++
				if (this.nowtick == this.pics.length) {
					this.nowtick = 0
				}
			},
			getZip() {
				if (!this.image.id) {
					return;
				}
				this.$notify({
					type: 'info',
					title: '开始加载动图压缩包'
				})
				this.axios
					.get(CONFIG.API_HOST, {
						params: {
							type: "ugoira_metadata",
							id: this.image.id
						}
					})
					.then((response, state) => {
						if (!response.data.ugoira_metadata || response.data.ugoira_metadata.length == 0) {
							return;
						}
						var data = response.data.ugoira_metadata
						this.axios
							.get(data["zip_urls"]['medium'].replace("https://i.pximg.net/", CONFIG.IMAGE_PROXY_HOST), {
								responseType: 'blob'
							})
							.then((response, state) => {
								if (!response.data) {
									return;
								}
								this.$notify({
									type: 'success',
									title: '加载完成'
								})
								var zip = new JSZip()
								async function handle(response, data) {
									await zip.loadAsync(response.data)
									var banners = [];
									var base;
									for (var j = 0; j < data["frames"].length; j++) {
										base = await zip.file(data["frames"][j]["file"]).async("base64")
										banners.push(["data:image/jpg;base64," + base, data["frames"][j]["delay"]])
									}
									return banners
								}
								var that = this
								handle(response, data).then((pics) => {
									that.pics = pics
									that.playPics()
								})
							}).catch(err => {
								this.$notify({
									type: 'danger',
									title: '动图加载错误！'
								})
								console.error(err);
							});
					})
			}
		},
		computed: {
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
			this.getZip()
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
