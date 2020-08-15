/*!

=========================================================
* Vue Argon Dashboard - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import "@/assets/scss/index.scss";
import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import VueAxios from 'vue-axios'
import axios from 'axios';
import VueCookies from 'vue-cookies';
import VueLazyload from 'vue-lazyload'
import {VueMasonryPlugin} from 'vue-masonry'
import ArgonDashboard from './plugins/argon-dashboard'
import InfiniteLoading from 'vue-infinite-loading'
import qs from "qs"
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import * as Sentry from '@sentry/browser';
import { Vue as VueIntegration } from '@sentry/integrations';



Viewer.setDefaults({
	Options: { 'inline': true, 'button': true, 'navbar': true, 'title': true, 'toolbar': true, 'tooltip': true, 'movable': true, 'zoomable': true, 'rotatable': true, 'scalable': true, 'transition': true, 'fullscreen': true, 'keyboard': true, 'url': 'data-source'}
})
Vue.use(Viewer)
Vue.use(VueCookies)
Vue.use(VueAxios, axios)
// Set up lazyload
Vue.use(VueLazyload, {
    // set observer to true
    observer: true,
	attempt: 2
})
Vue.use(VueMasonryPlugin)
Vue.use(InfiniteLoading, {
    slots: {
        noMore: '没有更多图片了...',
		noResults: '空白的呢'
    },
})

Vue.use(ArgonDashboard)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
Sentry.init({
  dsn: 'https://6a64b3b1cb7d422287485c60b261bd19@o434077.ingest.sentry.io/5390459',
  integrations: [new VueIntegration({Vue, attachProps: true})],
});