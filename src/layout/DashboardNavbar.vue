<template>
	<base-nav class="navbar-top navbar-dark" id="navbar-main" :show-toggle-button="false" expand>
		<div class="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto">
			<div class="form-group mb-0">
			</div>
		</div>
		<ul class="navbar-nav align-items-center d-none d-md-flex">
			<li class="nav-item">
				<div class="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto">
					<div class="mb-0">
						<base-input placeholder="搜索" class="input-group-alternative" alternative="" v-bind:value="keyword"
						 @keyup.enter.native="search" addon-right-icon="fas fa-search">
						</base-input>
					</div>
				</div>
			</li>
			<li class="nav-item dropdown">
				<base-dropdown class="nav-link pr-0">
					<div class="media align-items-center" slot="title">
						<span class="avatar avatar-sm rounded-circle">
							<img alt="Image placeholder" src="https://q.qlogo.cn/headimg_dl?bs=qq&dst_uin=1617037007&src_uin=q.qlogo.cn&fid=blog&spec=640">
						</span>
						<div class="media-body ml-2 d-none d-lg-block">
							<span class="mb-0 text-sm  font-weight-bold">Rorical</span>
						</div>
					</div>

					<template>
						<div class=" dropdown-header noti-title">
							<h6 class="text-overflow m-0">Welcome!</h6>
						</div>
						<router-link to="/account" class="dropdown-item">
							<i class="ni ni-single-02"></i>
							<span>My profile</span>
						</router-link>
						<router-link to="/account" class="dropdown-item">
							<i class="ni ni-settings-gear-65"></i>
							<span>Settings</span>
						</router-link>
						<router-link to="/account" class="dropdown-item">
							<i class="ni ni-calendar-grid-58"></i>
							<span>Activity</span>
						</router-link>
						<router-link to="/account" class="dropdown-item">
							<i class="ni ni-support-16"></i>
							<span>Support</span>
						</router-link>
						<div class="dropdown-divider"></div>
						<router-link to="/account" class="dropdown-item">
							<i class="ni ni-user-run"></i>
							<span>Logout</span>
						</router-link>
					</template>
				</base-dropdown>
			</li>
		</ul>
	</base-nav>
</template>
<script>
	export default {
		data() {
			return {
				keyword: this.$route.query.keyword ? this.$route.query.keyword : "",
				activeNotifications: false,
				showMenu: false,
			};
		},
		watch: {
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
			search(e) {
				this.$router.push({
					name: '搜索',
					query: {
						keyword: e.target.value
					}
				})
			},
			handleKeywordChanged() {
				this.keyword = this.$route.query.keyword ? this.$route.query.keyword : ""
			}
		},
		computed: {}
	};
</script>
