<template>
    <div>
        <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
        </base-header>
        <div class="container-fluid mt--7 md-5">
            <div class="row">
                <div class="col">
                    <div class="card shadow">
                        <div class="card-header bg-transparent">
							<div class="row">
								<div class="col"><h3 style="width: fit-content;">搜索"{{keyword}}"</h3></div>
								<div class="col">
									<nav class="nav justify-content-end">
										<base-checkbox v-model="checkboxes.exact_match_for_tags" class="mg">精准搜索</base-checkbox>
										<base-checkbox v-model="checkboxes.searchforUser" class="mg">搜索用户</base-checkbox>
									</nav>
								</div>
							</div>
                        </div>
						
                        <div class="card-body">
							<div class="row" v-if="checkboxes.searchforUser">
								<div class="col">
									<Userscrool :keyword="keyword" />
								</div>
							</div>
                            <div class="row">
								<Waterfall ref="waterfall" imageType="medium" :images="images" :cardWidth="cardWidth" :key="waterfallIdentifier"/>
                            </div>
							
							<infinite-loading :identifier="waterfallIdentifier" @infinite="infiniteHandler" spinner="spiral" ref="infiniteLoading">
							</infinite-loading>
                        </div>
                    </div>
                </div>
            </div>
        </div>
		
    </div>
</template>
<script>
	import Waterfall from './components/Waterfall';
	import Userscrool from './components/Userscrool'
	import CONFIG from '@/config.json'
	export default {
		components:{
			Waterfall,
			Userscrool
		},
		data() {
			return {
				keyword: this.$route.query.keyword,
				images:[],
				page: 0,
				waterfallIdentifier: Math.round(Math.random() * 100),
				cardWidth: this.getCardWidth(document.documentElement.clientWidth),
				screenWidth: document.documentElement.clientWidth,
				waterfallResponsive: document.documentElement.clientWidth > 767,
				checkboxes:{
					exact_match_for_tags: false,
					searchforUser:false
				}
			}
		},
		created () {
			this.images = this.findById()["images"]
			this.page = this.findById()["page"]
			this.checkboxes.exact_match_for_tags = (this.$route.params.tag == "true" ? true:this.findById()["checkboxes/exact_match_for_tags"])
			this.changeTitle(this.keyword)
		},
		watch: {
			"$route.query.keyword": "handleKeywordChanged",
			"checkboxes": {
				handler:"handleKeywordChanged",
				immediate: false,
				deep: true
			},
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
			changeTitle(title){
				document.title = `${title} - Pixivel`
			},
			findById(){
				return this.$store.getters["search/findById"](this.keyword)
			},
			infiniteHandler($state) {
				if (!this.keyword) {
					$state.complete();
					return;
				}
				this.axios
					.get(CONFIG.API_HOST, {
						params: {
							type: "search",
							word: this.keyword,
							page: this.page,
							mode: this.checkboxes.exact_match_for_tags ? "exact_match_for_tags" : "partial_match_for_tags",
							}
						})
					.then((response, state) => {
						
						if (!response.data.illusts || response.data.illusts.length==0) {
							$state.complete();
							return;
						}
						this.images = this.images.concat(response.data.illusts)
						this.$store.commit("search/setSearch", {id:this.keyword,key:"images",value:this.images})
						this.page = this.page + 1;
						this.$store.commit("search/setSearch", {id:this.keyword,key:"page",value:this.page})
						$state.loaded();
					}).catch(err => {
						if(err.response["status"] == 403) {
							this.$notify({
								type: 'danger',
								title: '请求速度过快...'
							})
						}
						$state.complete();
						console.error(err);
					});
			},
			handleScroll() {
				this.$store.commit("search/setScroll", {id:this.keyword,top:document.documentElement.scrollTop})
			},
			handleKeywordChanged(s) {
					this.keyword = this.$route.query.keyword;
					this.changeTitle(this.keyword)
					this.refreshWaterfall();
					this.$store.commit("search/setSearch", {id:this.keyword,key:"checkboxes/exact_match_for_tags",value:this.checkboxes.exact_match_for_tags})
			},
			refreshWaterfall() {
				
				
				if(this.findById()["images"] && this.findById()["images"].length>0 && this.checkboxes.exact_match_for_tags == this.findById()["checkboxes/exact_match_for_tags"]){
					var scrollDis = this.$store.state.search.scroll[this.keyword]
					this.images = this.findById()["images"];
					
					this.$nextTick(() => {
						this.page = this.findById()["page"];
						//this.$redrawVueMasonry()
						this.waterfallIdentifier = this.waterfallIdentifier + 1;
						this.$nextTick(()=>{
							window.scrollTo(0,scrollDis)
						})
					});
				}else{
					this.$nextTick(() => {
						this.images = [];
						this.$redrawVueMasonry()
						this.page = 0;
						this.waterfallIdentifier = this.waterfallIdentifier + 1;
					});
				}
				
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
		mounted(){
			window.addEventListener("scroll", this.handleScroll, false);
			var scrollDis = this.$store.state.search.scroll[this.keyword]
			//setTimeout(()=>{
				this.$nextTick(()=>{
					window.scrollTo(0,scrollDis)
				})
				
			//},0)
			this.$nextTick(() => {
				window.addEventListener("resize", this.windowResized, false);
			});
			
		},
		destroyed() {
			window.removeEventListener("scroll", this.handleScroll, false);
			window.removeEventListener("resize", this.windowResized, false);
		}
	};
</script>
<style></style>
