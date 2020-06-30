<template>
    <div>
        <base-header type="gradient-info" class="pb-6 pb-8 pt-5 pt-md-8">
        </base-header>
		<div class="container-fluid mt--7">
			<div class="row" style="margin-bottom: 10px;">
					<div class="col">
						<div class="card">
							<div class="card-header">
								<div class="row align-items-center">
									<div class="col">
										<h3 class="mb-0">我是什么玩意儿</h3>

									</div>
									<div class="col text-right">
										<tabs ref="tabs" @click.native="changAct()">
										  <tab-pane title="我的收藏"></tab-pane>
										  <tab-pane title="关注画师"></tab-pane>
										  <tab-pane title="历史记录"></tab-pane>
										</tabs>
									</div>
								</div>
							</div>
							<div class="card-body">
								<History v-if="TabIndex==2"></History>
							</div>
						</div>
					</div>
			</div>
			<div class="row">
				
			</div>
			
		</div>
    </div>
</template>
<script>
	import CONFIG from '@/config.json'
	import storage from 'good-storage'
	import History from './components/Account/history.vue'
	export default {
		name: 'Detail',
		components: {
			History
		},
		data(){
			return{
				TabIndex:0
			}
		},
		watch: {
			
		},
		created () {
			
		},
		methods:{
			changAct(){
				this.TabIndex = this.$refs.tabs.activeTabIndex
			}
		},
		computed:{
			
		},
		mounted(){
			
		}
	};
</script>
<style></style>
