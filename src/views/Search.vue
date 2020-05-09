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
							<div class="row">
								<div class="col">
									<Userscrool v-if="checkboxes.searchforUser" :keyword="keyword" />
								</div>
							</div>
                            <div class="row">
								<Waterfall ref="waterfall" imageType="medium" :images="images" :cardWidth="cardWidth"/>
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
					exact_match_for_tags: this.$route.params.tag == "true" ? true:false,
					date_asc: false,
					searchforUser:false
				}
			}
		},
		watch: {
			"$route.query.keyword": "handleKeywordChanged",
			"checkboxes.exact_match_for_tags": "handleKeywordChanged",
			"checkboxes.date_asc": "handleKeywordChanged"
		},
		methods: {
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
						this.page = this.page + 1;
						$state.loaded();
					}).catch(err => {
						$state.complete();
						console.error(err.response.status);
					});
			},
			handleKeywordChanged(s) {
				this.keyword = this.$route.query.keyword;
				this.refreshWaterfall();
			},
			refreshWaterfall() {
				this.$refs.waterfall.$el.innerHTML = '';
				this.$nextTick(() => {
					this.page = 0;
					this.images = [];
					this.waterfallIdentifier = this.waterfallIdentifier + 1;
				});
			},
		}
	};
</script>
<style></style>
