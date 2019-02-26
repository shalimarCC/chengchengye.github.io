<template>
    <div class="index page-loadmore-wrapper">
        <div class="main_top">
            <h5>员工体检</h5>
            <div class="main_top_img">

            </div>
            <!--
            <div class="pe_list">
                <div class="pe_list_title cell">
                    <span>体检套餐</span>
                    <router-link to="/insurance/peList">
                        <b>全部<i class="iconfont icon-more"></i></b>
                    </router-link>
                </div>
                <div class="pe_list_list">
                    <ul>
                        <li v-for="i in 5">
                            <img src="../../../../static/assets/img/insurance/main_list.png" />
                            <p>爱康国宾 珍爱父母中老年体检套餐22222222222</p>
                            <div class="pe_price">
                                <span>799.00</span>
                                <del>4999.00</del>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            -->
        </div>

        <div class="main_bottom">
            <div class="insurance_title cell">
                <span>体检套餐</span>

            </div>
            <mt-loadmore :bottom-method="loadBottom" ref="loadmore" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" :auto-fill="false">
                <div class="insurance_list">
                    <ul>
                        <li v-for="item in list">
                            <router-link :to="'/insurance/about/'+item.standardUnitId">
                                <img v-lazy="item.pictureUrl+'?imageMogr2/size-limit/300k!'" />
                                <p>{{item.name}}</p>
                                <div class="pe_price">
                                    <span>{{item.salePrice}}积分</span>
                                    <b>{{item.marketPrice}}</b>
                                </div>
                            </router-link>
                        </li>
                    </ul>
                </div>
                    <div slot="bottom" class="mint-loadmore-bottom">
                    <span v-show="bottomStatus !== 'loading'" :class="{ 'is-rotate': bottomStatus === 'drop' }">↓</span>
                    <span v-show="bottomStatus === 'loading'"><mt-spinner type="snake"></mt-spinner></span>
                </div>
                <div class="goods_bottom">
                    <span v-show="!allLoaded">上拉加载更多～</span>
                    <span v-show="allLoaded">没有更多了～</span>
                </div>
            </mt-loadmore>
        </div>

    </div>
</template>

<script>
import {standardUnitByFunctionModuleId} from '../../../api/getData';
import { Toast } from 'mint-ui';
    var myScroll=null;
    export default{

        data(){
            return {
                list:[],
                allLoaded : false,
                bottomStatus:'',
                content:'',
                pages:1,
                loadType:true,
            }
        },
        components: {

        },
        mounted() {
            this.standardUnitByFunctionModuleId();
        },
        methods:{
            loadBottom() {
                this.standardUnitByFunctionModuleId();
                //this.$refs.loadmore.onTopLoaded();
            },

            handleBottomChange(status) {
                this.bottomStatus = status;
                if(this.pages == 1 && status == "loading"){
                    $(".mint-loadmore-content").scrollTop("50px");
                }
            },
            async standardUnitByFunctionModuleId() {
                try {
                    const res = await standardUnitByFunctionModuleId({pageNo:this.pages,pageSize:10});

                    if (res.data.code == 0) {
                        this.pages++;
                        this.loadType = true;
                        this.list = this.list.concat(res.data.data.list);
                        if(this.list.length == 0){
                            this.loadType = false;
                        }
                        if(res.data.data.totalPage<=this.pages){
                            this.allLoaded = true
                        }
                    } else {
                        this.loadType = true;
                        this.allLoaded = true;
                    }
                    this.onBottomLoaded();
                } catch (err) {
                     Toast('网络错误');
                     this.loadType = false;
                }
            },
            // 复写原方法
            onBottomLoaded() {
                var $loadmore = this.$refs.loadmore;
                $loadmore.bottomStatus = 'pull';
                $loadmore.bottomDropped = false;
                this.$nextTick(() => {
                    $loadmore.translate = 0;
                })
                if (!$loadmore.bottomAllLoaded && !$loadmore.containerFilled) {
                    $loadmore.fillContainer();
                }
            },

		}
    }
</script>

<style lang="scss" scoped>
@import "../../../style/insurance/index.scss";
</style>
