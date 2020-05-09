<template>
    <div>
        <base-header type="gradient-danger" class="pb-6 pb-8 pt-5 pt-md-8">
        </base-header>

        <div class="container-fluid mt--8">
            <div class="row">
                <div class="col-xl-8">
					
                    <BigPics v-if="image.type!='ugoira'" ref="images" :image="image" />
					<Ugoira v-if="image.type=='ugoira'" ref="images" :image="image" />
					
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
					                <h2 class="mb-0">{{image.title}}</h2> <badge type="danger" v-if="image.x_restrict>0">R18</badge>
					            </div>
					        </div>
					    </div>
						<div class="clickshow">
							<p v-html="image.caption" style="font-size: 0.9rem;" :class="{'text':isFold}">
								
							</p>
							<badge tag="a" href="javascript:void(0)" v-if="iffold" class="badge" type="success" @click.native="isFold = !isFold">{{isFold?"展开":"折叠"}}</badge>
						</div>
						<div style="margin-top: 1rem;"class="row">
							<div class="col">
								<badge tag="a" href="javascript:void(0)" @click.native="search(tag.name)" type="primary" class="badge" v-for="tag in image.tags">{{tag.name}}</badge>
							</div>
						</div>
						<router-link :to="{name:'用户',query:{id:image.user.id}}">
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
							<infinite-loading @infinite="xScrollinit" spinner="spiral">
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
			<br>
			<br>
			<hr />
			<div class="row" v-if="image.user">
				<Waterfall ref="waterfall" imageType="medium" :images="relateimgs" :cardWidth="cardWidth"/>
			</div>
			<infinite-loading v-if="image.user" :identifier="waterfallIdentifier" @infinite="waterfallinfiniteHandler" spinner="spiral" ref="infiniteLoading">
			</infinite-loading>
        </div>

    </div>
</template>
<script>
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
				id: this.$route.query.id,
				xsimgs: [],
				isFold: true,
				relatedpage:0,
				waterfallIdentifier: Math.round(Math.random() * 100),
				relateimgs:[],
				cardWidth: 270,
				isR18: storage.get("r18")=="true"?true:false
			}
		},
		watch: {
			"$route.query.id": "handleIdChanged",
		},
		methods:{
			infiniteHandler($state) {
				if (!this.id) {
					$state.complete();
					return;
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
						$state.loaded();
						$state.complete();
					});
			},
			handleIdChanged(s) {
				this.id = this.$route.query.id;
				this.refreshImgs();
				this.refreshWaterfall();
			},
			replaceImg(url){
				return url.replace("https://i.pximg.net/",CONFIG.SMALL_IMAGE_PROXY_HOST)
			},
			refreshImgs() {
				if(this.$refs.images)
				this.$refs.images.$el.innerHTML = '';
				this.$nextTick(() => {
					this.image = {};
					this.imgsIdentifier = this.imgsIdentifier + 1;
				});
			},
			xScrollinit($state){
				if (!this.id) {
					$state.complete();
					return;
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
						var lef = 0;
						var a = 0;
						for (var i in this.xsimgs){
							if(this.xsimgs[i]["id"] == this.id){
								if(a!=0){
									a -= 1
									lef = a * 170 + 85
								}
								break;
							}
							if(this.xsimgs[i].x_restrict==0||this.isR18){
								a ++
							}
						}
						
						var that = this.$refs.xscroll.$refs.xscroll
						this.$nextTick(() => {
							that.scrollTo({
								left: lef,
								behavior: "smooth"
						}	);
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
						if (!response.data.illusts || response.data.illusts.length==0) {
							$state.complete();
							return;
						}
						this.relateimgs = this.relateimgs.concat(response.data.illusts)
						this.relatedpage = this.relatedpage + 1;
						$state.loaded();
					}).catch(err => {
						$state.complete();
						console.error(err.response.status);
					});
			},
			refreshWaterfall() {
				if(this.$refs.waterfall)
				this.$refs.waterfall.$el.innerHTML = '';
				this.$nextTick(() => {
					this.relatedpage = 0;
					this.relateimgs = [];
					this.xsimgs = [];
					this.waterfallIdentifier = this.waterfallIdentifier + 1;
				});
			},
			search(word){
				this.$router.push({name:'搜索',query:{keyword:word},params:{tag:"true"}})
			},
			toid(e){
				var id = e.target.value.replace(/[^0-9]/ig,"")
				if(id.length>1){
					this.$router.push({query:{id:id}})
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
		}
	};
</script>
<style></style>
