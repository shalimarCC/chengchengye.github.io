<template>
    <div class="index page-loadmore-wrapper"
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="loading"
            infinite-scroll-distance="10">
        <ul>
            <li class="clear" v-for="item in userList">
                <div class="cover"><img v-lazy="item.face+'?imageMogr2/size-limit/100k!'"></div>
                <span>{{item.name}}</span>
            </li>
        </ul>
    </div>
</template>

<script>
    import {activityUserPage} from '../../../api/getData';
    import { Toast } from 'mint-ui';
    import { MessageBox } from 'mint-ui';
    import { Indicator } from 'mint-ui';
    var myScroll=null;
    export default{

        data(){
            return {
                pageNo:1,
                userList:[],
                loading:false,
            }
        },

		components: {

		},
        mounted() {

        },

        methods:{
            async findActivityUserPage() {
                try {
                    Indicator.open();
                    const res = await activityUserPage({pageNo:this.pageNo,id:this.$route.params.id});
                    if (res.data.code == 0) {
                        Indicator.close();
                        if(res.data.data.userList.list.length == 0){
                            this.loading = true;
                        }else{
                            this.pageNo++;
                            var thtf = this;
                            $.each(res.data.data.userList.list,function(key,info){
                                thtf.userList.push(info);
                            })
                        }
                    } else {
                        this.cartType = false;
                        Indicator.close();
                    }
                } catch (err) {
                     Toast('网络错误');
                     this.cartType = false;
                     Indicator.close();
                }
            },
            loadMore(){
                this.findActivityUserPage();

            },



		}
    }
</script>

<style lang="scss" scoped>

@import "../../../style/activity/activityPeople.scss";
</style>