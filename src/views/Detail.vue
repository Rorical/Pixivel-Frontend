<template>
    <div>
        <base-header type="gradient-danger" class="pb-6 pb-8 pt-5 pt-md-8">
        </base-header>

        <div class="container-fluid mt--8">
            <div class="row">
                <div class="col-xl-8">
					
                    <BigPics v-if="image.type!='ugoira'" ref="images" :image="image" :key="imgsIdentifier"/>
					<Ugoira v-if="image.type=='ugoira'" ref="images" :image="image" :key="imgsIdentifier"/>
					<div class="card" v-if="!image.id">
						<div class="container">
							<infinite-loading :identifier="imgsIdentifier" @infinite="infiniteHandler" spinner="spiral" ref="infiniteLoading">
								<span slot="no-more">
									
								</span>
							</infinite-loading>
							<div class="row" v-if="!id">
								<div class="col">
									<base-input alternative placeholder="要直接到id号嘛？输入就对了" @keyup.enter.native="toid" addon-left-icon="ni ni-zoom-split-in"></base-input>
								</div>
							</div>
						</div>
					</div>
					
                </div>
				<div class="col-xl-4">
					<div class="sticky">
					<card shadow type="secondary" v-if="image.user">
					    <div slot="header" class="bg-white border-0">
					        <div class="row align-items-center">
					            <div class="col">
					                <h2 class="mb-0">{{image.title}}</h2>
					            </div>
								<div class="col">
									<div class="text-align-end"><badge type="success">{{image.id}}</badge><badge type="danger" v-if="image.x_restrict>0">R18</badge></div>
									
								</div>
					        </div>
					    </div>
						<div class="clickshow">
							<p v-html="image.caption" style="font-size: 0.9rem;" :class="{'text':isFold}">
								
							</p>
							<badge tag="a" href="javascript:void(0)" v-if="iffold" class="badge" type="success" @click.native="isFold = !isFold">{{isFold?"展开":"折叠"}}</badge>
						</div>
						<div style="margin-top: 1rem;" class="row">
							<div class="col">
								<badge tag="a" href="javascript:void(0)" @click.native="search(tag.name)" type="primary" class="badge" v-for="tag in image.tags" :key="tag.name">{{tag.name}}</badge>
							</div>
						</div>
						<router-link :target="targetblank?'_blank':''" :to="{name:'用户',query:{id:image.user.id}}">
						<div class="row align-items-center" style="margin-top: 1rem;">
						    <div class="col-3">
									<div v-lazy:background-image="replaceImg(image.user.profile_image_urls.medium)" class="rounded-circle headimg"></div>
						    </div>
							<div class="col">
								<h2 class="mb-0">{{image.user.name}}</h2>
							</div>
						</div>
						</router-link>
						<div style="margin-top: 10px;">
							<xScroll :pics="xsimgs" ref="xscroll"/>
							<infinite-loading @infinite="xScrollinit" spinner="spiral" :identifier="xscrollIdentifier">
								<span slot="no-more">
									
								</span>
							</infinite-loading>
						</div>
					</card>
					<div style="height: 10px;"></div>
					<DownloadCard :image="image" v-if="image.user"/>
					</div>
				</div>
            </div>
			<br />
			<br />
			<hr>
			<div class="row" v-if="image.user">
				<Waterfall ref="waterfall" imageType="medium" :images="relateimgs" :cardWidth="cardWidth"/>
			</div>
			<infinite-loading v-if="image.user" :identifier="waterfallIdentifier" @infinite="waterfallinfiniteHandler" spinner="spiral" ref="infiniteLoading">
			</infinite-loading>
        </div>
<br />
    </div>
