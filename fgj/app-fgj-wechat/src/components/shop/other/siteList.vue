<template>
    <div id="site" class="page-loadmore-wrapper">
        <div class="page-loadmore-wrapper" v-if="siteShow" style="height:100%;">
            <ul>
                <li v-for="site in siteList">
                    <div class="site_title">
                        <p><span>{{site.goodReceiverName}}</span><b>{{site.goodReceiverMobile}}</b></p>
                        <p>{{site.goodReceiverProvince}}{{site.goodReceiverCity}}{{site.goodReceiverCounty}}{{site.goodReceiverAddress}}</p>
                    </div>

                    <div class="site_btn">
                        <div :class="[check == site.id ? 'active':'']">
                            <i :class="[check == site.id ? 'icon-roundcheckfill':'icon-round']" class="iconfont" @click="checkSite(site.id)"></i>
                            默认地址
                        </div>
                        <div class="site_btn_b">
                            <p><router-link :to="'/shop/editSite/'+site.id"><i class="iconfont icon-edit_light"></i>编辑</router-link></p>
                            <p @click="delSite(site.id)"><i class="iconfont icon-delete_light"></i>删除</p>
                        </div>
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
            }
        },
		components: {

        },
        watch:{

        },
        created(){
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
                            this.siteList = res.data.data.list;
                            this.check = res.data.data.id;
                        }

                    } else {


                    }
                } catch (err) {
                     Toast('网络错误');
                }
            },
            //默认选中
            async checkSite(id){
                try {
                    const res = await defaultAddressById({id:id});
                    if (res.data.code == 0) {
                        this.check = id;
                        Toast('设置默认地址成功');
                    } else {
                        Toast(res.data.data);
                    }
                } catch (err) {
                     Toast('网络错误');
                }
            },
            //删除
            delSite(id){
                MessageBox.confirm('确定执行此操作?').then(action => {
                    this.deleteReceiverAddressWithTx(id)
                },() => {

                });
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
        }
    }
</script>

<style lang="scss" scoped>
@import "../../../style/component/other/site.scss";
</style>
