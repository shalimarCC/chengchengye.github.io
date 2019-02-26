<template>
    <div class="login-wrap">

        <div class="ms-title">后台管理系统</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm" v-if="loginType==1">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-select v-model="platformId" placeholder="所属平台" style="width:300px;">
                        <el-option
                            :key="7"
                            label="福管加"
                            :value="7">
                        </el-option>
                        <el-option
                            :key="2"
                            label="慢有优"
                            :value="2">
                        </el-option>
                    </el-select>
                </el-form-item>
                <div class="login-btn">
                    <el-button size="medium" type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
                <p style="font-size:12px;line-height:30px;color:#fff;text-align:right"><span @click="register" style="cursor: pointer;">去注册</span></p>
            </el-form>

            <el-form :model="registerForm" label-width="0px" class="demo-ruleForm" v-else-if="loginType==2">
                <el-form-item>
                    <el-input v-model="registerForm.mail" placeholder="请输入邮箱"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-input placeholder="请输入验证码" v-model="registerForm.code">
                        <template slot="append"><el-button @click="sendMsg" type="primary" :disabled="isDisabled">{{buttonName}}</el-button>
                            </el-table></template>
                    </el-input>
                </el-form-item>

                <el-form-item>
                    <el-input type="password" placeholder="设置你的登录密码" v-model="registerForm.password"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-input type="password" placeholder="请再次输入密码" v-model="registerForm.repassword"></el-input>
                </el-form-item>

                <div class="login-btn">
                    <el-button size="medium" type="primary" @click="registerForAdmin">注册</el-button>
                </div>
                <p style="font-size:12px;line-height:30px;color:#fff;text-align:right"><span @click="login" style="cursor: pointer;">去登录</span></p>
            </el-form>
        </div>
    </div>
</template>

<script>
import { login, getAdminInfo,gainVerificationode,registerForAdmin} from '../../api/getData';
import { Loading } from 'element-ui';
import CryptoJS from 'crypto-js/core';
import MD5 from 'crypto-js/md5';
export default {

    data: function () {
        return {
            ruleForm: {
                username: '',
                password: ''
            },
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ]
            },
            registerForm:{
                mail:'',
                code:'',
                password:'',
                repassword:''
            },
            loginType:1,
            buttonName: "发送验证码",
            isDisabled: false,
            time: 60,
            platformId:''
        }
    },
    mounted(){

        if(this.$store.state.Cookie.mutations.fetch().length !== 0){

             this.getAdmin()
        }
    },
    methods: {
        login(){
            this.loginType = 1;
        },
        register(){
            this.loginType = 2;
        },
        sendMsg() {
            if(this.registerForm.mail == ''){
                this.$message({
                    type: 'error',
                    message: '请输入邮箱'
                });
                return;
            }else if(!(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(this.registerForm.mail))){
                this.$message({
                    type: 'error',
                    message: '请输入正确的邮箱'
                });
                return;
            }else if(!this.isDisabled){

                this.isDisabled = true;
                this.gainVerificationode();
            }



        },
        //获取验证码
        async gainVerificationode () {
            try {
                const res = await gainVerificationode({mail:this.registerForm.mail,type:3})
                if(res.data.code==0){
                    let me = this;
                    let interval = window.setInterval(function() {
                        me.buttonName = '已发送 ' + me.time + '秒';
                        --me.time;
                        if(me.time < 0) {
                            me.buttonName = "重新发送";
                            me.time = 60;
                            me.isDisabled = false;
                            window.clearInterval(interval);
                        }
                    }, 1000);
                    this.$message({
                        type: 'success',
                        message: res.data.data
                    });
                }else{
                    this.isDisabled = false;
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {

                this.$message({
                    type: 'error',
                    message: '登录失败,请联系管理员！404'
                });
            }
        },

        //注册
        async registerForAdmin(){
            try {
                const res = await registerForAdmin(this.registerForm)
                if(res.data.code==0){
                    this.$store.state.Cookie.mutations.save(res.data.data);
                    this.$router.push('readme')
                }else{
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {

                this.$message({
                    type: 'error',
                    message: '登录失败,请联系管理员！404'
                });
            }
        },
        async getAdmin () {
           const res = await getAdminInfo()

           if(res.data.code==0){
               this.$router.push('readme')
           }else{
               this.$message({
                    type: 'error',
                    message: res.data.error
                });
           }
        },
        async submitForm(formName) {

            try {
                const res = await login({ name: this.ruleForm.username, password: `${CryptoJS.MD5(this.ruleForm.password)}`, platformId: this.platformId });
                if (res.data.code == 0) {
                    this.$store.state.Cookie.mutations.save(res.data.data);
                    this.$router.push('readme')
                }else if(res.data.code == 103){
                    this.$message({
                        type: 'error',
                        message: "请您选择所属平台"
                    });
                }else{
                    this.$message({
                        type: 'error',
                        message: res.data.error
                    });
                }
            } catch (err) {

                this.$message({
                    type: 'error',
                    message: '登录失败,请联系管理员！404'
                });
            }
        }
    }
}
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background:url(../../assets/bg1.jpg) no-repeat;
    background-size:cover;
}

.ms-title {
    position: absolute;
    top: 50%;
    width: 100%;
    margin-top: -230px;
    text-align: center;
    font-size: 30px;
    color: #fff;

}

.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 300px;
    min-height: 160px;
    margin: -150px 0 0 -190px;
    padding: 40px;
    border-radius: 5px;
    background:rgba(0,0,0,0.6);
}

.login-btn {
    text-align: center;
}

.login-btn button {
    width: 100%;
    height: 36px;
}
</style>