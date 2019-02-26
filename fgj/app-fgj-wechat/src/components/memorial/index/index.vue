<template>
    <div class="index page-loadmore-wrapper">
        <!--<mt-loadmore :top-method="loadTop" @translate-change="translateChange" @top-status-change="handleTopChange" ref="loadmore"> -->

            <div class="birthday main">
                <div class="main_top">
                    <h2>{{targetDate}}</h2>
                    <h5>Happy Birthday!</h5>
                </div>
                <div class="main_people">
                    <ul class="clear">
                        <li v-for="(info,key) in congrList" :key="key" @click="checkMemorial(key)">
                            <div class="head_port">
                                <img v-lazy="info.face+'?imageMogr2/size-limit/100k!'" alt="">
                                <span v-if="info.check"></span>
                            </div>
                            <p>{{info.name}}</p>
                            <p v-if="!info.isSended">{{targetDate}}</p>
                            <p v-else>已祝福</p>
                        </li>

                    </ul>
                </div>

                <div class="main_btn">
                    <div class="button" v-if="!isAllSend" @click="updateMemorial">
                            送上生日祝福
                    </div>
                    <div class="button" v-else>
                            已祝福
                    </div>

                </div>
            </div>



            <div class="wall">
                <div class="wall_scroll" v-if="wallList.length>0">
                    <ul v-infinite-scroll="loadMore"
                    infinite-scroll-disabled="loading"
                    infinite-scroll-distance="10"
                    class="page-loadmore-wrapper">
                        <li v-for="(info,key) in wallList" :key="key"><p><b>{{info.userName}}祝<b v-if="info.receivers.length==congrList.length">寿星</b><b v-else v-for="(receivers,key) in info.receivers">{{receivers.userName}}<b v-if="info.receivers.length>key+1">、</b></b>
                        ：</b>{{info.descr}}</p></li>
                    </ul>
                </div>
                <div v-else class="wall_error">
                    <div>特别的日子期待你的祝福</div>
                </div>
            </div>


        <!--</mt-loadmore>-->
    </div>
</template>

<script>

    var myScroll=null;
    import { Indicator } from 'mint-ui';
    import { Toast } from 'mint-ui';
    import {congrPageHead,congrPageWall} from '../../../api/getData';
    export default{

        data(){
            return {
                congrList:[],
                targetDate:'',
                pageNo:1,
                wallList:[],
                loading:false,
                isAllSend:'',
                topStatus: '',
                translate: 0,
                moveTranslate: 0
            }
        },

		components: {

		},
        mounted() {
            this.findCongrPageHead();

        },

        methods:{
            //获取当天可祝福的人
            async findCongrPageHead() {
                try {
                    Indicator.open();
                    const res = await congrPageHead();
                    if (res.data.code == 0) {
                        Indicator.close();
                        this.isAllSend = res.data.data.isAllSend;
                        this.congrList = res.data.data.birthUserList;
                        $.each(this.congrList,function(key,info){
                            if(info.isSended==0){
                                info.check = true;
                            }else{
                                info.check = false;
                            }
                        })
                        this.targetDate = res.data.data.targetDate;
                        this.findCongrPageWall();
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
             //获取祝福墙
            async findCongrPageWall() {
                try {
                    Indicator.open();
                    const res = await congrPageWall({targetDate:this.targetDate,pageNo:this.pageNo});
                    if (res.data.code == 0) {
                        Indicator.close();


                        if(res.data.data.congrPage.list.length == 0){
                            this.loading = true;
                        }else{
                            this.pageNo++;
                            var thtf = this;
                            $.each(res.data.data.congrPage.list,function(key,info){
                                thtf.wallList.push(info);
                            })
                        }

                        //this.$refs.loadmore.onTopLoaded();
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
            //选择员工
            checkMemorial(key){
                if(this.congrList[key].isSended==0){

                    this.congrList[key].check = !this.congrList[key].check;
                    this.$set(this.congrList, key, this.congrList[key]);
                }
            },
            loadMore(){
                if(this.targetDate == ""){
                    return;
                }else{
                    this.findCongrPageWall();
                }
            },
            //点击祝福按钮
            updateMemorial(){
                var checkArr = new Array();
                $.each(this.congrList,function(key,info){
                    if(info.check){
                        checkArr.push(info.id);
                    }
                })
                if(checkArr.length>0){
                    this.$store.dispatch("setCheckMemorial",checkArr);
                    this.$router.push("/memorial/birthday");
                }else{
                    Toast('请选择祝福对象');
                }
            },
            handleTopChange(status) {
                this.moveTranslate = 1;
                this.topStatus = status;
            },
            translateChange(translate) {
                const translateNum = +translate;
                this.translate = translateNum.toFixed(2);
                this.moveTranslate = (1 + translateNum / 70).toFixed(2);
            },
            loadTop() {
                this.findCongrPageHead();
            },
		}
    }
</script>

<style lang="scss" scoped>
@import "../../../style/memorial/index.scss";
</style>