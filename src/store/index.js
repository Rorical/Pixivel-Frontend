import Vue from 'vue'
import Vuex from 'vuex'
import rank from './modules/rank';
import scroll from './modules/scroll';
import detail from './modules/detail';
import mainpage from './modules/mainpage';
import search from './modules/search';
import user from './modules/user';
Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		rank,
		scroll,
		detail,
		mainpage,
		search,
		user
	}
})