<template>
    <div class="main">
        <div class="form">
            <div class="cell">
                <span class="mail"></span>
                <input type="text" class="cell_input" placeholder="请输入邮箱" v-model="mail">
            </div>

            <div id="yzm">
                <div class="cell">
                    <span class="yzm"></span>
                    <input type="number" class="cell_input" placeholder="请输入验证码" v-model="verificationCode">
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

        <div class="btn" :class="{disabled:mail==''||verificationCode==''||password==''||confirmPassword==''}" @click="verifyForm">
            提交
        </div>
    </div>
</template>

<script>
    import CryptoJS from 'crypto-js/core';
    import MD5 from 'crypto-js/md5';
    import {findUserPassword,gainVerificationode,userByUserId} from '../../../api/getData';
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
                verificationCode:'',
                password:'',
                confirmPassword:''
            }
        },
        created () {
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
                    const res = await gainVerificationode({mail:this.mail,type:2});

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
                        Toast(res.data.error);
                    }

                } catch (err) {
                    this.yzmShow = true;
                    Toast(err);
                }
            },
            //表单验证
            verifyForm(){
                var reg = /^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{6,20}$/;
                if(this.mail==''||this.verificationCode==''||this.password==''||this.confirmPassword==''){
                    return;
                }else if(!/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(this.mail)){
                    Toast('邮箱格式错误');
                    return;
                }else if(this.password.match(reg)==null||this.confirmPassword.match(reg)==null){
                    Toast('密码长度不少于6位，至少包含字母、数字两种类型');
                    return;
                }else if(this.password!=this.confirmPassword){
                    Toast('两次密码输入不一致');
                    return;
                }else{
                    this.findUserPassword();
                }
            },
            async findUserPassword(){
                try {

                    let password = CryptoJS.MD5(this.password).toString();
                    let confirmPassword = CryptoJS.MD5(this.confirmPassword).toString();
                    const res = await findUserPassword({mail:this.mail,verificationCode:this.verificationCode,password:password,confirmPassword:confirmPassword});
                    if (res.data.code == 0) {
                        Toast('找回登录密码成功');
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
                        Toast(res.data.error);
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