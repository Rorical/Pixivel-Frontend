<template>
    <div>

        <base-header type="gradient-warning" class="pb-6 pb-8 pt-5 pt-md-8">
        </base-header>

		<div class="container-fluid mt--7">
        	<div class="row" style="margin-bottom: 10px;">
        			<div class="col">
        				<div class="card">
        					<div class="card-header">
        						<div class="row align-items-center">
        							<div class="col">
        								<h3 class="mb-0">排行榜</h3>
        							</div>
									<div class="col text-right">
										<UDownload :images="rankimg" />
									</div>
        						</div>
        					</div>
        					<div class="card-body">
        						<base-input addon-left-icon="ni ni-calendar-grid-58">
        							<flat-picker
        										 :config="dateconfig"
        										 class="form-control datepicker alternative"
        										 v-model="dates">
        							</flat-picker>
        							<base-dropdown>
        								<base-button slot="title" type="outline-secondary dropdownssssss" class="dropdown-toggle">
        									{{modedesc}}
        								</base-button>
        								<a class="dropdown-item" @click="modeselect" name="day">日榜</a>
        								<a class="dropdown-item" @click="modeselect" name="week">周榜</a>
        								<a class="dropdown-item" @click="modeselect" name="month">月榜</a>
        								<a class="dropdown-item" @click="modeselect" name="day_male">男榜</a>
        								<a class="dropdown-item" @click="modeselect" name="day_female">女榜</a>
        								<a class="dropdown-item" @click="modeselect" name="week_original">原创作品</a>
        								<a class="dropdown-item" @click="modeselect" name="week_rookie">新人榜</a>
        								<a class="dropdown-item" @click="modeselect" name="day_manga">漫画日榜</a>
        							</base-dropdown>
        						</base-input>
        						
        					</div>
        				</div>
        			</div>
        	</div>
        	<div class="row">
        		<Waterfall ref="waterfall" imageType="medium" :images="rankimg" :cardWidth="cardWidth"/>
        	</div>
        	<infinite-loading :identifier="waterfallIdentifier" @infinite="infiniteHandler" spinner="spiral" ref="infiniteLoading">
        	</infinite-loading>
        </div>
    </div>
</template>
<script>
Date.prototype.format = function(fmt)
	{ 
		var o = {
			"M+" : this.getMonth()+1,
			"d+" : this.getDate(),
			"h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12,
			"H+" : this.getHours(),
			"m+" : this.getMinutes(),
			"s+" : this.getSeconds(),
			"q+" : Math.floor((this.getMonth()+3)/3),
			"S" : this.getMilliseconds()
		};
		if(/(y+)/.test(fmt))
			fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
		for(var k in o)
			if(new RegExp("("+ k +")").test(fmt))
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
		return fmt;
	} 
import Waterfall from './components/Waterfall';
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import CONFIG from '@/config.json'
import UDownload from './components/UDownload';
export default {
	    components: {
			Waterfall,
			flatPicker,
			UDownload
	    },
	    data() {
	      return {
			rankimg:[],
			waterfallIdentifier: Math.round(Math.random() * 100),
			dates: new Date((new Date())-86400000).format("yyyy-MM-dd"),
			cardWidth: 265,
			page: 0,
			dateconfig:{
				allowInput: true,
				enable: [
					{
						from: "2007-09-10",
						to: new Date((new Date())-86400000).format("yyyy-MM-dd")
					},
				]
			},
			mode: "day",
			modedesc: "日榜",
	      };
	    },
		watch:{
			"dates":"handleChanged",
			"mode":"handleChanged"
		},
	    methods: {
			infiniteHandler($state) {
				this.axios
					.get(CONFIG.API_HOST, {
						params: {
							type: "rank",
							page: this.page,
							mode: this.mode,
							date: this.dates
							}
						})
					.then((response, state) => {
						if (!response.data.illusts || response.data.illusts.length==0) {
							$state.complete();
							return;
						}
						this.rankimg = this.rankimg.concat(response.data.illusts)
						this.page = this.page + 1;
						$state.loaded();
					}).catch(err => {
						$state.complete();
						console.error(err.response.status);
					});
			},
			modeselect(e){
				this.mode = (e.target.name)
				this.modedesc = (e.target.innerText)
			},
			handleChanged(s) {
				this.refreshWaterfall();
			},
			refreshWaterfall() {
				this.$refs.waterfall.$el.innerHTML = '';
				this.$nextTick(() => {
					this.page = 0;
					this.rankimg = [];
					this.waterfallIdentifier = this.waterfallIdentifier + 1;
				});
			},
	    },
		computed:{
		},
	    mounted() {
			
	    }
	};
</script>
<style>
</style>
