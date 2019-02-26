<template>
    <div id="activeBox" v-if="activityShow" v-loading.body="listLoading">
        <div class="banner">
          <img :src= "activityData.coverUrl">
        </div>
        <div class="main">
            <div class="main1">
                <h3>{{activityData.activityName}}</h3>
                <div class="main1_1">
                    <p>发起人：{{activityData.createrName}}</p>
                    <p class="memberCount">已报名{{this.$route.params.peopleCount}}人</p>
                </div>
            </div>

            <div class="main2 lazy">
                <span>{{activityData.startTime}}至{{activityData.endTime}}</span>
            </div>

            <div class="main3 lazy">
                <span>{{activityData.location}}</span>
            </div>

            <div class="main4 lazy">
                <p>他们也参与了</p>
                <ul class="namesIn">
                    <!-- <li v-for="item in activityData.users">
                        <img v-lazy="item.face+'?imageMogr2/size-limit/100k!'" />
                    </li>
                    <li v-if="activityData.users.length > 0">
                       <img src="../../../../static/assets/img/activity/more.png" />
                    </li> -->
                    <li v-for="item in peopleJoin">{{item.name}}</li>
                </ul>
            </div>

            <div class="main5">
                <div class="main5_title"><h4>活动详情</h4></div>
                <div v-html="activityData.detail" class="detail"></div>
            </div>


        </div>

       <!-- <div class="activity_btn">
            <div v-if="activityData.status==0" style="background:#ff8546;" @click="joinActivity">马上报名</div>
            <div v-else-if="activityData.status==1" style="background:#c8c8c8;">已报名</div>
            <div v-else-if="activityData.status==2" style="background:#c8c8c8;">报名已截止</div>
            <div v-else-if="activityData.status==3" style="background:#c8c8c8;">已结束</div>
            <div v-else-if="activityData.status==4" style="background:#c8c8c8;">活动正在筹备中</div>
            <div v-else-if="activityData.status==5" style="background:#c8c8c8;">来晚了~报名人数已满</div>
            <div v-else-if="activityData.status==6" style="background:#c8c8c8;">活动已取消</div>
        </div>-->

    </div>
</template>

<script>
    // var moment = require('moment');
    // moment().format();
    import {activityDetail,activityUserPage} from '../../../api/getData';
    import { Toast } from 'mint-ui';
    import { MessageBox } from 'mint-ui';
    import { Indicator } from 'mint-ui';
    var myScroll=null;
    export default{
        data(){
            return {
                activityData:{},
                activityShow:false,
                listLoading: true,
                peopleJoin:{},
                peopleJoinCount:[]
            }
        },
		// components: {
        //     'specification':specification
        // },
        created() {
           this.findActivityDetail();
           this.findActivityUserPage();
        },
        watch:{
            "$route": {
                handler(curVal,oldVal){
                    let str = curVal.path;
                    str = str.substring(0,13)
                    if(str == "/activeDetail"){
                        this.findActivityDetail();
                        this.findActivityUserPage()
                    }
                }
            }
        },
        methods:{
            //获取活动详情
            async findActivityDetail() {
                try {
                    // Indicator.open();
                    this.listLoading = false;
                    const res = await activityDetail({id:this.$route.params.id});
                    if (res.data.code == 0) {
                        // Indicator.close();
                        this.activityData = res.data.data.act;
                        this.activityShow = true;
                        console.log(this.activityData);
                    } else {
                        // Indicator.close();
                        Toast(res.data.error);
                    }
                } catch (err) {
                     Toast('网络错误');
                     //Toast('呵呵哒');
                     this.cartType = false;
                     Indicator.close();
                }
            },
            async findActivityUserPage() {
            try {
                this.listLoading = false;
                const res = await activityUserPage({id:this.$route.params.id});
                if (res.data.code == 0) {
                    this.peopleJoin = res.data.data.activityUserPage.list;
                    // for(var i=0;i<this.peopleJoin.length;i++){
                    //     this.peopleJoinCount = this.peopleJoin[i];
                    // }
                    console.log(this.peopleJoinCount);
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
 #activeBox{
    width:450px;
    height:auto;
    margin:20px auto;
 }
 .banner img{
    display:block;
    width:100%;
    height:auto;
 }
 .main{
     background-color:#f4f4f4;
 }
 .main1,.main2,.main3,.main4,.main5{
     background-color:#fff;
 }
 .main1 > h3{
     font-size:18px;
     padding:10px 0;
     color:#323232;
 }
 .main1_1{
     overflow:hidden;
     padding-bottom:16px;
 }
 .main1_1 p{
    width:50%;
    float:left;
    font-size:14px;
 }
 .main1_1 p:first-child{
     font-size:14px;
     color:#646464;
 }
 .main1_1 p:nth-child(2){
    color:#FF8546;
    text-align:right;
 }
 .main2,.main3,.main4 > p{
     width:100%;
     height:auto;
     line-height:44px;
     padding-left:28px;
     background-image:url("../../../../static/img/activity/time.png");
     background-repeat:no-repeat;
     background-position:left center;
     background-size:18px 18px;
     border-top:1px solid #ddd;
     font-size:16px;
     box-sizing:border-box;
     margin-bottom:10px;
 }
 .main3{
     background-image:url("../../../../static/img/activity/location.png");
     border-top:0
 }
 .main4{
     overflow:hidden;
 }
 .main4 p,.main4 ul{
     width:50%;
     float:left;
 }
 .main4 ul{
     text-align:right;
     line-height:44px;
     height:44px;
     overflow:hidden;
 }
 .main4 ul li{
     display:inline-block;
     padding-right:6px;
 }
 .main4 > p{
     background-image:url("../../../../static/img/activity/people.png");
     border-top:0
 }
 .main5{
     padding-top:16px;
 }
 .main5 .detail{
     padding-top:15px;
     width:450px;
     overflow:hidden;
 }
 .main5 .detail img{

     display:block;
     width:100% !important;
 }

</style>