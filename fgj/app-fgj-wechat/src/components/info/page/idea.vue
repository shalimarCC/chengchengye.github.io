<template>
    <div id="idea">
        <div  class="form">
            <textarea placeholder="请输入反馈，我们将为您不断改进" v-model="feedback"></textarea>
        </div>

        <!--<div class="btn" @click="insertFeedbackWithTx">提交</div>-->
    </div>
</template>

<script>
    import { MessageBox } from 'mint-ui';
    import { Toast } from 'mint-ui';
    import {insertFeedbackWithTx} from '../../../api/getData';
    export default{

        data(){
            return {
                // feedback:'',
            }
        },
		    components: {
        },
        computed:{
            feedback:{
                get(){
                    return this.$store.state.feedback
                },
                set(val){
                    this.$store.commit('setFeedback',val)
                }
            }
        },
        created(){

        },
        methods:{
            async insertFeedbackWithTx() {
                try {
                    const res = await insertFeedbackWithTx({feedback:this.feedback});

                    if (res.data.code == 0) {
                        Toast('提交反馈成功');
                        this.$router.go(-1);
                    } else {
                        Toast(res.data.error);
                    }

                } catch (err) {
                    Toast(err);
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

#idea{
    background:#f4f4f4;
    position:relative;
    width:100%;
    height:100%;
    padding-top:px(20px);
    .form{
        background:#fff;
        width: 92%;
        height: px(220px);
        margin: 0 auto;
        border-radius:10px;
        overflow:hidden;
    }
    textarea{
        border: none;
        padding:px(10px);
        width: 100%;
        height: 90%;
        background: #fff;
        font-size: px(28px);
        color:#787878;
        resize:none;
    }
}

.btn{
    position:absolute;
    bottom:px(20px);
    width:100%;
    height: px(80px);
    line-height:px(80px);
    text-align:center;
    color:#Fff;
    background:#ff8546;
    font-size:px(28px);
}


</style>