</template>
<script>
	import { mapGetters } from 'vuex'
	import BigPics from './components/BIgPics';
	import Ugoira from './components/Ugoira';
	import xScroll from './components/xScroll';
	import Waterfall from './components/Waterfall';
	import DownloadCard from './components/DownloadCard';
	import CONFIG from '@/config.json'
	import storage from 'good-storage'
	export default {
		name: 'Detail',
		components: {
			BigPics,
			xScroll,
			Waterfall,
			Ugoira,
			DownloadCard
		},
		data(){
			return{
				image:{},
				imgsIdentifier: Math.round(Math.random() * 100),
				xscrollIdentifier: Math.round(Math.random() * 100),
				id: this.$route.query.id,
				xsimgs: [],
				isFold: true,
				relatedpage:0,
				waterfallIdentifier: Math.round(Math.random() * 100),
				relateimgs:[],
				cardWidth: 270,
				targetblank: storage.get("targetblank") == true?true:storage.set("targetblank",false),
				isR18: storage.get("r18")==true?true:storage.set("r18",false),
				HisLen: parseInt(storage.get("HisLen")?storage.get("HisLen"):storage.set("HisLen","200"))
			}
		},
		watch: {
			"$route.query.id": {
				handler:"handleIdChanged",
				immediate: false,
			},
			"image":"Imghispush"
		},
		created () {
			this.image = this.findById()["image"]
			this.xsimgs = this.findById()["xsimgs"]
			this.relatedpage = this.findById()["relatedpage"]
			this.relateimgs = this.findById()["relateimgs"]
		},
		methods:{
			infiniteHandler($state) {
				if (!this.id) {
					$state.complete();
					return;
				}
				
				if(this.image.id){
					$state.loaded();
					$state.complete();
					return
				}
				this.axios
					.get(CONFIG.API_HOST, {
						params: {
							type: "illust",
							id:this.id
							}
						})
					.then((response, state) => {
						if (!response.data.illust || response.data.illust.length==0) {
							$state.complete();
							return;
						}
						this.image = (response.data.illust)
						this.$store.commit("detail/setImage", {id:this.id,key:"image",value:this.image})
						$state.loaded();
						$state.complete();
					});
			},
			handleIdChanged(s) {
				if(this.id != this.$route.query.id){
					this.id = this.$route.query.id;
					this.refreshImgs();
					this.refreshWaterfall();
				}
				
				
			},
			replaceImg(url){
				return url.replace("https://i.pximg.net/",CONFIG.SMALL_IMAGE_PROXY_HOST)
			},
			refreshImgs() {
				if(this.findById()["image"].id){
					this.image = this.findById()["image"];
					this.imgsIdentifier = this.imgsIdentifier + 1;
				}else{
					//this.$refs.images.$el.innerHTML = '';
					this.$nextTick(() => {
						this.image = {}
						this.imgsIdentifier = this.imgsIdentifier + 1;
					});
				}
				
			},
			handleScroll() {
				this.$store.commit("detail/setScroll", {id:this.id,top:document.documentElement.scrollTop})
			},
			xScrollinit($state){
				if (!this.id) {
					$state.complete();
					return;
				}

				if(this.xsimgs.length>0){
					$state.loaded();
					$state.complete();
					return
				}
				this.axios
					.get(CONFIG.API_HOST, {
						params: {
							type: "member_illust",
							id: this.image.user.id,
							}
						})
					.then((response, state) => {
						if (!response.data.illusts || response.data.illusts.length==0) {
							$state.complete();
							return;
						}
						this.xsimgs = response.data.illusts
						this.$store.commit("detail/setImage", {id:this.id,key:"xsimgs",value:this.xsimgs})
						var lef = 0;
						var a = 0;
						for (var i in this.xsimgs){
							if(this.xsimgs[i]["id"] == this.id){
								if(a!=0){
									lef = a * (window.innerHeight*21/100+8) - this.$refs.xscroll.$refs.xscroll.offsetWidth/2 + (window.innerHeight/10+8)
								}
								break;
							}
							if(this.xsimgs[i].x_restrict==0||this.isR18){
								a ++
							}
						}
					
						var that = this
						this.$nextTick(() => {
							that.$refs.xscroll.$refs.xscroll.scrollTo({
								left: lef,
								behavior: "smooth"
							});
						})
						$state.loaded();
						$state.complete();
					}).catch(err => {
						$state.complete();
						console.error(err);
					});
			},
			waterfallinfiniteHandler($state) {
				if (!this.id) {
					$state.complete();
					return;
				}
				this.axios
					.get(CONFIG.API_HOST, {
						params: {
							type: "related",
							page: this.relatedpage,
							id:this.id
							}
						})
					.then((response, state) => {
						if (!response.data.illusts && response.data.illusts.length==0) {
							$state.complete();
							return;
						}
						this.relateimgs = this.relateimgs.concat(response.data.illusts)
						this.$store.commit("detail/setImage", {id:this.id,key:"relateimgs",value:this.relateimgs})
						this.relatedpage = this.relatedpage + 1;
						this.$store.commit("detail/setImage", {id:this.id,key:"relatedpage",value:this.relatedpage})
						$state.loaded();
					}).catch(err => {
						$state.complete();
						console.error(err);
					});
			},
			refreshWaterfall() {
				var scroll = this.$store.state.detail.scroll[this.id]?this.$store.state.detail.scroll[this.id]:0
				if(this.findById()["xsimgs"].length>0){
					this.xsimgs = this.findById()["xsimgs"];
				}else{
					this.xsimgs = [];
					this.xscrollIdentifier += 1
				}
				if(this.findById()["relateimgs"].length>0){
					this.relateimgs = this.findById()["relateimgs"];
					this.$nextTick(() => {
						this.relatedpage = this.findById()["relatedpage"];
						//this.$redrawVueMasonry()
						this.waterfallIdentifier = this.waterfallIdentifier + 1;
						this.$nextTick(() => {
							window.scrollTo(0, scroll)
						})
					});
				}else{
					this.relateimgs = [];
					this.$nextTick(() => {
						//this.$redrawVueMasonry()
						this.relatedpage = 0;
						this.waterfallIdentifier = this.waterfallIdentifier + 1;
						this.$nextTick(() => {
							window.scrollTo(0, scroll)
						})
					});
				}
				
				
			},
			search(word){
				if(this.targetblank){
					window.open(this.$router.resolve({name:'搜索',query:{keyword:word},params:{tag:"true"}}).href, '_blank');
				}else{
					this.$router.push({name:'搜索',query:{keyword:word},params:{tag:"true"}})
				}
			},
			toid(e){
				var id = e.target.value.replace(/[^0-9]/ig,"")
				if(id.length>1){
					this.$router.push({query:{id:id}})
				}
			},
			findById(){
				return this.$store.getters["detail/findById"](this.id)
			},
			placeInHistory(obj){
				var his = storage.get("PicHis")?storage.get("PicHis"):storage.set("PicHis",[])
				
				
				for(var i = 0;i < his.length;i++){
					if(his[i].id==obj.id){
						
						his.splice(i,1)
						break
					}
				}
				
				his.push(obj)
				
				if(his.length>this.HisLen){
					his.splice(0,his.length-this.HisLen)
				}
				storage.set("PicHis",his)
			},
			Imghispush(obj){
				if(obj.id){
					this.placeInHistory(obj)
				}
				
			}
		},
		computed:{
			iffold(){
				var str = this.image.caption
				var width = 0;
				var html = document.createElement('span');
				html.innerText = str;
				html.className = 'getTextWidth';
				document.querySelector('body').appendChild(html);
				width = document.querySelector('.getTextWidth').offsetWidth;
				document.querySelector('.getTextWidth').remove();
				return width > 1043
			}
		},
		mounted(){
			window.addEventListener("scroll", this.handleScroll, false);
		},
		destroyed() {
			window.removeEventListener("scroll", this.handleScroll, false);
		}
	};
</script>
<style></style>
