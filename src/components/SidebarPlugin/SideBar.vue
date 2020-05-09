<template>
    <nav class="navbar navbar-vertical fixed-left navbar-expand-md navbar-light bg-white" id="sidenav-main">
        <div class="container-fluid">

            <!--Toggler-->
            <navbar-toggle-button @click.native="showSidebar">
                <span class="navbar-toggler-icon"></span>
            </navbar-toggle-button>
            <router-link class="navbar-brand" to="/">
                <img :src="logo" class="navbar-brand-img" alt="...">
            </router-link>

            <slot name="mobile-right">
                <ul class="nav align-items-center d-md-none nomargin" style="height: 7vh; margin: 10px auto 0 auto;">
					<li class="nav-item nomargin">
                        <div class="form-inline nomargin">
								<base-input placeholder="搜索"
								            class="input-group-alternative nomargin"
								            alternative=""
											v-bind:value = "keyword"
											@keyup.enter.native="search"
								            addon-right-icon="fas fa-search">
								</base-input>
                        </div>
					</li>
                </ul>
            </slot>
            <slot></slot>
            <div v-show="$sidebar.showSidebar" class="navbar-collapse collapse show" id="sidenav-collapse-main">

                <div class="navbar-collapse-header d-md-none">
                    <div class="row">
                        <div class="col-6 collapse-brand">
                            <router-link to="/">
                                <img :src="logo">
                            </router-link>
                        </div>
                        <div class="col-6 collapse-close">
                            <navbar-toggle-button @click.native="closeSidebar"></navbar-toggle-button>
                        </div>
                    </div>
                </div>

                <ul class="navbar-nav">
                    <slot name="links">
                    </slot>
                </ul>
                <!--Divider-->
                <hr class="my-3">
                <!--Heading-->
                <h6 class="navbar-heading text-muted">其他</h6>
                <!--Navigation-->
                <ul class="navbar-nav mb-md-3">
					<li class="nav-item">
					    <router-link class="nav-link"
					       :to="{name:'设置'}">
					        <i class="ni ni-settings-gear-65"></i> 设置
					    </router-link>
					</li>
					<li class="nav-item">
					    <a class="nav-link"
					       href="https://blog.boxpaper.club/pixivel.aspx" target="_blank">
					        <i class="ni ni-ui-04"></i> 使用说明
					    </a>
					</li>
                    <li class="nav-item">
                        <a class="nav-link"
                           href="https://www.boxpaper.club/" target="_blank">
                            <i class="ni ni-spaceship"></i> 纸盒子
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link"
                           href="https://blog.boxpaper.club/" target="_blank">
                            <i class="ni ni-palette"></i> Rorical的博客
                        </a>
                    </li>
                </ul>
            </div>
            </div>
    </nav>
</template>
<script>
  import NavbarToggleButton from '@/components/NavbarToggleButton'

  export default {
    name: 'sidebar',
    components: {
      NavbarToggleButton
    },
	watch:{
		"$route.query.keyword": "handleKeywordChanged",
	},
	data() {
	  return {
		keyword: this.$route.query.keyword ? this.$route.query.keyword:"",
	  };
	},
    props: {
      logo: {
        type: String,
        default: 'img/brand/green.png',
        description: 'Pixivel'
      },
      autoClose: {
        type: Boolean,
        default: true,
        description: 'Whether sidebar should autoclose on mobile when clicking an item'
      }
    },
    provide() {
      return {
        autoClose: this.autoClose
      };
    },
    methods: {
      closeSidebar() {
        this.$sidebar.displaySidebar(false)
      },
      showSidebar() {
        this.$sidebar.displaySidebar(true)
      },
	  beforeDestroy() {
	    if (this.$sidebar.showSidebar) {
	      this.$sidebar.showSidebar = false;
	    }
	  },
	  search(e){
	  		this.$router.push({name:'搜索',query:{keyword:e.target.value}})
	  },
	  handleKeywordChanged(){
	  		this.keyword =  this.$route.query.keyword ? this.$route.query.keyword:""
	  }
    },
    
  };
</script>
