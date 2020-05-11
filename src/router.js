import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import DashboardLayout from '@/layout/DashboardLayout'
import AuthLayout from '@/layout/AuthLayout'
Vue.use(Router)

export default new Router({
  linkExactActiveClass: 'active',
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '',
      component: DashboardLayout,
      children: [
        {
          path: '/',
          name: '首页',
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "demo" */ './views/mainPage.vue')
        },
        {
          path: '/search',
          name: '搜索',
          component: () => import(/* webpackChunkName: "demo" */ './views/Search.vue')
        },
        {
          path: '/rank',
          name: '排行榜',
          component: () => import(/* webpackChunkName: "demo" */ './views/Rank.vue')
        },
        {
          path: '/user',
          name: '用户',
          component: () => import(/* webpackChunkName: "demo" */ './views/User.vue')
        },
        {
          path: '/detail',
          name: '作品详情',
          component: () => import(/* webpackChunkName: "demo" */ './views/Detail.vue')
        },
		{
		  path: '/setting',
		  name: '设置',
		  component: () => import(/* webpackChunkName: "demo" */ './views/Settings.vue')
		}
      ]
    }
  ],
  scrollBehavior (to, from, savedPosition) {
	if(savedPosition){
		store.commit("scroll/setTop",savedPosition["y"])
		//window.scrollTo(0, savedPosition["y"]);
	  	//return(savedPosition)
	}else{
		store.commit("scroll/setTop",0)
		return({y: 0})
	}
    }
})
