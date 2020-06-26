<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar,'hide':hide}">
	<span class="navbar-act" @click="changehide()"><svg viewBox="0 0 18 18"><path d="M2 13.5h14V12H2v1.5zm0-4h14V8H2v1.5zM2 4v1.5h14V4H2z"></path></svg></span>
    <side-bar
      :background-color="sidebarBackground"
      short-title="Pixivel"
      title="Pixivel"
    >
      <template slot="links">
        <sidebar-item
          :link="{
            name: '首页',
            icon: 'ni ni-tv-2 text-primary',
            path: '/'
          }"
        />

        <sidebar-item :link="{name: '搜索', icon: 'ni ni-planet text-blue', path: '/search'}"/>
        <sidebar-item :link="{name: '排行榜', icon: 'ni ni-bullet-list-67 text-red', path: '/rank'}"/>
        <sidebar-item :link="{name: '用户', icon: 'ni ni-single-02 text-yellow', path: '/user'}"/>
        <sidebar-item :link="{name: '作品详情', icon: 'ni ni-pin-3 text-orange', path: '/detail'}"/>
		
		
      </template>
    </side-bar>
    <div class="main-content" :data="sidebarBackground">
      <dashboard-navbar></dashboard-navbar>

      <div @click="toggleSidebar" class="heightfull">
        <fade-transition :duration="200" origin="center top" mode="out-in">
          <!-- your content here -->
		  <router-view class="heightfull"></router-view>
		  
        </fade-transition>
        <content-footer v-if="!$route.meta.hideFooter"></content-footer>
      </div>
    </div>
  </div>
</template>
<script>
  import DashboardNavbar from './DashboardNavbar.vue';
  import ContentFooter from './ContentFooter.vue';
  import { FadeTransition } from 'vue2-transitions';
import storage from 'good-storage'
  export default {
    components: {
      DashboardNavbar,
      ContentFooter,
      FadeTransition
    },
    data() {
      return {
        sidebarBackground: 'vue' ,//vue|blue|orange|green|red|primary
		hide:storage.get("hide")==true?true:false
      };
    },
    methods: {
		changehide(){
			setTimeout(() => {
				this.$redrawVueMasonry()
			},460)
			this.hide = !this.hide
			storage.set("hide",this.hide)
			
		},
      toggleSidebar() {
        if (this.$sidebar.showSidebar) {
          this.$sidebar.displaySidebar(false);
        }
      }
    }
  };
</script>
<style lang="scss">
</style>
