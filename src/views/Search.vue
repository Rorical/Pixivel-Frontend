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
										<base-checkbox v-model="checkboxes.date_asc" class="mg">升序排列</base-checkbox>
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
				cardWidth:265,
				checkboxes:{
					exact_match_for_tags: false,
					date_asc: false,
					searchforUser:false
				}
			}
		},
		created () {
			this.images = this.findById()["images"]
			this.page = this.findById()["page"]
			this.checkboxes.exact_match_for_tags = (this.$route.params.tag == "true" ? true:this.findById()["checkboxes/exact_match_for_tags"])
			this.checkboxes.date_asc = this.findById()["checkboxes/date_asc"]
		},
		watch: {
			"$route.query.keyword": "handleKeywordChanged",
			"checkboxes": {
				handler:"handleKeywordChanged",
				immediate: false,
				deep: true
			}
		},
		methods: {
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
							order: this.checkboxes.date_asc ? "date_asc" : "date_desc"
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
						$state.complete();
						console.error(err.response.status);
					});
			},
			handleScroll() {
				this.$store.commit("search/setScroll", {id:this.keyword,top:document.documentElement.scrollTop})
			},
			handleKeywordChanged(s) {
					this.keyword = this.$route.query.keyword;
					this.refreshWaterfall();
					this.$store.commit("search/setSearch", {id:this.keyword,key:"checkboxes/exact_match_for_tags",value:this.checkboxes.exact_match_for_tags})
					this.$store.commit("search/setSearch", {id:this.keyword,key:"checkboxes/date_asc",value:this.checkboxes.date_asc})
			},
			refreshWaterfall() {
				
				
				if(this.findById()["images"] && this.findById()["images"].length>0 && this.checkboxes.exact_match_for_tags == this.findById()["checkboxes/exact_match_for_tags"] && this.checkboxes.date_asc == this.findById()["checkboxes/date_asc"]){
					var scrollDis = this.$store.state.search.scroll[this.keyword]
					this.images = this.findById()["images"];
					
					this.$nextTick(() => {
						this.page = this.findById()["page"];
						this.$redrawVueMasonry()
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
			
		},
		mounted(){
			window.addEventListener("scroll", this.handleScroll, false);
			var scrollDis = this.$store.state.search.scroll[this.keyword]
			//setTimeout(()=>{
				this.$nextTick(()=>{
					window.scrollTo(0,scrollDis)
				})
				
			//},0)
			
		},
		destroyed() {
			window.removeEventListener("scroll", this.handleScroll, false);
		}
	};
</script>
<style></style>
