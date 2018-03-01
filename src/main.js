// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Hello from './components/Hello.vue'
import Sabr from './components/Sabr.vue'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
// import VueLazyload from 'vue-lazyload'

Vue.use(VueRouter)
Vue.use(VueResource)
// Vue.use(VueLazyload)

// Vue.use(VueLazyload, {
//   preLoad: 1.3,
//   error: 'error.gif',
//   loading: 'load1.gif',
//   attempt: 2
// })

Vue.config.productionTip = false

const router = new VueRouter({
	mode: 'history',
	routes: [
		{path: '/', component: Hello },
		{path: '/one', component: Sabr}
	]
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
