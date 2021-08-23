<template>
	<div>
		<base-header type="sb-info" class="pb-6 pb-8 pt-5 pt-md-8 background" style="height: calc(100vh + 6rem);" :style="{'background-image':`url(${backgroundImg})`}">
		</base-header>
		<div class="container-fluid mt--7">
			<div class="row" style="margin-bottom: 10px;">
				<div class="col-xl-8 mb-5 mb-xl-0">
					<lRanking />
				</div>

				<div class="col-xl-4 md-5">
					<lTags />
				</div>
			</div>
			<div class="row">
				<div class="col justify-content-center">
					<Waterfall v-if="rankimg.length>0" ref="waterfall" imageType="medium" :images="rankimg" :cardWidth="cardWidth" />
					<infinite-loading @infinite="infiniteHandler" :identifier="waterfallIdentifier" spinner="spiral"></infinite-loading>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import lRanking from './components/lRanking';
	import lTags from './components/lTags';
	import CONFIG from '@/config.json'
	import Waterfall from './components/Waterfall';
	import storage from 'good-storage'

	export default {
		components: {
			lRanking,
			lTags,
			Waterfall
		},
		data() {
			return {
				rankimg: this.$store.state.mainpage.rankimg,
				waterfallIdentifier: Math.round(Math.random() * 100),
				cardWidth: this.getCardWidth(document.documentElement.clientWidth),
				screenWidth: document.documentElement.clientWidth,
				waterfallResponsive: document.documentElement.clientWidth > 767,
				isR18: storage.get("r18") == true ? true : storage.set("r18", false),
				mainPageSanity: storage.get("mainPageSanity") == false ? false : storage.set("mainPageSanity", true),
			};
		},
		watch: {
			screenWidth(width) {
				if (this.resizeTimer) {
					clearTimeout(this.resizeTimer);
				}
				this.resizeTimer = setTimeout(() => {
					this.screenWidth = width;
					this.scrollTop = document.documentElement.scrollTop;
					if (this.screenWidth <= 767) {
						this.waterfallResponsive = false;
					} else {
						this.waterfallResponsive = true;
					}
					this.$nextTick(() => {
						this.cardWidth = this.getCardWidth(this.screenWidth);
						document.documentElement.scrollTop = this.scrollTop
					});
				}, 300);
			}
		},
		computed: {
			backgroundImg() {
				return CONFIG.RAND_IMG
			}
		},
		methods: {
			infiniteHandler($state) {
				if (this.rankimg.length > 0) {
					$state.loaded();
					$state.complete();
					return;
				}
				this.axios
					.get(this.getApiHost("illust_recommended"), {
						params: {
							type: "illust_recommended",
						}
					})
					.then((response, state) => {
						if (!response.data.illusts || response.data.illusts.length == 0) {
							$state.complete();
							return;
						}

						this.rankimg = this.mainPageSanity ? (response.data.illusts).filter(function(o) {
							return o.sanity_level < 3
						}) : (response.data.illusts)
						this.$store.commit("mainpage/setrankimg", this.rankimg)
						$state.loaded();
						$state.complete();
					});
			},
			displayDonate() {
				var lastShowDonate = storage.get('donateShow', 0)
				if (lastShowDonate && (new Date().valueOf() - parseInt(lastShowDonate, 10)) / 1000 < 604800) {
					return
				}
				if (Math.random() < 0.5) {
					storage.set('donateShow', new Date().valueOf())
					this.$nextTick(() => {
						this.$notify({
							type: 'info',
							title: "通过爱发电赞助我们，让服务水平更进一步叭！",
							message: "请点击<a href='https://afdian.net/@rorical' class='announce-link'>@Rorical的爱发电</a>",
							timeout: null,
							closeOnClick: false
						})
					})
				}
			},
			displayAbout() {
				var dialog = storage.get("dialog", "")
				this.axios
					.get("getyou.txt")
					.then((response, state) => {
						if (response.data != dialog) {
							this.$nextTick(() => {
								this.$notify({
									type: 'warning',
									title: response.data.split("\n")[0],
									message: response.data.split("\n")[1],
									timeout: null,
									closeOnClick: false
								})
							})
							storage.set("dialog", response.data)
						} else {
							this.displayDonate()
						}
					});
			},
			getCardWidth(width) {
				if (width >= 768) {
					return 280;
				} else if (width >= 515 && width < 768) {
					return 210;
				} else if (width >= 423 && width < 515) {
					return 170;
				} else if (width >= 361 && width < 423) {
					return 141;
				} else if (width >= 321 && width < 361) {
					return 210;
				} else if (width < 321) {
					return 210;
				}

			},
			windowResized() {
				this.screenWidth = document.documentElement.clientWidth;
			},
		},
		mounted() {
			window.scrollTo(0, this.$store.state.scroll.top)
			this.displayAbout()
			/*
			this.axios
				.get("https://www.rrll.cc/tuceng/ecy.php?return=json")
				.then((response, state) => {
					if (response.data.code!=200) {
						return;
					}
					this.backgroundImg = response.data.acgurl
				});
				*/
			this.$nextTick(() => {
				window.addEventListener("resize", this.windowResized, false);
			});

			console.log(this.getProxy(323123235))
		},
		destroyed() {
			window.removeEventListener("resize", this.windowResized, false);
		},
	};
</script>
<style lang="scss">
	.announce-link {
		color: #ffffff;
		transition: all .5s;
		text-decoration: underline;

		&:hover {
			text-decoration: underline;
			color: #5e72e4;
		}
	}
</style>
