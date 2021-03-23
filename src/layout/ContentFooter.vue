<template>
	<footer class="footer px-4">
		<div class="row align-items-center justify-content-lg-between text-center">
			<p style="width: 100%;" ref="adbanner">可能这里会有一个广告来平衡服务器支出</p>
			<ins class="adsbygoogle"
     			style="display:block;width: 100%;"
     			data-ad-client="ca-pub-7564284646329791"
     			data-ad-slot="6050058983"
     			data-ad-format="auto"
     			data-full-width-responsive="true"></ins>
		</div>
	</footer>
</template>
<script>
	export default {
		data() {
			return {
				year: new Date().getFullYear()
			}
		},
		mounted(){
			var that = this
			var adscript = document.createElement("script");
			adscript.type = "text\/javascript";
			adscript.onload = function(){
				try{
					(adsbygoogle = window.adsbygoogle || []).push({})
				}catch (error){
					that.$refs.adbanner.innerText="是AdBlock呜呜呜好讨厌"
					console.error(error)
				}
			}
			adscript.onerror = function(e){that.$refs.adbanner.innerText="是AdBlock呜呜呜好讨厌"}
			adscript["data-ad-client"] = "ca-pub-7564284646329791"
			adscript.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
			document.currentScript.parentNode.insertBefore(adscript, document.currentScript);
		}
	};
</script>
<style></style>
