// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vant from 'vant'
import 'vant/lib/index.css'
import echarts from 'echarts'
import Vuex from 'vuex'
import store from './store/store'
import axios from 'axios';
import utils from './common/utils.js' 

Vue.prototype.$echarts = echarts
Vue.prototype.$axios=axios;
Vue.prototype.$utils=utils

Vue.config.productionTip = false
Vue.use(Vant);
Vue.use(Vuex);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
