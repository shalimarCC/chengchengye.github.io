<template>
    <div class="head">

            <div style="float:left;position:absolute;" @click="routerBack">
                <i class="iconfont icon-fanhui"></i>
            </div>
            <span class="title">{{title}}</span>

    </div>

</template>

<script>

    import Cookie from '../../../config/mUtils'
    export default{
        data(){

            return {
                title:'',
            }
        },
		components: {

		},
        created (){
            this.title = this.$route.name;
        },
        methods:{
            routerBack(){
                // if(this.$route.path == "/memorial"){
                //     Cookie.mutations.closeWebView();
                // }else{
                    this.$router.go(-1);
                // }

            }
		},
        watch:{
            "$route": {
                handler(curVal,oldVal){
                    this.title = curVal.name;
                },
                deep:true
            }
        }
    }
</script>

<style lang="scss" scoped>
    $baseWidth:750px;
    @function px($val) {
        @return $val/$baseWidth*10+rem;
    }

    .head{
        text-align:center;
        padding:0 px(20px);
        border-bottom:0.5px solid #f4f4f4;
        line-height:px(88px);
        span{
            font-size:px(36px);
        }
    }
    .title{
        font-size:px(36px);
        font-weight:900;
    }
</style>
