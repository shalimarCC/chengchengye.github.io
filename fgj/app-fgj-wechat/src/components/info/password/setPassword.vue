<template>
    <div class="main" :style="'height:'+wrapperHeight+'px'">
        <div class="head">
            <ul>
                <li>
                    <div style="float:left;position:absolute;line-height:30px;" @click="routerBack">
                       <i class="iconfont icon-fanhui"></i>
                    </div>
                </li>
                <li>
                    <span class="title">修改登录密码</span>
                </li>
                <li @click="change">
                    <div class="changeMode">{{text}}</div>
                </li>
            </ul>
        </div>
        <div class="content">
        <div class="form" >
            <div class="cell" v-if="!changeMode">
                <span class="mail"></span>
                <p  class="cell_input">{{mail}}</p>
            </div>

            <div class="cell" v-if="changeMode">
              <span class="phone"></span>
              <p  class="cell_input">{{mobile}}</p>
            </div>

            <div id="yzm">
                <div class="cell">
                    <span class="yzm"></span>
                    <input type="number" class="cell_input" placeholder="请输入验证码" v-model="code">
                </div>

                <div class="yzm_btn" @click="sendCode" v-if="yzmShow">
                    <span>获取验证码</span>
                </div>
                <div class="yzm_btn disabled" v-else>
                    <span>{{count}}秒</span>
                </div>
            </div>

            <div class="cell">
                <span class="psd"></span>
                <input type="password" class="cell_input" placeholder="请输入新密码" v-model="password">
            </div>

            <div class="cell">
                <span class="psd"></span>
                <input type="password" class="cell_input" placeholder="请再次输入密码" v-model="confirmPassword">
            </div>

            <div class="tip">
                *密码长度不少于6位，至少包含字母、数字两种类型
            </div>
        </div>

        <div class="btn" :class="{disabled:mail==''||code==''||password==''||confirmPassword==''}" @click="submit">
            提交
        </div>
        </div>
    </div>
</template>

<script>
    import CryptoJS from 'crypto-js/core';
    import MD5 from 'crypto-js/md5';
    import {findUserPassword,gainVerificationode,userByUserId,sendIdentifyingCode,setPasswordByMobile} from '../../../api/getData';
    import { Toast } from 'mint-ui';
    import { MessageBox } from 'mint-ui';
    import { Indicator } from 'mint-ui';
    export default{

        data(){
            return{
                yzmShow:true,
                count:60,
                timer: null,
                mail:'',
                code:'',
                password:'',
                confirmPassword:'',
                mobile:'',
                changeMode:true,
                text:'邮箱验证',
                wrapperHeight:'',
            }
        },
        created () {
            this.userByUserId();
        },
        mounted(){
            this.wrapperHeight = document.documentElement.clientHeight -50;
        },
        watch : {
        },
        components: {

        },
        methods:{
            change(){
                this.changeMode = !this.changeMode;
                this.text = this.changeMode ? '邮箱验证':'手机验证';
            },
            // sendIdentifyingCode(){
            //     if (!this.timer && /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(this.mail)) {
            //         this.count = 60;
            //         this.yzmShow = false;
            //         this.gainVerificationode();
            //     }else{
            //         Toast('邮箱格式错误');
            //     }
            // },
            async userByUserId() {
                try {
                    const res = await userByUserId({weiXinOpenId:this.$store.state.Cookie.mutations.fetch('openId')});

                    if (res.data.code == 0) {
                        this.mail = res.data.data.mail;
                        this.mobile = res.data.data.mobile;
                    } else {
                        Toast(res.data.data);
                    }

                } catch (err) {
                    Toast(err);
                }
            },
            sendCode(){
                if (!this.timer && /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(this.mail)) {
                    this.count = 60;
                    this.yzmShow = false;
                    if(this.changeMode){
                      this.sendIdentifyingCode();
                    }else{
                      this.gainVerificationode();
                    }
                }else{
                  Toast('邮箱格式错误');
                }
            },
            //邮箱发送验证码
            async gainVerificationode(){
                try {
                    const res = await gainVerificationode({mail:this.mail,type:0});

                    if (res.data.code == 0) {
                        Toast(res.data.data);
                        this.timer = setInterval(() => {
                        if (this.count > 0 && this.count <= 60) {
                                this.count--;
                            } else {
                                this.yzmShow = true;
                            clearInterval(this.timer);
                                this.timer = null;
                            }
                        }, 1000)
                    } else {
                        this.yzmShow = true;
                        Toast(res.data.error);
                    }

                } catch (err) {
                    Toast(err);
                }
            },
            //手机发送验证码
            async sendIdentifyingCode(){
                try {
                    const res = await sendIdentifyingCode({mobile:this.mobile,type:3});

                    if (res.data.code == 0) {
                        Toast(res.data.data);
                        this.timer = setInterval(() => {
                            if (this.count > 0 && this.count <= 60) {
                                this.count--;
                            } else {
                                this.yzmShow = true;
                                clearInterval(this.timer);
                                this.timer = null;
                            }
                        }, 1000)
                    } else {
                      this.yzmShow = true;
                        Toast(res.data.error);
                    }

                } catch (err) {
                    Toast(err);
                }
            },
            submit(){
                if(this.changeMode){
                  this.setPasswordByMobile();
                }else{
                  this.findUserPassword();
                }
            },
            //用邮箱修改密码
            async findUserPassword(){
                try {
                    if(this.mail==''||this.code==''||this.password==''||this.confirmPassword==''){
                        return;
                    }
                    let password = CryptoJS.MD5(this.password).toString();
                    let confirmPassword = CryptoJS.MD5(this.confirmPassword).toString();
                    const res = await findUserPassword({mail:this.mail,verificationCode:this.code,password:password,confirmPassword:confirmPassword});
                    if (res.data.code == 0) {
                        Toast('修改登录密码成功');
                      this.$store.state.Cookie.mutations.save(res.data.data,'userInfo');
                      this.$router.push('/set');
                        // this.$router.go(-1);
                    } else {
                        Toast(res.data.error);
                    }

                } catch (err) {
                    Toast(err);
                }
            },
            //用手机修改密码
            async setPasswordByMobile(){
                try {
                    if(this.mail==''||this.code==''||this.password==''||this.confirmPassword==''){
                      return;
                    }
                    let password = CryptoJS.MD5(this.password).toString();
                    let confirmPassword = CryptoJS.MD5(this.confirmPassword).toString();
                    const res = await setPasswordByMobile({mobile:this.mobile,verificationCode:this.code,password:password,confirmPassword:confirmPassword});
                    if (res.data.code == 0) {
                      Toast('修改登录密码成功');
                      this.$store.state.Cookie.mutations.save(res.data.data,'userInfo');
                      this.$router.push('/set');
                      // this.$router.go(-1);
                    } else {
                      Toast(res.data.error);
                    }

                } catch (err) {
                    Toast(err);
                }
            },
            routerBack(){
              this.$router.go(-1);
            },
        }
    }
</script>

<style lang="scss" scoped>
@import "../../../style/info/buildPhone.scss";
</style>
