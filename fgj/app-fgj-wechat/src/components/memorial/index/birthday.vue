<template>
    <div class="index page-loadmore-wrapper">
        <ul>
            <li v-for="(info,key) in wordsList" @click="checkId = info.id" :class="{check:checkId == info.id}">{{info.content}}</li>
        </ul>

        <div class="btn" @click="sendCongr" :class="{disabled:checkId == ''}">发送</div>
    </div>
</template>

<script>
    import { Indicator } from 'mint-ui';
    import { Toast } from 'mint-ui';
    import {congrWords , sendCongr} from '../../../api/getData';

    export default{

        data(){
            return {
                wordsList:[],
                checkId:'',
            }
        },

		components: {

		},
        mounted() {
            this.findCongrWords();
        },
        methods:{
            //获取祝福语列表
            async findCongrWords() {
                try {
                    Indicator.open();
                    const res = await congrWords();
                    if (res.data.code == 0) {
                        Indicator.close();
                        this.wordsList = res.data.data.congrWords;
                        //this.checkId = res.data.data.congrWords[0].id;
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
            async sendCongr() {
                try {
                    if(this.checkId == ''){
                        return;
                    }
                    const res = await sendCongr({congrWordsId:this.checkId,receiverIdList:JSON.stringify(this.$store.state.checkMemorial)});
                    if (res.data.code == 0) {
                        Toast('祝福发送成功');
                        this.$router.go(-1);
                    } else {
                        Toast(res.data.error);
                    }
                } catch (err) {
                    Toast('网络错误');
                    this.cartType = false;
                }
            },

		}
    }
</script>

<style lang="scss" scoped>
@import "../../../style/memorial/birthday.scss";
</style>