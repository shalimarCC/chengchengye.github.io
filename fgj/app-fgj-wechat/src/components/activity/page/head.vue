<template>
    <div class="head">

            <div @click="routerBack">
                <i class="iconfont icon-fanhui"></i>
            </div>
            <div>
                <span class="title">{{title}}</span>
            </div>
            <div class="my">
                <b v-if="show" @click="myActivity"></b>
            </div>
    </div>

</template>

<script>
  import Cookie from '../../../config/mUtils'
  export default{

        data(){
            return {
                title:'',
                show:true
            }
        },
		components: {

		},
        created (){
            this.title = this.$route.name;
            let str = this.$route.path;
            str = str.substring(0,9)

            if(str == "/activity"){
                this.show = true;
            }else{
                this.show =false;
            }
        },

        methods:{
            routerBack(){
                // if(this.$route.path == "/activity"){
                //     Cookie.mutations.closeWebView();
                // }else{
                    this.$router.go(-1);
                // }

            },
            myActivity(){
                this.$router.push('/myActivity');
            }
		    },
        watch:{
            "$route": {
                handler(curVal,oldVal){
                    this.title = curVal.name;
                    let str = curVal.path;
                    str = str.substring(0,9)

                    if(str == "/activity"){
                        this.show = true;
                    }else{
                        this.show =false;
                    }
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
        display: -ms-flexbox;
        display: flex;
        justify-content:space-between;
        padding:0 px(20px);
        border-bottom:0.5px solid #f4f4f4;
        line-height:px(88px);
        background:#fff;
        position:fixed;
        width: 100%;
        box-sizing: border-box;
        z-index:999;
        span{
            font-size:px(36px);
        }
    }
    .title{
        font-size:px(36px);
        font-weight:900;
    }
    .my{

        width:px(44px);
        height:px(44px);

        b{
            width:100%;
            height:100%;
            display:inline-block;
            background:url("../../../../static/assets/img/activity/my.png");
            background-size:cover;
        }
    }
</style>
