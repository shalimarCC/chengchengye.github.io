<template>
    <div id="site">
        <div class="page-loadmore-wrapper" v-if="siteShow" style="height:100%;">
            <ul>
                <li v-for="site in siteList">
                    <div class="site_title" @click="updataSite(site.id)">
                        <p><span>{{site.goodReceiverName}}</span><b>{{site.goodReceiverMobile}}</b></p>
                        <p><i v-if="check == site.id">[默认地址]</i>{{site.goodReceiverProvince}}{{site.goodReceiverCity}}{{site.goodReceiverCounty}}{{site.goodReceiverAddress}}</p>
                    </div>
                    <div class="site_icon">
                        <router-link :to="'/shop/editSite/'+site.id"><i class="icon-edit_light iconfont"></i></router-link>
                    </div>
                </li>
            </ul>
        </div>
        <div class="site_error" v-else>
            <img src="../../../../static/assets/img/error/site_error.png">
            <p>收货地址在哪里</p>
        </div>
        <div class="add_btn">
            <router-link to="/shop/addSite">
                增加新地址
            </router-link>
        </div>
    </div>
</template>

<script>

    import {findReceiverAddressAll,defaultAddressById,deleteReceiverAddressWithTx} from '../../../api/getData';
    import { Toast } from 'mint-ui';
    import { MessageBox } from 'mint-ui';
    export default{

        data(){
            return {
                check:'',
                siteList:[],
                siteShow:true,
                type:''
            }
        },
		    components: {

        },
        watch:{

        },
        created(){
            this.type = this.$route.params.type;
            this.findReceiverAddressAll();
        },
        methods:{
            async findReceiverAddressAll() {
                try {
                    const res = await findReceiverAddressAll();
                    if (res.data.code == 0) {
                        if(res.data.data.list.length == 0){
                            this.siteShow = false;
                        }else{
                            this.siteShow = true;
                            this.siteList = res.data.data.list;
                            this.check = res.data.data.id;
                        }
                    } else {
                    }
                } catch (err) {
                     Toast('网络错误');
                }
            },


            async deleteReceiverAddressWithTx(id) {
                try {
                    const res = await deleteReceiverAddressWithTx({id:id});
                    if (res.data.code == 0) {

                        this.findReceiverAddressAll();
                    } else {
                        Toast(res.data.error);
                    }
                } catch (err) {
                     Toast('网络错误');
                }
            },

            updataSite(id){
                this.$store.state.Cookie.mutations.save(id,'siteId');
                // this.$store.dispatch("setSiteId",id);
                if(this.type ==1){
                  this.$router.push({path: '/shop/orderConfim'});
                }else if(this.type ==2){
                  this.$router.push({path: '/shop/orderConfim2'});
                }

            }
        }
    }
</script>

<style lang="scss" scoped>
@import "../../../style/component/orderpay/orderSiteList.scss";
</style>
