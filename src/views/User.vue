<template>
    <div>
        <base-header class="header pb-8 pt-5 pt-lg-8 d-flex align-items-center bg-gradient-primary"
                     style="background-size: cover; background-position: center center; background-attachment: fixed;" :style="{'background-image':background_image_url}">
        </base-header>
		<div class="card">
			<div class="container">
				<div class="row" v-if="!id">
					<div class="col" style="margin-top: 10px;">
						<base-input alternative placeholder="要直接到某个画师大大的id号嘛？输入就对了" @keyup.enter.native="toid" addon-left-icon="ni ni-zoom-split-in"></base-input>
					</div>
				</div>
			</div>
		</div>
        <div class="container-fluid mt--7" v-if="model.user">
            <div class="row md-5">
                <div class="col-xl-4 order-xl-2 mb-5 mb-xl-0">

                    <div class="card card-profile shadow">
                        <div class="row justify-content-center">
                            <div class="col-lg-3 order-lg-2">
                                <div class="card-profile-image">
									<img v-lazy="replaceImg(model.user.profile_image_urls.medium)" class="rounded-circle">
                                </div>
                            </div>
                        </div>
                        <div class="card-header text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                        </div>
                        <div class="card-body pt-0 pt-md-4">
                            <div class="row">
                                <div class="col">
                                    <div class="card-profile-stats d-flex justify-content-center mt-md-5">
                                        <div>
                                            <span class="heading">{{model.profile.total_illusts}}</span>
                                            <span class="description">插画</span>
                                        </div>
                                        <div>
                                            <span class="heading">{{model.profile.total_manga}}</span>
                                            <span class="description">漫画</span>
                                        </div>
                                        <div>
                                            <span class="heading">{{model.profile.total_novels}}</span>
                                            <span class="description">小说</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="text-center">
                                <h1>
                                    {{model.user.name}}<span class="font-weight-light"></span>
                                </h1>
                                <div class="h5 font-weight-300">
                                    <badge type="info">{{model.user.account}}</badge><badge type="success">{{model.user.id}}</badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-8 order-xl-1">
                    <card shadow type="secondary">
                        <div slot="header" class="bg-white border-0">
                            <div class="row align-items-center">
                                <div class="col-8">
                                    <h3 class="mb-0">作品</h3>
                                </div>
								<div class="col text-right">
									<UDownload :images="imgs" />
								</div>
                            </div>
                        </div>
						<div>
							<infinite-loading @infinite="xScrollinit" spinner="spiral" v-if="xsimgs.length<1" :identifier="xsimgsIdentifier">
								<span slot="no-more">
									
								</span>
							</infinite-loading>
							<xScroll :pics="xsimgs"/>
						</div>
						<div style="margin-top: 1rem;">
							<nav class="nav justify-content-end">
								<base-radio name="i" v-model="radio.iorb">
									插画
								</base-radio>
								<span style="width: 20px;"></span>
								<base-radio name="b" v-model="radio.iorb">
									收藏
								</base-radio>
							</nav>
						</div>
                    </card>
                </div>
            </div>
			<card shadow type="" style="margin-top: 10px;">
				<div v-html="model.user.comment">
					
				</div>
			</card>
			<div class="row"><Waterfall ref="waterfall" imageType="medium" :images="imgs" :cardWidth="cardWidth"/></div>
			<infinite-loading :identifier="waterfallIdentifier" :key="waterfallIdentifier" @infinite="waterfallinfiniteHandler" spinner="spiral">
			</infinite-loading>
        </div>
    </div>
