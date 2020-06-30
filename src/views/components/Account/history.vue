<template>
	<div class="container">
		
		<div class="row align-items-center">
		  <div class="col">
		    <UDownload :images="History" />
		  </div>
		  <div class="col text-right">
		    <base-button type="info btn-sm" @click="clearHis()">清除记录</base-button>
		  </div>
		</div>
		<div class="row">
			<Waterfall ref="waterfall" imageType="medium" :images="History" :key="waterfallIdentifier" :cardWidth="cardWidth"/>
		</div>
		
	</div>
</template>

<script>
	import Waterfall from '../Waterfall'
	import UDownload from '../UDownload.vue'
	import storage from 'good-storage'
	export default {
		name: 'Account.History',
		data(){
			return{
				History : (storage.get("PicHis")?storage.get("PicHis"):storage.set("PicHis",[])).reverse(),
				waterfallIdentifier: Math.round(Math.random() * 100),
				cardWidth: 265
			}
		},
		components: {
			Waterfall,
			UDownload
		},
		methods: {
			clearHis(){
				storage.set("PicHis",[])
				this.History=[]
			}
		},
		computed:{
			
		},
		mounted(){
			
		}
	}
</script>

<style lang="scss">
</style>
