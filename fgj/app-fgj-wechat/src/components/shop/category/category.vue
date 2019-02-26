<template>
    <div class="categoryList">
        <h3><b></b>{{categoryTitle}}<b></b></h3>
        <ul>
            <li v-for="info in categoryList">
                <router-link :to="'/shop/goodsList/'+info.categoryTreeNodeId+'/1'">
                <!--<router-link :to="'/cmsGoodsList/'+info.categoryTreeNodeId+'/1/'+info.cmsPageId">-->
                    <img :src="info.categoryUrl" alt="">
                    <p>{{info.categoryName}}</p>
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script>
    import { MessageBox } from 'mint-ui';
    import { Indicator } from 'mint-ui';
    import { Toast } from 'mint-ui';
    import { findSeedCategoryTreeNodeAll } from '../../../api/getData';
    export default{
        props: {
            categoryId:{
                type:Number,
                default: function () {
                    return ''
                }
            },
            categoryTitle:{
                type:String,
                default: function () {
                    return ''
                }
            }
        },
        data(){
            return {
                categoryList:[]
            }
        },
        watch:{
            'categoryId':{
                handler(curVal,oldVal){
                    this.findSeedCategoryTreeNodeAll();
                }
            }
        },
        mounted() {
            this.findSeedCategoryTreeNodeAll();
        },
        methods:{

            async findSeedCategoryTreeNodeAll() {
                try {
                    const res = await findSeedCategoryTreeNodeAll({categoryTreeNodeId:this.categoryId});

                    if (res.data.code == 0) {
                        this.categoryList = res.data.data;
                    } else {
                        Toast(res.data.data);
                    }

                } catch (err) {
                    Toast('网络错误');
                }
            },



		}
    }
</script>

<style lang="scss" scoped>
@import "../../../style/component/category/categoryList.scss";
</style>
