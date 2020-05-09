<template>
	<div class="card">
	  <div class="card-header">
	    <div class="row align-items-center">
	      <div class="col">
	        <h3 class="mb-0">今日排行</h3>
	      </div>
	      <div class="col text-right">
	        <base-button size="sm" type="primary" @click="$router.push({name:'排行榜'})">查看所有</base-button>
	      </div>
	    </div>
	</div>
	<div class="card-body">
		<infinite-loading @infinite="infiniteHandler" spinner="spiral" class="card border-0">
			<span slot="no-more">
				
			</span>
		</infinite-loading>
		<xScroll :pics="pics"/>
	</div>
	</div>
</template>

<script>
	import CONFIG from '@/config.json'
	import xScroll from './xScroll';
	export default {
	    name: 'Rank.lRanking',
		components:{
			xScroll
		},
		props:{
		},
	    data() {
			return {
				pics:[
					
				]
			}
		},
	    methods: {
			infiniteHandler($state) {
				this.axios
					.get(CONFIG.API_HOST, {
						params: {
							type: "rank",
							}
						})
					.then((response, state) => {
						if (!response.data.illusts) {
							$state.complete();
							return;
						}
						this.pics = (response.data.illusts)
						
						$state.loaded();
						$state.complete();
					});
			},
		}
	}
</script>

<style>
</style>
