<template>
    <div class="main">
        <div class="form">
            <div class="cell">
                <span class="mail"></span>
                <input type="text" class="cell_input" placeholder="请输入企业邮箱" v-model="mail">
            </div>

            <div id="yzm">
                <div class="cell">
                    <span class="yzm"></span>
                    <input type="number" class="cell_input" placeholder="请输入验证码" v-model="code">
                </div>

                <div class="yzm_btn" @click="sendIdentifyingCode" v-if="yzmShow">
                    <span>获取验证码</span>
                </div>
                <div class="yzm_btn disabled" v-else>
                    <span>{{count}}秒</span>
                </div>
            </div>
            <div class="cell">
                <span class="psd"></span>
                <input type="password" class="cell_input" placeholder="请输入登录密码" v-model="password">
            </div>

            <div class="cell">
                <span class="psd"></span>
                <input type="password" class="cell_input" placeholder="请再次输入密码" v-model="confirmPassword">
            </div>

            <div class="tip">
                *密码长度不少于6位，至少包含字母、数字两种类型
            </div>
        </div>

        <div class="btn" :class="{disabled:mail==''||code==''||password==''||confirmPassword==''}" @click="userRegister">
            提交
        </div>
    </div>
</template>

<script>
    import CryptoJS from 'crypto-js/core';
    import MD5 from 'crypto-js/md5';
    import {userRegister,gainVerificationode,userByUserId} from '../../../api/getData';
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
                confirmPassword:''
            }
        },
        created () {
            this.mail = this.$route.params.mail==1?'':this.$route.params.mail;
        },
        mounted(){

        },
        watch : {

        },
        components: {

        },
        methods:{
            sendIdentifyingCode(){
                if (!this.timer && /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(this.mail)) {
                    this.count = 60;
                    this.yzmShow = false;
                    this.gainVerificationode();
                }else{
                    Toast('邮箱格式错误');
                }
            },
            async gainVerificationode(){
                try {
                    const res = await gainVerificationode({mail:this.mail,type:1});

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
                    this.yzmShow = true;
                    Toast(err);
                }
            },
            async userRegister(){
                try {
                    if(this.mail==''||this.code==''||this.password==''||this.confirmPassword==''){
                        return;
                    }
                    let obj = new Object();
                    obj.password = CryptoJS.MD5(this.password).toString();
                    obj.confirmPassword = CryptoJS.MD5(this.password).toString();
                    obj.mail = this.mail;
                    obj.verificationCode = this.code;
                    obj.channelName = 'FGJWechat';
                    const res = await userRegister(obj);
                    if (res.data.code == 0) {
                        Toast('注册成功');
                        this.$store.state.Cookie.mutations.save(res.data.data,'userInfo');
                        this.userByUserId();
                    } else {
                        Toast(res.data.error);
                    }
                } catch (err) {
                    Toast(err);
                }
            },
            async userByUserId() {
                try {
                    const res = await userByUserId({weiXinOpenId:this.$store.state.Cookie.mutations.fetch('openId')});

                    if (res.data.code == 0) {
                        if(res.data.data.mobile==null){
                            this.$router.push('/buildPhoneLogin');
                        }else{
                            this.$router.push('/home');
                        }
                    } else {

                    }

                } catch (err) {
                     Toast('网络错误');

                }
            }
        }
    }
</script>

<style lang="scss" scoped>
@import "../../../style/info/buildPhone.scss";
</style>
