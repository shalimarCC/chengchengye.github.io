<template>
    <div class="imgtext" :style="'padding-top:'+elementObj.instMargin/750*10+'rem'" v-if="show">
        <div class="title" v-if="elementObj.configType == 301||elementObj.configType == 303">
            <h3><b></b>{{imgtextObj.groupTitle}}<b></b></h3>
        </div>

        <div class="imgtext1" v-if="elementObj.configType == 300||elementObj.configType == 301">
            <img :src="imgtextObj.imagetextList[0].imagetextUrl" alt="" @click="linkSkip(imgtextObj.imagetextList[0])">
        </div>

        <div class="imgtext2" v-if="elementObj.configType == 302||elementObj.configType == 303">
            <div class="imgtext2_l">
                <img :src="imgtextObj.imagetextList[0].imagetextUrl" alt="" @click="linkSkip(imgtextObj.imagetextList[0])">
            </div>
            <div class="imgtext2_r">
                <img :src="imgtextObj.imagetextList[1].imagetextUrl" alt="" @click="linkSkip(imgtextObj.imagetextList[1])">
                <img :src="imgtextObj.imagetextList[2].imagetextUrl" alt="" @click="linkSkip(imgtextObj.imagetextList[2])">
            </div>
        </div>
    </div>

</template>

<script>
  import { Toast } from 'mint-ui';
  import {instContent} from '../../../api/getData';
  export default{
        props: {
            elementObj: {
                type: Object,
                default: function () {
                    return {}
                }
            },
        },
        data(){
            return {
                imgtextObj:{},
                show:false
            }
        },
        mounted() {
            // this.instContent();
          this.imgtextObj =  this.elementObj.inst.imagetext;
          this.show = true;
        },
        methods:{
            async instContent() {
                try {
                    const res = await instContent({elementId:this.elementObj.elementId,instId:this.elementObj.instId});

                    if (res.data.code == 0) {
                        this.imgtextObj = res.data.data.inst.imagetext;
                        this.show = true;
                    } else {

                    }

                } catch (err) {
                     Toast('网络错误');

                }
            },
            linkSkip(obj){
                this.$emit('linkSkip',[obj]);
            }
		}
    }
</script>

<style lang="scss" scoped>
    $baseWidth:750px;
    @function px($val) {
        @return $val/$baseWidth*10+rem;
    }
    .imgtext{
        background:#f4f4f4;
        ul{
            background:#Fff;
            padding:0 px(20px);
            display: flex;
            display: -webkit-flex; /* Safari */
            flex-wrap:wrap;
            li{
                margin:px(18px) px(28px);
                width:px(120px);
                text-align:center;
                img{
                   width:px(120px);
                   height:px(120px);
                   border-radius:5px;
                }
                p{
                    font-size:px(26px);
                    color:#323232;
                }
            }
        }
    }
    .title{
        width:100%;
        height:px(88px);
        background:#Fff;
        position:relative;
        display: flex;
        justify-content:center;
        align-items:center;
        h3{
            width:100%;
            text-align:center;
            font-size:px(28px);
            font-weight:100;
            color:#323232;
            display: inline-flex;
            justify-content:center;
            align-items:center;
            b{
                margin:0 px(40px);
                border-top:px(4px) solid #ff8546;
                width:px(60px);
            }
        }
        span{
            position:absolute;
            right:px(24px);
            top:px(0px);
            line-height:px(88px);
            font-size:px(28px);
            font-weight:100;
            color:#b3b3b3;
            i{
                font-size:px(28px);
                font-weight:100;
                color:#b3b3b3;
            }
        }

    }

    .imgtext1{
        width:100%;
        height:px(280px);
        img{
            width:100%;
            height:100%;
        }
    }

    .imgtext2{
        width:100%;
        height:px(500px);
        display: flex;
        display: -webkit-flex; /* Safari */
        justify-content:space-between;

        .imgtext2_l{
            height:px(500px);
            width:px(366px);
            img{
                width:100%;
                height:100%;
            }
        }
        .imgtext2_r{

            width:px(366px);
            display: flex;
            display: -webkit-flex; /* Safari */
            align-content:space-between;
            flex-wrap:wrap;
            img{
                width:100%;
                height:px(240px);
            }
        }
    }
</style>
