<template>
    <div class="index page-loadmore-wrapper" v-if="activityShow">
    <!--<div class="index page-loadmore-wrapper">-->
        <div class="banner">
            <img v-lazy="activityData.coverUrl+'?imageMogr2/size-limit/300k!'">
        </div>
        <div class="main">
            <div class="main1">
                <h4>{{activityData.activityName}}</h4>
                <div class="main1_1">
                    <div class="createrName">发起人：{{activityData.createrName}}</div>
                    <div class="memberCount">已报名{{activityData.memberCount}}人</div>
                </div>
            </div>

            <div class="main2 lazy">
                <b class="time"></b>
                <span>{{activityData.startTime}}至{{activityData.endTime}}</span>
            </div>

            <div class="main3 lazy">
                <b class="location"></b>
                <span>{{activityData.location}}</span>
            </div>

            <div class="main4 lazy" @click="peopleActivity">
                <p><b class="people"></b>他们也参与了</p>
                <ul>
                    <li v-for="item in activityData.users">
                        <img v-lazy="item.face+'?imageMogr2/size-limit/100k!'" />
                    </li>
                    <!--<li v-if="activityData.users.length > 0">-->
                    <li>
                        <img src="../../../../static/assets/img/activity/more.png" />
                    </li>
                </ul>
            </div>

            <div class="main5">
                <div class="main5_title"><h4>活动详情</h4></div>

                <div v-html="activityData.detail" class="detail"></div>
            </div>

            <mt-popup
            v-model="popupVisibleSpecification"
            position="bottom" class="mint-popup-4">
                <specification v-if="popupVisibleSpecification" v-on:closeGoodsProperty="closeGoodsProperty" v-on:updateActivity="updateActivity" :activity-type-list="activityData.activityTypeList" :activity-rule="activityData.activityRule" :activity-id="activityData.id"></specification>
            </mt-popup>
        </div>

        <div class="activity_btn">
            <div v-if="activityData.status==0" style="background:#ff8546;" @click="joinActivity">马上报名</div>
            <div v-else-if="activityData.status==1" style="background:#c8c8c8;">已报名</div>
            <div v-else-if="activityData.status==2" style="background:#c8c8c8;">报名已截止</div>
            <div v-else-if="activityData.status==3" style="background:#c8c8c8;">已结束</div>
            <div v-else-if="activityData.status==4" style="background:#c8c8c8;">活动正在筹备中</div>
            <div v-else-if="activityData.status==5" style="background:#c8c8c8;">来晚了~报名人数已满</div>
            <div v-else-if="activityData.status==6" style="background:#c8c8c8;">活动已取消</div>
        </div>

    </div>
</template>

<script>
    import specification from './specification';
    import {activityDetail} from '../../../api/getData';
    import { Toast } from 'mint-ui';
    import { MessageBox } from 'mint-ui';
    import { Indicator } from 'mint-ui';
    var myScroll=null;
    export default{

        data(){
            return {
                activityData:{},
                popupVisibleSpecification:false,
                activityShow:false
            }
        },

		components: {
            'specification':specification
        },
        created() {
           this.findActivityDetail()
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
        methods:{
            //获取活动详情
            async findActivityDetail() {
                try {
                    // Indicator.open();
                    const res = await activityDetail({activityId:this.$route.params.id});
                    if (res.data.code == 0) {
                        // Indicator.close();
                        this.activityData = res.data.data.activityDetail;
                        this.activityShow = true;
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
            peopleActivity(){
                this.$router.push("/peopleActivity/"+this.activityData.id);
            },
            joinActivity(){
                if(this.activityData.activityTypeList.length == 0){
                    this.$router.push("/joinActivity/"+this.activityData.id);
                }else{
                    this.popupVisibleSpecification = true;
                }

            },
            closeGoodsProperty(){
                this.popupVisibleSpecification = false;
            },
            updateActivity(arr){
                if(arr.length != 0){
                    this.$store.dispatch("setCheckActivity",arr);
                    this.$router.push({path: "/joinActivity/"+this.activityData.id});
                }else{
                    Toast('请选择活动类型');
                }
            }
		}
    }
</script>

<style lang="scss">

@import "../../../style/activity/activity.scss";
</style>
