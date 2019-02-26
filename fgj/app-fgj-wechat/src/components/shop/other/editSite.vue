<template>
    <div id="add_site">
        <div class="cell">
            <span class="cell_title">收货人</span>
            <input type="text" class="cell_input" v-model="siteData.goodReceiverName">
        </div>

        <div class="cell">
            <span class="cell_title">联系电话</span>
            <input type="text" class="cell_input" v-model="siteData.goodReceiverMobile">
        </div>

        <div class="cell" @click="popupVisibleSite=true">
            <span class="cell_title">所在地区</span>
            <b><p><em>{{siteData.goodReceiverProvince}}</em><em>{{siteData.goodReceiverCity}}</em><em>{{siteData.goodReceiverCounty}}</em></p><i class="iconfont icon-more"></i></b>
        </div>

        <div class="address">
            <textarea placeholder="详细地址（不少于5个字）" v-model="siteData.goodReceiverAddress"></textarea>
        </div>

        <div class="cell" style="border:none;">
            <span class="cell_title">设为默认地址</span>
            <i :class="[siteData.isDefault ? 'icon-roundcheckfill':'icon-round']" class="iconfont" @click="checkSite()"></i>
        </div>

        <mt-popup
        v-model="popupVisibleSite"
        position="bottom" class="mint-popup-site">
            <div id="propertyTable">
                <div class="site_prop_btn">
                    <ul class="clear">
                        <li v-for="(site,key) in siteActiveList" @click="checkSiteNav(site)" :class="[{active:active==site.siteActive},{site_ok:site.code != ''}]">{{site.name}}</li>
                    </ul>
                    <div :class="{site_popup_btn_click:siteAreaCode != ''}" class="site_popup_btn" @click="sitePropClick">确定</div>
                </div>
                <div class="page-tab-container">
                    <mt-tab-container v-model="active">
                        <mt-tab-container-item id="province">
                            <p v-for="province in provinceList" @click="provinceClick(province)" :class="[{checkSite:siteActiveList[1].code==province.id}]">{{province.areaname}}</p>
                        </mt-tab-container-item>
                        <mt-tab-container-item id="city">
                            <p v-for="city in cityList" @click="cityClick(city)" :class="[{checkSite:siteActiveList[2].code==city.id}]">{{city.areaname}}</p>
                        </mt-tab-container-item>
                        <mt-tab-container-item id="area">
                            <p v-for="area in areaList" @click="areaClick(area)" :class="[{checkSite:siteAreaCode==area.id}]">{{area.areaname}}</p>
                        </mt-tab-container-item>
                    </mt-tab-container>
                 </div>
            </div>
        </mt-popup>

        <div class="site_btn" @click="updateReceiverAddressByIdWithTx">
            保存
        </div>
    </div>
</template>

