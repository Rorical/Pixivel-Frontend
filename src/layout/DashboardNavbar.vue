<template>
    <base-nav class="navbar-top navbar-dark"
              id="navbar-main"
              :show-toggle-button="false"
              expand>
        <div class="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto">
            <div class="form-group mb-0">
            </div>
        </div>
        <ul class="navbar-nav align-items-center d-none d-md-flex">
            <li class="nav-item">
                <div class="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto">
                    <div class="mb-0">
                        <base-input placeholder="搜索"
                                    class="input-group-alternative"
                                    alternative=""
                					v-bind:value = "keyword"
                					@keyup.enter.native="search"
                                    addon-right-icon="fas fa-search">
                        </base-input>
                    </div>
                </div>
            </li>
        </ul>
    </base-nav>
</template>
<script>
  export default {
    data() {
      return {
		keyword: this.$route.query.keyword ? this.$route.query.keyword:"",
        activeNotifications: false,
        showMenu: false,
      };
    },
	watch:{
		"$route.query.keyword": "handleKeywordChanged",
	},
    methods: {
      toggleSidebar() {
        this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
      },
      hideSidebar() {
        this.$sidebar.displaySidebar(false);
      },
      toggleMenu() {
        this.showMenu = !this.showMenu;
      },
	  search(e){
		this.$router.push({name:'搜索',query:{keyword:e.target.value}})
	  },
	  handleKeywordChanged(){
		this.keyword =  this.$route.query.keyword ? this.$route.query.keyword:""
	  }
    }
  };
</script>
