<template>
	<div>

		<base-header type="gradient-warning" class="pb-6 pb-8 pt-5 pt-md-8">
		</base-header>

		<div class="container-fluid mt--7">
			<div class="row" style="margin-bottom: 10px;">
				<div class="col">
					<div class="card">
						<div class="card-header">
							<div class="row align-items-center">
								<div class="col">
									<h3 class="mb-0">排行榜</h3>
								</div>
								<div class="col text-right">
									<UDownload :images="rankimg" />
								</div>
							</div>
						</div>
						<div class="card-body">
							<base-input addon-left-icon="ni ni-calendar-grid-58">
								<flat-picker :config="dateconfig" class="form-control datepicker alternative" v-model="dates">
								</flat-picker>
								<base-dropdown>
									<base-button slot="title" type="outline-secondary dropdownssssss" class="dropdown-toggle">
										{{modedesc}}
									</base-button>
									<a class="dropdown-item" @click="modeselect" name="day">日榜</a>
									<a class="dropdown-item" @click="modeselect" name="week">周榜</a>
									<a class="dropdown-item" @click="modeselect" name="month">月榜</a>
									<a class="dropdown-item" @click="modeselect" name="day_male">男榜</a>
									<a class="dropdown-item" @click="modeselect" name="day_female">女榜</a>
									<a class="dropdown-item" @click="modeselect" name="week_original">原创作品</a>
									<a class="dropdown-item" @click="modeselect" name="week_rookie">新人榜</a>
									<a class="dropdown-item" @click="modeselect" name="day_manga">漫画日榜</a>
								</base-dropdown>
							</base-input>

						</div>
					</div>
				</div>
			</div>
			<div class="row">
				<Waterfall ref="waterfall" imageType="medium" :images="rankimg" :key="waterfallIdentifier" :cardWidth="cardWidth" />
			</div>
			<infinite-loading :identifier="waterfallIdentifier" @infinite="infiniteHandler" spinner="spiral" ref="infiniteLoading">
			</infinite-loading>
		</div>
	</div>
</template>
<script>
	Date.prototype.format = function(fmt) {
		var o = {
			"M+": this.getMonth() + 1,
			"d+": this.getDate(),
			"h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12,
			"H+": this.getHours(),
			"m+": this.getMinutes(),
			"s+": this.getSeconds(),
			"q+": Math.floor((this.getMonth() + 3) / 3),
			"S": this.getMilliseconds()
		};
		if (/(y+)/.test(fmt))
			fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
			if (new RegExp("(" + k + ")").test(fmt))
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	}
	import Waterfall from './components/Waterfall';
	import flatPicker from "vue-flatpickr-component";
	import "flatpickr/dist/flatpickr.css";
	import CONFIG from '@/config.json'
	import UDownload from './components/UDownload';
	export default {
		components: {
			Waterfall,
			flatPicker,
			UDownload
		},
		data() {
			return {
				rankimg: this.$store.state.rank.rankimg,
				waterfallIdentifier: Math.round(Math.random() * 100),
				dates: this.$store.state.rank.date,
				page: this.$store.state.rank.page,
				dateconfig: {
					allowInput: true,
					enable: [{
						from: "2007-09-10",
						to: new Date((new Date()) - 129600000).format("yyyy-MM-dd")
					}, ]
				},
				mode: this.$store.state.rank.mode,
				modedesc: this.$store.state.rank.modedesc,
				
				cardWidth: this.getCardWidth(document.documentElement.clientWidth),
				screenWidth: document.documentElement.clientWidth,
				waterfallResponsive: document.documentElement.clientWidth > 767,

			};
		},
		watch: {
			"dates": "datesChanged",
			"mode": "handleChanged",
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
		methods: {
			infiniteHandler($state) {
				this.axios
					.get(CONFIG.API_HOST, {
						params: {
							type: "rank",
							page: this.page,
							mode: this.mode,
							date: this.dates
						}
					})
					.then((response, state) => {
						if (!response.data.illusts || response.data.illusts.length == 0) {
							$state.complete();
							return;
						}
						this.rankimg = this.rankimg.concat(response.data.illusts)
						this.$store.commit("rank/setImages", this.rankimg)
						this.page = this.page + 1;
						this.$store.commit("rank/setPage", this.page)
						$state.loaded();
					}).catch(err => {
						$state.complete();
						console.error(err);
					});
			},
			modeselect(e) {
				this.mode = (e.target.name)
				this.modedesc = (e.target.innerText)
				this.$store.commit("rank/setMode", {
					mode: this.mode,
					modedesc: this.modedesc
				})
			},
			handleChanged(s) {
				this.refreshWaterfall();
			},
			datesChanged(s) {
				this.$store.commit("rank/setDate", s)
				this.handleChanged()
			},
			refreshWaterfall() {
				this.rankimg = [];
				this.$nextTick(() => {
					this.page = 0;

					//this.$redrawVueMasonry()
					this.waterfallIdentifier = this.waterfallIdentifier + 1;
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
		computed: {},
		mounted() {
			window.scrollTo(0, this.$store.state.scroll.top)
			this.$nextTick(() => {
				window.addEventListener("resize", this.windowResized, false);
			});
		},
		destroyed() {
			window.removeEventListener("resize", this.windowResized, false);
		},
	};
</script>
<style>
</style>
