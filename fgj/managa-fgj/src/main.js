


import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import axios from 'axios';
import Vuex from 'vuex';
import ElementUI from 'element-ui';
import CryptoJS from 'crypto-js/core';
import MD5 from 'crypto-js/md5';

import Icon from './components/icon';
import './icons/index.js';
Vue.component('icon', Icon);

import VueDND from 'awe-dnd';
Vue.use(VueDND);


// import 'element-ui/lib/theme-default/index.css';    // 默认主题
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
//import '../static/css/theme-green/index.css';       // 浅绿色主题
import "babel-polyfill";
Vue.config.productionTip = false;



Vue.use(ElementUI);
Vue.prototype.$ajax = axios;

router.beforeEach((to, from, next) => {

    if(to.path !== "/login"){
        const obj = {
            name:to.name,
            path:to.path
        };

        store.dispatch("editActiveTab",obj.path);

        let arr = new Array();
        $.each(store.state.tabList,function(key,info){
            arr.push(info.path)
        })

        if($.inArray(obj.path, arr) == -1){
            store.dispatch("addleTabList",obj);
        }

    }
    next()
})
new Vue({
    router,
    store,
    axios,

    render: h => h(App)
}).$mount('#app');