<script>

    import {findProvCityAreaAll,updateReceiverAddressByIdWithTx,findReceiverAddressById} from '../../../api/getData';
    import { Toast } from 'mint-ui';
    import { MessageBox } from 'mint-ui';
    export default{

        data(){
            return {
                popupVisibleSite:false,
                active:'province',
                siteActiveList:[
                    {
                        code:"0",
                        name:"请选择",
                        siteActive:'province'
                    },
                    {
                        code:"",
                        name:"请选择",
                        siteActive:'city'
                    },
                    {
                        code:"",
                        name:"请选择",
                        siteActive:'area'
                    }

                ],
                provinceList:[],
                cityList:[],
                areaList:[],
                siteAreaCode:'',
                siteData:{
                    goodReceiverAddress:'',
                    goodReceiverName:'',
                    goodReceiverMobile:'',
                    goodReceiverCountryId:0,
                    goodReceiverCountry:'中国',
                    goodReceiverProvinceId:'',
                    goodReceiverProvince:'',
                    goodReceiverCityId:'',
                    goodReceiverCity:'',
                    goodReceiverCountyId:'',
                    goodReceiverCounty:'',
                    isDefault:0
                }
            }
        },
		components: {

        },
        watch:{

        },
        created(){
            this.findProvCityAreaAll(0,0);
            this.findReceiverAddressById();
        },
        methods:{

            //根据ID查询地址详情
            async findReceiverAddressById() {
                try {
                    const res = await findReceiverAddressById({id:this.$route.params.id});
                    if (res.data.code == 0) {
                        let data = res.data.data;
                        this.siteData = {
                            goodReceiverAddress:data.goodReceiverAddress,
                            goodReceiverName:data.goodReceiverName,
                            goodReceiverMobile:data.goodReceiverMobile,
                            goodReceiverCountryId:data.goodReceiverCountryId,
                            goodReceiverCountry:data.goodReceiverCountry,
                            goodReceiverProvinceId:data.goodReceiverProvinceId,
                            goodReceiverProvince:data.goodReceiverProvince,
                            goodReceiverCityId:data.goodReceiverCityId,
                            goodReceiverCity:data.goodReceiverCity,
                            goodReceiverCountyId:data.goodReceiverCountyId,
                            goodReceiverCounty:data.goodReceiverCounty,
                            isDefault:data.isDefault,
                            id:data.id
                        }
                        this.siteActiveList[1].code = data.goodReceiverProvinceId;
                        this.siteActiveList[2].code = data.goodReceiverCityId;
                        this.siteAreaCode = data.goodReceiverCountyId;

                        this.siteActiveList[0].name = data.goodReceiverProvince;
                        this.siteActiveList[1].name = data.goodReceiverCity;
                        this.siteActiveList[2].name = data.goodReceiverCounty;

                        this.findProvCityAreaAll(data.goodReceiverProvinceId,1);
                        this.findProvCityAreaAll(data.goodReceiverCityId,2);
                        this.active = 'area';
                    } else {
                        Toast(res.data.data);
                    }

                } catch (err) {
                     Toast('网络错误');

                }
            },
            //获取省列表
            async findProvCityAreaAll(id,siteType) {
                try {
                    const res = await findProvCityAreaAll({parentno:id});
                    if (res.data.code == 0) {
                        if(siteType == 0){
                            this.provinceList = res.data.data;
                        }else if(siteType == 1){
                            this.cityList = res.data.data;
                        }else{
                            this.areaList = res.data.data;
                        }

                    } else {
                        Toast(res.data.data);
                    }

                } catch (err) {
                     Toast('网络错误');

                }
            },
            //点击省份
            provinceClick(province){
                this.findProvCityAreaAll(province.id,1);
                this.active = 'city';
                this.siteActiveList[1].code = province.id;
                this.siteActiveList[0].name = province.areaname;
                this.siteActiveList[2].code = '';
                this.siteActiveList[1].name = '请选择';
                this.siteActiveList[2].name = '请选择';
                this.siteAreaCode = '';
            },
            //点击城市
            cityClick(city){
                this.findProvCityAreaAll(city.id,2);
                this.active = 'area';
                this.siteActiveList[2].code = city.id;
                this.siteActiveList[1].name = city.areaname;
                this.siteActiveList[2].name = '请选择';
                this.siteAreaCode = '';
            },
            //点击城市
            areaClick(area){
                this.siteActiveList[2].name = area.areaname;
                this.siteAreaCode = area.id;
            },

            //确定地区
            sitePropClick(){
                if(this.siteAreaCode == ''){
                    return;
                }else{
                    let arr = this.siteActiveList;
                    this.siteData.goodReceiverProvinceId = arr[1].code;
                    this.siteData.goodReceiverProvince= arr[0].name;
                    this.siteData.goodReceiverCityId = arr[2].code;
                    this.siteData.goodReceiverCity= arr[1].name;
                    this.siteData.goodReceiverCountyId = this.siteAreaCode;
                    this.siteData.goodReceiverCounty= arr[2].name;
                    this.popupVisibleSite = false;
                }
            },

            //修改地址
            async updateReceiverAddressByIdWithTx(){
                try {
                     if(this.siteData.goodReceiverName.length==0){
                        Toast('收货人不能为空');
                        return;
                    }else if(this.siteData.goodReceiverMobile.length==0){
                        Toast('联系电话不能为空');
                        return;
                    }else if(this.siteData.goodReceiverCountyId==""){
                        Toast('请选择所在地区');
                        return;
                    }else if(this.siteData.goodReceiverAddress.length<5){
                        Toast('详细地址不少于5个字');
                        return;
                    }
                    const res = await updateReceiverAddressByIdWithTx(this.siteData);
                    if (res.data.code == 0) {
                        this.$router.go(-1);
                    } else {
                        Toast(res.data.error);
                    }

                } catch (err) {
                     Toast('网络错误');

                }
            },

            checkSite(){
                this.siteData.isDefault = this.siteData.isDefault == 0 ? 1 : 0;
            },
            checkSiteNav(site){
                if(site.code == ''){
                    return;
                }else{
                    this.active = site.siteActive;
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
@import "../../../style/component/other/addSite.scss";
</style>