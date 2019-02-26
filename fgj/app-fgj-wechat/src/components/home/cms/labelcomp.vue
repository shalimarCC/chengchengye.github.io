<template>
    <div class="label" :style="'padding-top:'+elementObj.instMargin/750*10+'rem'" v-if="show">
        <ul>
            <li v-for="info in labelObj.lableList">
                <img :src="labelObj.imgUrl" />
                <span>{{info.labelName}}</span>
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
                labelObj:{},
                show:false
            }
        },
        mounted() {
            // this.instContent();
          this.labelObj = this.elementObj.inst.labelGroup;
          this.show = true;
        },
        methods:{
            async instContent() {
                try {
                    const res = await instContent({elementId:this.elementObj.elementId,instId:this.elementObj.instId});

                    if (res.data.code == 0) {
                        this.labelObj = res.data.data.inst.labelGroup;
                        this.show = true;
                    } else {

                    }

                } catch (err) {
                     Toast('网络错误');

                }
            },
		}
    }
</script>

<style lang="scss" scoped>
    $baseWidth:750px;
    @function px($val) {
        @return $val/$baseWidth*10+rem;
    }
    .label{
        background:#f4f4f4;
        ul{
            background:#fff;
          li{
            display: flex;
            align-items: center;
          }
        }
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

    ul{
        display: flex;
        display: -webkit-flex; /* Safari */
        align-items:center;
        justify-content:space-around;
        height:px(68px);
        li{
            display: flex;
            display: -webkit-flex; /* Safari */
            img{
                width:px(28px);
                height:px(28px);
                margin-right:px(14px);
            }
            span{
                font-size:px(24px);
                color:#323232;
            }
        }
    }
</style>
