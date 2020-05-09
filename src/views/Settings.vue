<template>
	<div>
	    <base-header type="default" class="pb-6 pb-8 pt-5 pt-md-8">
	    </base-header>
		<div class="container-fluid mt--7 md-5">
		    <div class="row">
		        <div class="col">
		            <div class="card shadow">
		                <div class="card-header bg-transparent">
							<div class="row">
								<div class="col"><h3 style="width: fit-content;">设置</h3></div>
							</div>
		                </div>
		                <div class="card-body">
		                    <div class="row">
		                        <div class="col-md-6">
									<div class="form-group">
										<h4><a aria-hidden="true" href="javascript:void(0)" class="header-anchor">#</a> Aria设置</h4>
										<input placeholder="Aria2的Url" v-model="datas.aria2" class="form-control">
									</div>
									<div class="form-group">
										<h4><a aria-hidden="true" href="javascript:void(0)" class="header-anchor">#</a> 下载图片标题</h4>
										<base-switch v-model="datas.titleid"></base-switch>
									</div>
		                        </div>
		                        <div class="col-md-6">
<div class="form-group">
										<h4><a aria-hidden="true" href="javascript:void(0)" class="header-anchor">#</a> 背景颜色</h4>
										<input placeholder="写入一个颜色的十六进制字符串" v-model="datas.bodycolor" class="form-control">
									</div>
		                        </div>
		                    </div>
							<div class="row">
								<div class="col">
									<base-button type="primary" @click="saveAll">保存</base-button>
								</div>
							</div>
		                </div>
		            </div>
		        </div>
		    </div>
		</div>
	</div>
</template>

<script>
	import CONFIG from '@/config.json'
	import storage from 'good-storage'
	export default {
		name: 'setting',
		data(){
			return{
				datas:{
					aria2 : storage.get("aria2")?storage.get("aria2"):"http://localhost:16800/jsonrpc",
					titleid: storage.get("titleid") == "true"?true:false,
					bodycolor: storage.get("bodycolor")?storage.get("bodycolor"):"#FFFFFF",
				}
			}
		},
		methods:{
			saveAll(){
				for(var key in this.datas){
					storage.set(key,this.datas[key].toString())
				}
				this.$notify({
					type: 'success',
					title: '设置成功！'
				})
			}
		}
	}
</script>

<style>
</style>
