<template>
    <div class="icon" :style="'padding-top:'+elementObj.instMargin/750*10+'rem'" v-if="show">
        <div class="title" v-if="elementObj.configType == 201">
            <h3><b></b>{{iconObj.titleName}}<b></b></h3>
        </div>

        <ul>
            <li v-for="info in iconObj.iconList"  @click="linkSkip(info)">
                <img :src="info.imgUrl"/>
                <p>{{info.iconName}}</p>
            </li>
        </ul>
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
                iconObj:{},
                show:false
            }
        },
        mounted() {
            // this.instContent();
          this.iconObj = this.elementObj.inst.iconGroup;
          this.show = true;
        },
        methods:{
            async instContent() {
                try {
                    const res = await instContent({elementId:this.elementObj.elementId,instId:this.elementObj.instId});

                    if (res.data.code == 0) {
                        this.iconObj = res.data.data.inst.iconGroup;
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
    .icon{
        background:#f4f4f4;

        ul{
            background:#Fff;
            display: flex;
            display: -webkit-flex; /* Safari */
            flex-wrap:wrap;
            justify-content:center;
            li{
                margin:px(18px) px(26px);
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
</style>
