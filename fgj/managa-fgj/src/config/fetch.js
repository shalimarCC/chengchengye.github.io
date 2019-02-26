import { baseUrl } from './env'
import Vue from 'vue';
import Cookie from './mUtils'
import axios from 'axios';
import router from '../router';
import CryptoJS from 'crypto-js/core';
import MD5 from 'crypto-js/md5';
export default async (url = '', data = {}, type = 'GET', method = 'fetch') => {
    type = type.toUpperCase();
    url = baseUrl + url;


    //http request 拦截器
    axios.interceptors.request.use(
        config => {
            config.headers.platformId = 7;
            config.headers.clientId = `${"3"}`;
            config.headers.companyId = `${"1"}`;
            config.headers.f = `${"3"}`;
            config.headers.phoneModel = `${"1.0.0"}`;
            config.headers.os = `${"1.0.0"}`;
            config.headers.v = `${"1.0.0"}`;
            config.headers.deviceId = `${"0001"}`;
            if (Cookie.mutations.fetch().length !== 0) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
                config.headers.platformId = Cookie.mutations.fetch().platformId;
                config.headers.ut = `${Cookie.mutations.fetch().cookieValue}`;
                config.headers.clientId = 3;
                config.headers.Authorization = `${CryptoJS.MD5(Cookie.mutations.fetch().cookieValue + Cookie.mutations.fetch().id).toString()}`;

            }

            return config;
        },
        err => {
            return Promise.reject(err);
        });
    // http response 拦截器
    axios.interceptors.response.use(
        response => {
            return response;
        },
        error => {
            if (error.response) {
                switch (error.response.status) {
                    case 106:
                        // 返回 401 清除token信息并跳转到登录页面

                        router.replace({
                            path: 'login'

                        })
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

            return jsonObj = res;

        }).catch(function (err) {

            return jsonObj = err;
        })
    } else {
        return axios.post(url, qs.stringify(data));

        // return axios({
        //     method: 'POST',
        //     url: url,
        //     data: qs.stringify(data)
        // }).then(function (res) {
        //     return jsonObj = res;
        // }).catch(function (err) {
        //     return jsonObj = err;
        // })
    }
}