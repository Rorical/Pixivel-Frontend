import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import DashboardLayout from '@/layout/DashboardLayout'
Vue.use(Router)

export default new Router({
	linkExactActiveClass: 'active',
	mode: 'history',
	routes: [{
		path: '/',
		redirect: '',
		component: DashboardLayout,
		children: [{
				path: '/',
				name: '首页',
				// route level code-splitting
				// this generates a separate chunk (about.[hash].js) for this route
				// which is lazy-loaded when the route is visited.
				component: () => import( /* webpackChunkName: "demo" */ './views/mainPage.vue'),
				meta: {
					title: 'Pixivel'
				}
			},
			{
				path: '/search',
				name: '搜索',
				component: () => import( /* webpackChunkName: "demo" */ './views/Search.vue'),
				meta: {
					title: 'Search - Pixivel'
				}
			},
			{
				path: '/rank',
				name: '排行榜',
				component: () => import( /* webpackChunkName: "demo" */ './views/Rank.vue'),
				meta: {
					title: 'Rank - Pixivel'
				}
			},
			{
				path: '/user',
				name: '用户',
				component: () => import( /* webpackChunkName: "demo" */ './views/User.vue'),
				meta: {
					title: 'Author - Pixivel'
				}
			},
			{
				path: '/detail',
				name: '作品详情',
				component: () => import( /* webpackChunkName: "demo" */ './views/Detail.vue'),
				meta: {
					title: 'Illust - Pixivel'
				}
			},
			{
				path: '/setting',
				name: '设置',
				component: () => import( /* webpackChunkName: "demo" */ './views/Settings.vue'),
				meta: {
					title: 'Settings - Pixivel'
				}
			},
			{
				path: '/account',
				name: '账号',
				component: () => import( /* webpackChunkName: "demo" */ './views/Account.vue'),
				meta: {
					title: 'Account - Pixivel'
				}
			},
			{
				path: '*',
				component: () => import( /* webpackChunkName: "demo" */ './views/NotFound.vue'),
				meta: {
					title: '404 - Pixivel'
				}
			}
		]
	}],
	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) {
			store.commit("scroll/setTop", savedPosition["y"])
			//window.scrollTo(0, savedPosition["y"]);
			//return(savedPosition)
		} else {
			store.commit("scroll/setTop", 0)
			return ({
				y: 0
			})
		}
	}
})

