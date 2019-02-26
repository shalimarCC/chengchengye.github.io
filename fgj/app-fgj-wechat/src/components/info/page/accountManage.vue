<template>
    <div class="account">
        <div class="head">
            <ul>
              <li>
                <div style="float:left;position:absolute;line-height:30px;" @click="routerBack">
                  <i class="iconfont icon-fanhui"></i>
                </div>
              </li>
              <li>
                <span class="title">账号管理</span>
              </li>
              <li @click="">
                <div class="release" @click="unbind">{{text1}}</div>
              </li>
            </ul>
        </div>
        <div class="content">
            <ul>
              <li class="accountList" v-for="(item,itemKey) in accountList" v-show="!showUnbind" @click="switchoverLogin(item.id,key,itemKey,item.status)">
                <img v-if="item.headPicUrl!=null" :src="item.headPicUrl" />
                <img v-else src="../../../../static/assets/img/my/head_error.png" />
                <div>
                  <p>{{item.mail}}</p>
                  <p>{{item.name}}</p>
                  <p>{{item.companyName}}</p>
                </div>
                <!--阻止冒泡-->
                <b @click.stop>
                  <span class="notActive" v-if="!item.status" @click="register(item.mail)">未激活</span>
                </b>
                <i class="iconfont current" v-if="item.status&&(key==itemKey)"></i>
              </li>
              <li class="accountList" v-for="(item,itemKey) in accountList" v-show="showUnbind">
                <img v-if="item.headPicUrl!=null" :src="item.headPicUrl" />
                <img v-else src="../../../../static/assets/img/my/head_error.png" />
                <div>
                  <p>{{item.mail}}</p>
                  <p>{{item.name}}</p>
                  <p>{{item.companyName}}</p>
                </div>
                <span class="notActive" v-if="item.status&&(key==itemKey)">当前登录账号</span>
                <template >
                  <input type="checkbox" class="mint-checkbox-input" v-model="item.check">
                  <i v-if="key!=itemKey" :class="{'icon-round':!item.check,'icon-roundcheckfill':item.check}" class="iconfont" @click="chooseCheck(itemKey)"></i>
                </template>
              </li>
              <li class="mention">
                {{text2}}
              </li>
            </ul>
          <div class="logout" @click="cancel" v-if="!showUnbind">
            <span>退出登录</span>
          </div>
          <div class="logout" @click="unbindAccount" v-else>
            <span>确认解绑</span>
          </div>
        </div>

    </div>
</template>

<script>
    import { Toast } from 'mint-ui';
    import { MessageBox } from 'mint-ui';
    import { Indicator } from 'mint-ui';
    import {userByMobile,unbindByUserIds,weixinLogOut,switchoverLogin} from '../../../api/getData';
    export default {
        name: "accountManage",
        data(){
            return{
                accountList:[],
                showUnbind:false,
                text1:'解绑',
                text2:'绑定了相同手机号的账号支持切换登录',
                accountId:'',
                currentId:'',
                key:'',
            }
        },
        created(){

            //获取当前用户的用户id
            this.currentId = this.$store.state.Cookie.mutations.fetch('userInfo').id;
            this.userByMobile();
        },
        watch : {
        },
        methods:{
            //去激活
            register(mail){
                MessageBox({
                  message: '账号未注册，确定现在去注册?',
                  showCancelButton: true,
                  confirmButtonText: '确定',
                  cancelButtonText: '暂不注册',
                }).then(action => {
                  if(action=='confirm'){
                    this.$router.push('/register/'+mail)
                  }else{

                  }
                });
            },
            // 切换账户
            async switchoverLogin(id,key,itemKey,status){
                try {
                  // Indicator.open();
                  if(status&&(key==itemKey)){
                    return
                  }
                  const res = await switchoverLogin({userId:id});
                  if (res.data.code == 0) {
                    let thtf = this;
                    this.$store.state.Cookie.mutations.save(res.data.data,'userInfo');
                    window.setTimeout(function(){
                      Toast('切换中...');
                      window.location.reload()
                      // thtf.$router.push('/set/account');
                    },100);
                    Indicator.close();
                  }else{
                    Toast('登录信息有误');
                    Indicator.close();
                  }

                } catch (err) {
                  Toast('网络错误');
                  Indicator.close();
                }
            },
            //查询用户关联账号列表
            async userByMobile(){
                try {
                    const res = await userByMobile();
                    if (res.data.code == 0) {
                        this.accountList = res.data.data;
                        var _this = this;
                        $.each(this.accountList,function (key,info) {
                            if(_this.currentId == info.id){
                                _this.key = key;
                            }

                        })
                    }
                } catch (err) {
                    Toast(err);
                }
            },
            routerBack(){
                this.$router.go(-1);
            },
            unbind(){
                this.showUnbind = !this.showUnbind;
                this.text1 = this.showUnbind ? '取消':'解绑';
                this.text2 = !this.showUnbind ? '绑定了相同手机号的账号支持切换登录':'解绑的账号将与当前账号失去关联'
            },
            //解绑
            cancel(){
                MessageBox({
                    title: '提示',
                    message: '确定退出当前账号？',
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(action => {
                    if(action=='confirm'){
                        this.weixinLogOut();
                    }else{

                    }
                });
            },
            //退出登录
            async weixinLogOut() {
                try {
                    const res = await weixinLogOut();
                    if (res.data.code == 0) {
                        this.$store.state.Cookie.mutations.delete('userInfo');
                        this.$router.push('/');
                    } else {
                        Toast(res.data.data);
                    }
                } catch (err) {
                    Toast(err);
                }
            },
            // 解绑
            async unbindAccount(){
                try {
                    if(this.accountList.length == 1){
                        Toast('当前账号不能解绑');
                        return
                    }
                    var arr = new Array();
                    $.each(this.accountList,function(key,info){
                        if(info.check == true){
                            arr.push(info.id);
                        }
                    });
                    var obj = new Object();
                    obj.id = JSON.stringify(arr).replace(/^\[|\]$/g,'');//去除str 前后的[];奇葩的操作
                    const res = await unbindByUserIds({userIds:obj.id});
                    if (res.data.code == 0) {
                        Toast('解绑成功')
                        this.userByMobile();
                    } else {
                        Toast(res.data.data);
                    }

                } catch (err) {
                    Toast(err);
                }
            },
            //选择解绑的用户
            chooseCheck(key){
                this.accountList[key].check = !this.accountList[key].check;
                this.$set(this.accountList, key, this.accountList[key]);
            }
        },

    }
</script>

<style lang="scss" scoped>
  @import "../../../style/info/account.scss";
</style>