</template>
<script>
	import CONFIG from '@/config.json'
	import Waterfall from './components/Waterfall';
	import xScroll from './components/xScroll';
	import UDownload from './components/UDownload';
	export default {
		name: 'User',
		components: {
			Waterfall,
			xScroll,
			UDownload
		},
		data() {
			return {
				id: this.$route.query.id,
				model: {},
				xsimgs:[],
				radio:{
					iorb:"i"
				},
				imgs:[],
				bookmarks:[],
				cardWidth:265,
				page: 0,
				waterfallIdentifier: Math.round(Math.random() * 100),
				xsimgsIdentifier: Math.round(Math.random() * 100)
			}
		},
		created () {
			this.model = this.findById()["model"]
			this.xsimgs = this.findById()["xsimgs"]
			this.radio.iorb = this.findById()["radio/iorb"]
			this.imgs = this.findById()["imgs"]
			this.bookmarks = this.findById()["bookmarks"]
			this.page = this.findById()["page"]
		},
		watch: {
			"$route.query.id": "handleIdChanged",
			"radio.iorb": "handleIdChanged"
		},
		mounted(){
			if(!this.model.user){
				this.getUser()
			}
			var scroll = this.$store.state.user.scroll[this.id]?this.$store.state.user.scroll[this.id]:0
			window.addEventListener("scroll", this.handleScroll, false);
			this.$nextTick(() => {
				window.scrollTo(0, scroll)
			})
		},
		destroyed() {
			window.removeEventListener("scroll", this.handleScroll, false);
		},
		methods:{
			getUser() {
				if (!this.id) {
					return;
				}
				this.axios
					.get(CONFIG.API_HOST, {
						params: {
							type: "member",
							id: this.id,
							}
						})
					.then((response, state) => {
						if (!response.data.user || response.data.user.length==0) {
							return;
						}
						this.model = response.data
						
						this.$store.commit("user/setImage", {id:this.id,key:"model",value:this.model})
					}).catch(err => {
						console.error(err.response.status);
					});
			},
			handleScroll() {
				this.$store.commit("user/setScroll", {id:this.id,top:document.documentElement.scrollTop})
			},
			xScrollinit($state){
				this.axios
					.get(CONFIG.API_HOST, {
						params: {
							type: "member_illust",
							id: this.id,
							}
						})
					.then((response, state) => {
						if (!response.data.illusts || response.data.illusts.length==0) {
							$state.complete();
							return;
						}
						this.xsimgs = response.data.illusts
						this.$store.commit("user/setImage", {id:this.id,key:"xsimgs",value:this.xsimgs})
						$state.loaded();
						$state.complete();
					}).catch(err => {
						$state.complete();
						console.error(err.response.status);
					});
			},
			waterfallinfiniteHandler($state) {
				var scroll = this.$store.state.user.scroll[this.id]?this.$store.state.user.scroll[this.id]:0
				if(this.radio.iorb == "i"){
					this.axios
						.get(CONFIG.API_HOST, {
							params: {
								type: "member_illust",
								id: this.id,
								page:this.page
								}
							})
						.then((response, state) => {
							if (!response.data.illusts || response.data.illusts.length==0) {
								$state.complete();
								return;
							}
							this.imgs = this.imgs.concat(response.data.illusts)
							this.page = this.page + 1;
							this.$store.commit("user/setImage", {id:this.id,key:"imgs",value:this.imgs})
							this.$store.commit("user/setImage", {id:this.id,key:"page",value:this.page})
							this.$nextTick(() => {
								window.scrollTo(0, scroll)
							})
							$state.loaded();
						}).catch(err => {
							$state.complete();
							console.error(err.response.status);
						});
				}else{
					this.axios
						.get(CONFIG.API_HOST, {
							params: {
								type: "favorite",
								id: this.id,
								max_bookmark_id:this.page
								}
							})
						.then((response, state) => {
							if (!response.data.illusts || response.data.illusts.length==0) {
								$state.complete();
								return;
							}
							this.imgs = this.imgs.concat(response.data.illusts)
							if(!response.data["next_url"]){
								$state.complete();
							}
							this.page = response.data["next_url"].split("&")[response.data["next_url"].split("&").length-1].split("=")[1];
							this.$store.commit("user/setImage", {id:this.id,key:"bookmarks",value:this.imgs})
							this.$store.commit("user/setImage", {id:this.id,key:"bpage",value:this.page})
							this.$nextTick(() => {
								window.scrollTo(0, scroll)
							})
							$state.loaded();
						}).catch(err => {
							$state.complete();
							console.error(err.response.status);
						});
				}
			},
			replaceImg(url){
				return url.replace("https://i.pximg.net/",CONFIG.SMALL_IMAGE_PROXY_HOST)
			},
			handleIdChanged(s) {
				console.log(s)
				if(this.id != this.$route.query.id){
					this.id = this.$route.query.id;
					this.model = this.findById()["model"]
					if(!this.model.user){
						this.getUser()
					}
					
				}
				this.refreshXscroll();
				this.refreshWaterfall();
				
				
			},
			refreshWaterfall() {
				this.$store.commit("user/setImage", {id:this.id,key:"radio/iorb",value:this.radio.iorb})
				if(this.radio.iorb=="i"){
					this.imgs = this.findById()["imgs"];
					this.page = this.findById()["page"];
				}else{
					this.imgs = this.findById()["bookmarks"];
					this.page = this.findById()["bpage"];
				}
				this.$nextTick(() => {
					this.$redrawVueMasonry()
					this.waterfallIdentifier = this.waterfallIdentifier + 1;
				});
			},
			refreshXscroll(){
				this.xsimgs = this.findById()["xsimgs"]
				this.$nextTick(() => {
					if(this.xsimgs.length==0){
						this.xsimgsIdentifier = this.xsimgsIdentifier + 1;
					}
				});
				
			},
			toid(e){
				var id = e.target.value.replace(/[^0-9]/ig,"")
				if(id.length>1){
					this.$router.push({query:{id:id}})
				}
			},
			findById(){
				return this.$store.getters["user/findById"](this.id)
			}
		},
		computed:{
			background_image_url(){
				return this.replaceImg(this.model.profile && this.model.profile.background_image_url ? "url("+this.model.profile.background_image_url+") !important":"")
			}
		}
	  };
</script>
<style></style>
