import { baseUrl } from './env'
import Vue from 'vue';
import Cookie from './mUtils'
import axios from 'axios';
import router from '../router';
import CryptoJS from 'crypto-js/core';
import MD5 from 'crypto-js/md5';
import store from '../store';


export default async (url = '', data = {}, type = 'GET', method = 'fetch') => {

    type = type.toUpperCase();
    url = baseUrl + url;
    let obj = store.state.Cookie.mutations.fetch('userInfo');
    // let obj1 = store.state.Cookie.mutations.fetch('platformID');
    axios.interceptors.request.use(
        config => {
            config.headers.platformId = 7;
            config.headers.clientId = `${"2"}`;
            config.headers.companyId = `${"1"}`;
            config.headers.f = `${"2"}`;
            config.headers.phoneModel = `${"1.0.0"}`;
            config.headers.os = `${"1.0.0"}`;
            config.headers.v = `${"1.0.0"}`;
            config.headers.deviceId = `${"0001"}`;
            if (obj.length !== 0) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
                config.headers.ut = store.state.Cookie.mutations.fetch('userInfo').cookieValue;
                config.headers.Authorization = `${CryptoJS.MD5(store.state.Cookie.mutations.fetch('userInfo').cookieValue +  store.state.Cookie.mutations.fetch('userInfo').id).toString()}`;
            }
            if(store.state.Cookie.mutations.fetch('openId').length !== 0){
                config.headers.weiXinOpenId = store.state.Cookie.mutations.fetch('openId');
            }
            return config;
        },
        err => {
            return Promise.reject(err);
        });

    // http response 拦截器
    axios.interceptors.response.use(
        response => {

            switch (response.data.code) {
                case 106:
                    store.state.Cookie.mutations.delete('userInfo');
                    router.push('/login');
                    return response;
                    break;
                    // 返回 401 清除token信息并跳转到登录页面
                default :
                    // if(window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) != 'micromessenger'){
                    //   router.push('/error');
                    // }else{
                      return response;
                    // }
            }
        },
        error => {
            if (error.response) {
                switch (error.response.code) {
                    case 106:
                        // 返回 401 清除token信息并跳转到登录页面
                        console.log(1)
                }
            }
            return Promise.reject(error.response.data)   // 返回接口返回的错误信息
        });
    var jsonObj;
    var qs = require('qs')
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    if (type == 'GET') {

        return axios({
            method: 'GET',
            url: url

        }).then(function (res) {

            jsonObj = res;

        }).catch(function (err) {

            jsonObj = err;
        })
    } else {
        jsonObj = axios.post(url, qs.stringify(data));
    }

    return jsonObj;

}
