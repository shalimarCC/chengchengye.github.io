<template>
    <div class="header">
        <!-- <div class="logo">福管加APP管理系统</div> -->
        <div class="logo">{{logoTitle}}</div>
        <div class="user-info">
            <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                    <img class="user-logo" src="../../../static/img/img.jpg">
                    {{username}}
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="loginout">退出</el-dropdown-item>
                    <el-dropdown-item command="alterPassword">修改密码</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>

        <el-dialog title="修改密码" :visible.sync="dialogFormVisible">

            <el-form label-width="120px">
                <el-form-item label="原密码">
                    <el-input v-model="form.originalPassword"></el-input>
                </el-form-item>

                <el-form-item label="新密码">
                    <el-input v-model="form.password"></el-input>
                </el-form-item>

                <el-form-item label="再输一次">
                    <el-input v-model="form.confirmPassword"></el-input>
                </el-form-item>

            </el-form>

            <div slot="footer" class="dialog-footer" :span="24">
                <el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
                <el-button size="medium" type="primary" @click="updateUserPassword">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import { signout,updateUserPassword } from '../../api/getData';
    import CryptoJS from 'crypto-js/core';
    import MD5 from 'crypto-js/md5';
    export default {
        data() {
            return {
                name: 'admin',
                form:{
                    password:'',
                    confirmPassword :'',
                    originalPassword:''
                },
                dialogFormVisible:false,
                platformId:'',
                logoTitle:''
            }
        },
        created() {
            this.platformId=this.$store.state.Cookie.mutations.fetch().platformId;
            if(this.platformId == 2){
                this.logoTitle = "慢有优后台管理系统"
            }else if(this.platformId == 7){
                this.logoTitle = "福管加后台管理系统"
            }
            console.log(this.platformId)
        },
        computed:{
            username(){
                let username = this.$store.state.Cookie.mutations.fetch().name;
                return username ? username : this.name;
            }
        },
        methods:{
            async handleCommand(command) {
                if(command == 'loginout'){
                    const res = await signout()

                    if(res.data.code == 0){
                        this.$message({
	                        type: 'success',
	                        message: '退出成功'
	                    });
                        this.$store.state.Cookie.mutations.delete()
	                    this.$router.push('/');
                    }else{
                        this.$message({
	                        type: 'error',
	                        message: res.data.data
	                    });
                    }


                }else if(command == 'alterPassword'){
                    this.form = {
                        password:'',
                        confirmPassword :'',
                        originalPassword:''
                    };
                    this.dialogFormVisible = true;
                }
            },

            //修改密码
            async updateUserPassword(){
                try {
                    let obj = new Object();
                    obj.password = CryptoJS.MD5(this.form.password).toString();
                    obj.confirmPassword = CryptoJS.MD5(this.form.confirmPassword).toString();
                    obj.originalPassword = CryptoJS.MD5(this.form.originalPassword).toString();
                    const res = await updateUserPassword(obj);

                    if (res.data.code == 0) {
                        this.$message({
                            type: 'success',
                            message: '修改密码成功'
                        });
                        this.command = 'loginout';
                        this.handleCommand();
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.data.error
                        });
                    }
                } catch (err) {
                    this.$message({
                        type: 'error',
                        message: '获取数据失败,请联系管理员！404'
                    });

                }
            },
        }
    }
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 70px;
        font-size: 22px;
        line-height: 70px;
        color: #fff;
    }
    .header .logo{
        float: left;
        width:250px;
        text-align: center;
    }
    .user-info {
        float: right;
        padding-right: 50px;
        font-size: 16px;
        color: #fff;
    }
    .user-info .el-dropdown-link{
        position: relative;
        display: inline-block;
        padding-left: 50px;
        color: #fff;
        cursor: pointer;
        vertical-align: middle;
    }
    .user-info .user-logo{
        position: absolute;
        left:0;
        top:15px;
        width:40px;
        height:40px;
        border-radius: 50%;
    }
    .el-dropdown-menu__item{
        text-align: center;
    }
</style>
