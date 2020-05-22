<template>
	<div class="card">
	  <div class="card-header">
	    <div class="row align-items-center">
	      <div class="col">
	        <h3 class="mb-0">热门标签</h3>
	      </div>
	    </div>
	</div>
	<div class="card-body">
		<nav aria-label="热门标签" class="y-list scrollbar">
			<badge v-for="tag in tags" tag="a" @click.native="search(tag.tag)" href="javascript:void(0)" type="info" >{{tag.tag}}</badge>
			<infinite-loading @infinite="infiniteHandler" spinner="spiral" class="card border-0">
				<span slot="no-more">
					
				</span>
			</infinite-loading>
		</nav>
	</div>
	</div>
</template>

<script>
	import CONFIG from '@/config.json'
	import storage from 'good-storage'
	export default {
	    name: 'Rank.lTags',
		props:{
		},
	    data() {
			return {
				targetblank: storage.get("targetblank") == "true"?true:false,
				tags:this.$store.state.mainpage.tags
			}
		},
	    methods: {
			infiniteHandler($state) {
				if(this.tags.length>0){
					$state.loaded();
					$state.complete();
				}
				this.axios
					.get(CONFIG.API_HOST, {
						params: {
							type: "tags",
							}
						})
					.then((response, state) => {
						if (!response.data.trend_tags) {
							$state.complete();
							return;
						}
						this.tags = (response.data.trend_tags)
						this.$store.commit("mainpage/settags", this.tags)
						$state.loaded();
						$state.complete();
					});
			},
			search(word){
				if(this.targetblank){
					window.open(this.$router.resolve({name:'搜索',query:{keyword:word},params:{tag:"true"}}).href, '_blank');
				}else{
					this.$router.push({name:'搜索',query:{keyword:word},params:{tag:"true"}})
				}
			}
		}
	}
</script>

<style>
</style>
