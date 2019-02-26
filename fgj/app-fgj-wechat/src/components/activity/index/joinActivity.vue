<template>
    <div id="add_site">
        <div class="cell" v-if="activityDetail.activityTypeList.length != 0">
            <span class="cell_title">选择活动</span>
            <p @click="selectActivity">
                <span v-if="checkActivity.length == ''" style="color:#969696;">请选择活动</span>
                <span v-else>{{checkActivity[0].descp}}</span>
                <i class="iconfont icon-more"></i>
            </p>
        </div>

        <div class="cell">
            <span class="cell_title">姓名</span>
            <input type="text" class="cell_input" v-model="activityData.name" placeholder="请输入您的姓名">
        </div>

        <div class="cell sex">
            <span class="cell_title">性别</span>
            <p>
               <!-- <span v-if="activityData.sex == ''" style="color:#969696;">请选择您的性别</span>
                <span v-else>{{activityData.sex}}</span>
                <i class="iconfont icon-more"></i>  -->
                <span @click="activityData.sex = '男'" :class="[activityData.sex=='男'?'man_check':'man']"><i></i>男</span>
                <span @click="activityData.sex = '女'" :class="[activityData.sex=='女'?'woman_check':'woman']"><i></i>女</span>
            </p>
        </div>

        <div class="cell">
            <span class="cell_title">手机号码</span>
            <input type="text" class="cell_input" v-model="activityData.mobile" placeholder="请输入您的联系方式">
        </div>

        <mt-popup
        v-model="popupVisible"
        position="bottom" class="mint-popup-4">
            <div id="propertyTable">
                <h4>选择性别</h4>
                <ul>
                    <li @click="activityData.sex = '男'">
                        <span>男</span>
                        <i :class="[activityData.sex!='男' ? 'icon-round':'icon-roundcheckfill']" class="iconfont"></i>
                    </li>
                    <li @click="activityData.sex = '女'">
                        <span>女</span>
                        <i :class="[activityData.sex!='女' ? 'icon-round':'icon-roundcheckfill']" class="iconfont"></i>
                    </li>
                </ul>
                <div class="close_btn" @click="closePopupVisible1">
                    确定
                </div>
            </div>
        </mt-popup>

        <mt-popup
        v-model="popupVisibleSpecification"
        position="bottom" class="mint-popup-4">
            <specification v-if="popupVisibleSpecification" v-on:closeGoodsProperty="closeGoodsProperty" v-on:updateActivity="updateActivity" :activity-type-list="activityDetail.activityTypeList" :activity-rule="activityDetail.activityRule" :activity-id="activityDetail.id"></specification>
        </mt-popup>

        <div class="site_btn" @click="signActivity">
            <span>确认报名</span>
        </div>
    </div>
</template>

<script>
    import specification from './specification';
    import {signActivity,activityDetail} from '../../../api/getData';
    import { Toast } from 'mint-ui';
    import { MessageBox } from 'mint-ui';
    import { Indicator } from 'mint-ui';
    export default{

        data(){
            return {
                popupVisible:false,
                activityData:{
                    name:'',
                    mobile:'',
                    sex:'',
                    activityId:'',

                },

                checkActivity:[],
                popupVisibleSpecification:false,
                activityDetail:{}
            }
        },
		components: {
            'specification':specification
        },
        watch:{
            popupVisibleSpecification:{
                handler(curVal,oldVal){
                    if(curVal){
                        $(".page-loadmore-wrapper").css("overflow","hidden");
                    }else{
                        $(".page-loadmore-wrapper").css("overflow","auto");
                    }
                }
            },
        },
        created(){
            this.findActivityDetail()
            this.checkActivity = this.$store.state.checkActivity;
        },
        methods:{
            //获取活动详情
            async findActivityDetail() {
                try {
                    const res = await activityDetail({activityId:this.$route.params.id});
                    if (res.data.code == 0) {
                        this.activityDetail = res.data.data.activityDetail;
                    } else {
                        Toast(res.data.error);
                    }
                } catch (err) {
                     Toast('网络错误');
                }
            },
            async signActivity() {
                try {
                    Indicator.open();
                    let obj = JSON.parse(JSON.stringify(this.activityData));
                    obj.activityId = this.$route.params.id;
                    var arr = new Array();
                    $.each(this.checkActivity,function(key,info){
                        arr.push(info.id);
                    })
                    obj.activityTypeIdList = JSON.stringify(arr);
                    const res = await signActivity(obj);
                    if (res.data.code == 0) {
                        Indicator.close();
                        Toast("报名成功");
                        this.$router.go(-1);
                    }else if (res.data.code == -2) {
                        Indicator.close();
                        Toast(res.data.error);
                        this.$router.go(-1);
                    } else {
                        Indicator.close();
                        Toast(res.data.error);
                    }
                } catch (err) {
                     Toast('网络错误');
                     this.cartType = false;
                     Indicator.close();
                }
            },
            closePopupVisible1(){
                this.popupVisible = false;
            },
            closeGoodsProperty(){
                this.popupVisibleSpecification = false;
            },
            //选择活动
            selectActivity(){
                this.popupVisibleSpecification = true;
            },
            updateActivity(arr){
                if(arr.length != 0){
                    this.$store.dispatch("setCheckActivity",arr);
                    this.checkActivity = arr;
                    this.popupVisibleSpecification = false;
                }else{
                    Toast('请选择活动类型');
                }
            }
        }
    }
</script>

<style lang="scss" scoped>

@import "../../../style/activity/joinActivity.scss";
</style>