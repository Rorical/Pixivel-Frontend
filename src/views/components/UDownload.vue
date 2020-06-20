<template>
	<base-button type="primary btn-sm" @click="AriadownloadAll">下载以下插画</base-button>
</template>

<script>
	import CONFIG from '@/config.json'
	import storage from 'good-storage'
	export default {
	    name: 'Common.UD',
		props:{
			images:{
				type:Array
			}
		},
	    data() {
			return {
				aria2url : storage.get("aria2")?storage.get("aria2"):"http://localhost:16800/jsonrpc",
				titleid: storage.get("titleid") == "true"?true:false,
				isR18: storage.get("r18")=="true"?true:false
			}
		},
		computed:{

		},
		methods:{
			thetitle(image,url,i){
				return this.titleid ?image.title + "." + i + "." + url.split(".")[url.split(".").length-1] : url.split("/")[url.split("/").length-1].split("?")[0]
			},
			sourceimg(image){
				if(image.meta_pages && image.meta_pages.length==0){
					var dic = image["image_urls"]
					dic["original"] = image.meta_single_page["original_image_url"]
					return [{"image_urls":dic}]
				}
				return image.meta_pages
			},
			
			AriadownloadAll(){
				this.$notify({
					type: 'info',
					title: '添加任务'
				})
				for(var sb = 0; sb < this.images.length; sb++){
					var image = this.images[sb]
					if(image.type!="ugoira" && image.type!="manga" && (image.x_restrict==0||this.isR18)){
						var imgs = this.sourceimg(image)
						var url
						var uri = this.aria2url.split("@")
						if(uri.length > 1){
							var uri = uri[0].split("//")[1]
							var l = uri.indexOf("token:")
							if(l!=-1){
								var token = uri.substring(l+6)
							}
						}
						for(var i = 0; i < imgs.length; i++){
							url = imgs[i].image_urls["original"]
							var params = [
										[url], {'header':["Referer:https://www.pixiv.net/"],'out':this.thetitle(image,url,i)}
									]
							if(token){
								params.unshift("token:"+token)
							}
							this.axios({
								url:this.aria2url,
								method:'post',
								data: {
									'jsonrpc': '2.0',
									'id': 'qwer',
									'method': 'aria2.addUri',
									'params': params,
								},
								headers:{
									'Content-Type' : 'application/json'
								}
							}).catch(err => {
								console.error(err);
							});
						}
					}
				}
			},
		},
		mounted(){
			
		}
	}
</script>

<style>
</style>
