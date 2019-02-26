<template>
<div id="standard">
    <div class="standard">
        <div class='clear standard_title'>
            <h4>
                请选择活动
                <span v-if="checkStatus==1">(单选)</span>
                <span v-else-if="checkStatus==2">(多选)</span>
            </h4>
        </div>

        <div class="standardList clear">

            <span class="button sku" v-for="(item,key) in activitytypeList" @click="canSelect($event)" :attr-id="item.id" :attr-key="key">{{item.descp}}</span>



        </div>
    </div>

    <div id="goods_bottom">
        <div id="pay" @click="buy">确认</div>
    </div>
    <div class="close">
        <i class="iconfont icon-close" @click="closeGoodsProperty"></i>
    </div>
</div>
</template>

<script>
    import { MessageBox } from 'mint-ui';
    import { Toast } from 'mint-ui';
    import { Indicator } from 'mint-ui';
    import {} from '../../../api/getData';
    export default{
        props: {
            activityTypeList: {
                type: Array,
                default: function () {
                    return []
                }
            },
            activityRule:{
                type: Number,
                default: function () {
                    return ''
                }
            },
            activityId:{
                type: Number,
                default: function () {
                    return ''
                }
            },
        },
        data(){
            return {
                picRidio:'',
                disabled:true,
                activitytypeList:[],
                checkStatus:1,

            }
        },

        watch:{

        },

        mounted() {
            var thtf = this;
             $('.sku').each(function(key,info){
                 $.each(thtf.$store.state.checkActivity,function(k,i){
                    if($(info).attr("attr-id") == i.id){
                        $(info).addClass('bh-sku-selected');
                    }
                 })

            })
        },
        created(){

             this.activitytypeList = this.activityTypeList;
             this.checkStatus = this.activityRule;
        },
        methods:{
            closeGoodsProperty(){
                this.$emit('closeGoodsProperty');
            },


            canSelect(dom){
                var self = $(dom.currentTarget);
                if(this.checkStatus == 1){
                    self.toggleClass('bh-sku-selected').siblings().removeClass('bh-sku-selected');
                }else{
                    self.toggleClass('bh-sku-selected');
                }
            },

            //立即购买
            buy(){
                var arr = new Array();
                var thtf = this;
                $('.bh-sku-selected').each(function(key,info){
                    let obj = new Object();
                    obj = thtf.activitytypeList[$(info).attr("attr-key")]
                    arr.push(obj);
                })
                this.$emit('updateActivity',arr);

            }

		}
    }
</script>

<style lang="scss" scoped>
    $baseWidth:750px;
    @function px($val) {
        @return $val/$baseWidth*10+rem;
    }
    #standard{
        position:relative;
        overflow: hidden;
        width:100%;
        .close{
            position:absolute;
            top:0;
            right:px(30px);
            i{
                color:#000;
                font-size:px(40px);
            }
        }
    }
    .standard{
        padding:px(20px) px(24px) px(100px) px(24px);
        overflow: auto;
        img{
            display:inline-block;
            width:px(200px);
            height:px(200px);
             float:left;
             margin-right:px(20px);
        }

        .standard_title h4{
            float:left;
            margin-top:px(56px);
            color:#323232;
            font-size:px(32px);
        }
    }

    .disabled{
        opacity:.6;
    }

    .standardList{
        padding:px(28px) 0;
        h5{
            font-size:px(36px);
            color:#000;
        }
        .bh-sku-selected{
            color:#fff;
            background:#ffac2c;
        }
    }

    .button{
        display:inline-block;
        border-radius: 3px;
        padding:0 px(32px);
        line-height:px(60px);
        font-size:px(28px);
        margin:0 px(10px);
        background:#F4f4f4;
        color:#323232;
    }
    .button:disabled{
        opacity:.6;
    }
    .num_btn{
        padding:px(28px) 0;
        border-bottom:px(1px) solid #d4d4d4;
        h5{
            font-size:px(36px);
            color:#000;
        }
        span{
            display:inline-block;
            text-align:center;
            width:px(80px);
            padding:0 px(20px);
            background:#F4f4f4;
            border-radius: 3px;
            line-height:px(60px);
            i{
                display:block;
                font-size:px(24px);
                color:#969696;
            }
        }
        b{
            display: inline-block;
            width:px(40px);
            font-size:px(28px);
            line-height:px(40px);
            text-align:center;
        }
        .disabled{
            opacity:0.6;
        }
    }
    .buy_btn{
        width:100%;
        line-height:px(100px);
        background:#ff8546;
        text-align:center;
        color:#fff;
        font-size:px(32px);

    }
    .buy_btn_box{
        position:fixed;
        bottom:0;
        width:100%;
        background:#fff;
    }
    .buy_btn_disabled{
            opacity:0.6;
    }

    #goods_bottom{
        background:#fff;;
        position:fixed;
        width:100%;
        height:px(90px);
        bottom:0;
        .buy_btn_disabled{
            color:#f99;
        }
        div{
            display: inline-block;
            width:100%;
            float:left;
            font-size:px(30px);
            text-align: center;
            color:#fff;
            line-height: px(90px);
        }
        #join_shopcat{
            background:#ff9300;
        }
        #pay{
            background:#ff8546;
        }
    }
</style>