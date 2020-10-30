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
								<div class="col">
									<h3 style="width: fit-content;">设置</h3>
								</div>
							</div>
						</div>
						<div class="card-body">
							<div class="row">
								<div class="col-md">
									<div class="form-group">
										<h4><a aria-hidden="true" href="javascript:void(0)" class="header-anchor">#</a> Aria设置</h4>
										<input placeholder="Aria2的Url" v-model="datas.aria2" class="form-control">
									</div>
									<div class="form-group">
										<h4><a aria-hidden="true" href="javascript:void(0)" class="header-anchor">#</a> 下载图片标题</h4>
										<base-switch v-model="datas.titleid"></base-switch>
									</div>

								</div>
								<div class="col-md">
									<div class="form-group">
										<h4><a aria-hidden="true" href="javascript:void(0)" class="header-anchor">#</a> 背景颜色</h4>
										<input placeholder="写入一个颜色的十六进制字符串" v-model="datas.bodycolor" class="form-control">
									</div>
									<div class="form-group">
										<h4><a aria-hidden="true" href="javascript:void(0)" class="header-anchor">#</a> 点击图片直接跳转新页面</h4>
										<base-switch v-model="datas.targetblank"></base-switch>
									</div>
								</div>
								<div class="col-md">
									<div class="form-group">
										<h4><a aria-hidden="true" href="javascript:void(0)" class="header-anchor">#</a> 历史记录长度</h4>
										<input placeholder="历史记录肯定有长度" v-model="datas.HisLen" class="form-control">
									</div>
									<div class="form-group">
										<h4><a aria-hidden="true" href="javascript:void(0)" class="header-anchor">#</a> 图片敏感度筛选</h4>
										<input placeholder="这里是过滤的图片敏感度(最大为7)" v-model="datas.Sanity" class="form-control">
									</div>
								</div>
								<div class="col-md">
									<div class="form-group" v-if="isIncognito">
										<h4 class="text-danger"><a aria-hidden="true" href="javascript:void(0)" class="header-anchor text-danger">#</a> R-18</h4>
										<base-switch v-model="datas.r18"></base-switch>
									</div>
									<div class="form-group">
										<h4><a aria-hidden="true" href="javascript:void(0)" class="header-anchor">#</a> 首页推荐敏感度过滤</h4>
										<base-switch v-model="datas.mainPageSanity"></base-switch>
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
		data() {
			return {
				datas: {
					aria2: storage.get("aria2") ? storage.get("aria2") : storage.set("aria2", "http://localhost:16800/jsonrpc"),
					titleid: storage.get("titleid") == true ? true : storage.set("titleid", false),
					bodycolor: storage.get("bodycolor") ? storage.get("bodycolor") : storage.set("bodycolor", "#FFFFFF"),
					targetblank: storage.get("targetblank") == true ? true : storage.set("targetblank", false),
					r18: storage.get("r18") == true ? true : storage.set("r18", false),
					HisLen: storage.get("HisLen") ? storage.get("HisLen") : storage.set("HisLen", 200),
					Sanity: storage.get("Sanity") ? storage.get("Sanity") : storage.set("Sanity", 5),
					mainPageSanity: storage.get("mainPageSanity") == false ? false : storage.set("mainPageSanity", true),
				},
				isIncognito:false
			}
		},
		methods: {
			saveAll() {
				for (var key in this.datas) {
					storage.set(key, this.datas[key])
				}
				this.$notify({
					type: 'success',
					title: '设置成功！'
				})
			},
			async cognito() {
				if ('storage' in navigator && 'estimate' in navigator.storage) {
					const {
						usage,
						quota
					} = await navigator.storage.estimate();
					if (quota < 120000000) {
						return true
					}
				}
				return false
			}
		},
		computed: {

		},
		mounted(){
			this.$nextTick(() => {
				this.cognito().then((is) => {
					this.isIncognito = is
				})
			})
		}
	}
</script>

<style>
</style>
