// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Vuex from 'vuex';
import store from './store';
import router from './router';
import axios from 'axios';
import MintUI from 'mint-ui';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import scroll from 'vue-seamless-scroll'

import 'mint-ui/lib/style.css';
Vue.use(scroll);
Vue.use(MintUI, {
  lazyload: {
    preLoad: 1.3,
    loading: require('../static/assets/img/goods_error.png'),
    error: require('../static/assets/img/goods_error.png'),
    attempt: 1,
    filter: {
      webp(listener, options) {
        // console.log(options)
      },
    },
  },
});
Vue.use(MintUI);


Vue.use(VueAwesomeSwiper, {
  spaceBetween: 20,
  slidesPerView: 1,
  effect : 'coverflow',
  centeredSlides: true,
  speed: 600,
  autoplay: {
    // delay: 3000,
    disableOnInteraction:false
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true
  }
});
router.beforeEach((to, from, next) => {
  // to: Route: 即将要进入的目标 路由对象
  // from: Route: 当前导航正要离开的路由
  // next: Function: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数。
  // A跳转到B，B页面停留在A页面的滚动位置；解决方法：将scrollTop设置为0
  window.scroll(0, 0);
  next();
});
Vue.prototype.$ajax = axios;
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    router,
    axios,
    store,
    render: h => h(App)
}).$mount('#app');
