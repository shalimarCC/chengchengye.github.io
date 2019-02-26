<template>
    <div class="index page-loadmore-wrapper">
        <ul>
            <li class="clear" v-for="i in 5">
                <router-link to="#" style="display:block;width:100%;height:100%;" class="clear">
                    <div class="pe_left">
                        <img src="../../../../static/assets/img/insurance/main_list.png">
                    </div>
                    <div class="pe_right">
                        <div class="pe_title">
                            <h4>爱康国宾 职场白领免费升级肿瘤基因检测（男女通用）</h4>
                        </div>
                        <div class="pe_sold"></div>
                        <div class="pe_price">
                            <del>价值:&yen;999</del>
                            <p>
                                积分价:<span>&yen;2680.00</span>
                            </p>
                        </div>
                    </div>
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script>

    var myScroll=null;
    export default{

        data(){
            return {

            }
        },

		components: {

		},
        mounted() {

        },
        methods:{

		}
    }
</script>

<style lang="scss" scoped>
@import "../../../style/insurance/peList.scss";
</style>
